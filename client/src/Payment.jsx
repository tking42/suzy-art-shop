import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CartContext } from "./context/CartContext";
import { ToastContext } from "./context/ToastContext";
import axios from "axios";
import "./Payment.css";

const SHIPPING_COST = 4.99;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const appearance = {
  theme: "flat",
  variables: {
    colorPrimary: "#111111",
    colorBackground: "#ffffff",
    colorText: "#111111",
    colorDanger: "#c0392b",
    colorTextPlaceholder: "#999999",
    fontFamily: '"Clash Display", sans-serif',
    fontSizeBase: "14px",
    borderRadius: "0px",
    spacingUnit: "5px",
  },
  rules: {
    ".Input": { border: "1px solid #ccc", boxShadow: "none", padding: "10px 12px" },
    ".Input:focus": { border: "1px solid #111", boxShadow: "none", outline: "none" },
    ".Label": { textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem", marginBottom: "6px" },
    ".Tab": { border: "1px solid #ddd", boxShadow: "none" },
    ".Tab--selected": { border: "1px solid #111", boxShadow: "none" },
  },
};

// Inner form — must live inside <Elements> to access useStripe/useElements
const PaymentForm = ({ email }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { addToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        payment_method_data: {
          billing_details: { email },
        },
      },
    });

    if (error) {
      addToast(error.message, "error");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement options={{ fields: { billingDetails: { email: "never" } } }} />
      <button type="submit" disabled={!stripe || loading} className="pay-button">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const emptyAddress = { name: "", line1: "", line2: "", city: "", postcode: "" };

const Payment = () => {
  const { cart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingIntent, setLoadingIntent] = useState(false);

  useEffect(() => {
    if (cart.length === 0) navigate("/shop");
  }, []);

  const handleAddressChange = (e) => {
    setShippingAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoadingIntent(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        { cart, email, shippingAddress }
      );
      setClientSecret(res.data.clientSecret);
    } catch {
      addToast("Could not initialise payment. Please try again.", "error");
    } finally {
      setLoadingIntent(false);
    }
  };

  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = itemsTotal + SHIPPING_COST;

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h1 className="payment-title">Checkout</h1>
      </div>

      <div className="payment-layout">
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div className="summary-item" key={item._id}>
              <span className="summary-name">{item.name}</span>
              <span className="summary-qty">x{item.quantity}</span>
              <span className="summary-price">£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-item summary-shipping">
            <span className="summary-name">Shipping (UK)</span>
            <span className="summary-price">£{SHIPPING_COST.toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>£{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {!clientSecret ? (
          <form onSubmit={handleDetailsSubmit} className="payment-form">
            <div className="form-section-label">Contact</div>
            <div className="checkout-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-section-label">Shipping Address</div>
            <div className="checkout-field">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" value={shippingAddress.name} onChange={handleAddressChange} required />
            </div>
            <div className="checkout-field">
              <label htmlFor="line1">Address Line 1</label>
              <input id="line1" name="line1" value={shippingAddress.line1} onChange={handleAddressChange} required />
            </div>
            <div className="checkout-field">
              <label htmlFor="line2">Address Line 2 <span className="optional">(optional)</span></label>
              <input id="line2" name="line2" value={shippingAddress.line2} onChange={handleAddressChange} />
            </div>
            <div className="checkout-field-row">
              <div className="checkout-field">
                <label htmlFor="city">City</label>
                <input id="city" name="city" value={shippingAddress.city} onChange={handleAddressChange} required />
              </div>
              <div className="checkout-field">
                <label htmlFor="postcode">Postcode</label>
                <input id="postcode" name="postcode" value={shippingAddress.postcode} onChange={handleAddressChange} required />
              </div>
            </div>

            <button type="submit" disabled={loadingIntent} className="pay-button">
              {loadingIntent ? "Loading..." : "Continue to Payment"}
            </button>
          </form>
        ) : (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance,
              fonts: [{ cssSrc: "https://api.fontshare.com/v2/css?f[]=clash-display@400&display=swap" }],
            }}
          >
            <PaymentForm email={email} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Payment;
