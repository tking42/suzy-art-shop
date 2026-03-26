const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Stripe = require("stripe");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const Order = require("./models/Order");
const Product = require("./models/Product");
const { createPendingOrder } = require("./controllers/orderController");
const { sendOrderConfirmation, sendAdminOrderNotification } = require("./utils/email");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Allow requests from the React frontend
app.use(cors());

// ─── Stripe Webhook ───────────────────────────────────────────────────────────
// This must be registered BEFORE express.json() because Stripe signature
// verification requires the raw request body. Once express.json() parses it,
// the raw bytes are lost and verification will fail.
//
// Flow:
//   1. User completes payment on the Payment page
//   2. Stripe calls this endpoint with a signed event payload
//   3. We verify the signature using STRIPE_WEBHOOK_SECRET to confirm it
//      genuinely came from Stripe (not a spoofed request)
//   4. On payment_intent.succeeded we:
//      a. Retrieve the charge to get the customer's email from billing details
//      b. Mark the order as Paid and store the email
//      c. Decrement stock for each purchased item
//      d. Send a confirmation email to the customer
//
// Local development: use `stripe listen --forward-to localhost:5050/api/webhook`
// which provides its own signing secret (different from the dashboard one).
app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    // Mark the pending order as Paid
    const order = await Order.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      { status: "Paid" },
      { new: true }
    );

    if (order) {
      // Decrement stock for each item in the order
      await Promise.all(
        order.items.map((item) =>
          Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          })
        )
      );

      // Send confirmation email to customer and notification to admin.
      // Failures are caught separately so they don't affect order or stock updates.
      if (order.email) {
        try {
          await sendOrderConfirmation(order.email, order);
          await Order.findByIdAndUpdate(order._id, { emailSent: true });
        } catch (err) {
          console.error("Failed to send confirmation email:", err.message);
        }
      }

      try {
        await sendAdminOrderNotification(order);
      } catch (err) {
        console.error("Failed to send admin notification:", err.message);
      }
    }
  }

  res.json({ received: true });
});

// Parse JSON bodies for all other routes
app.use(express.json());

// Serve uploaded product images
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ─── Image Upload ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const { protect, isAdmin } = require("./middleware/authMiddleware");

app.post("/api/upload", protect, isAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => res.send("API is running"));

// ─── Payment Intent ───────────────────────────────────────────────────────────
// Called when the user proceeds from the basket to the payment page.
// Creates a Stripe PaymentIntent (which gives the client a secret to initialise
// the Stripe Payment Element) and simultaneously saves a pending Order to the
// database. The order is later updated to "Paid" by the webhook above.
// Amounts are in pence (GBP) as required by Stripe.
const SHIPPING_COST_PENCE = 499; // £4.99

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { cart, email, shippingAddress } = req.body;

    const itemsAmount = cart.reduce(
      (sum, item) => sum + Math.round(item.price * item.quantity * 100),
      0
    );
    const amount = itemsAmount + SHIPPING_COST_PENCE;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      payment_method_types: ["card"],
    });

    // Save a pending order with the customer's email and shipping address straight away
    await createPendingOrder(cart, paymentIntent.id, email, shippingAddress);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Stripe error" });
  }
});

// ─── Database & Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5050;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
