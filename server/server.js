const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Route imports
// const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
// const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("API is running");
});

// Connect DB and start server
const PORT = process.env.PORT || 5050;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { cart } = req.body;

    const amount = cart.reduce(
      (sum, item) => sum + Math.round(item.price * item.quantity * 100),
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Stripe error" });
  }
});