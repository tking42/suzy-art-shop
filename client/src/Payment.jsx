import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CartContext } from "./context/CartContext";
import { ToastContext } from "./context/ToastContext";
import axios from "axios";
import "./Payment.css";

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
    ".Input": {
      border: "1px solid #ccc",
      boxShadow: "none",
      padding: "10px 12px",
    },
    ".Input:focus": {
      border: "1px solid #111",
      boxShadow: "none",
      outline: "none",
    },
    ".Label": {
      textTransform: "uppercase",
      letterSpacing: "1px",
      fontSize: "0.7rem",
      marginBottom: "6px",
    },
    ".Tab": {
      border: "1px solid #ddd",
      boxShadow: "none",
    },
    ".Tab--selected": {
      border: "1px solid #111",
      boxShadow: "none",
    },
  },
};

const PaymentForm = () => {
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
      },
    });

    if (error) {
      addToast(error.message, "error");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading} className="pay-button">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Payment = () => {
  const { cart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/shop");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, { cart })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch(() => {
        addToast("Could not initialise payment. Please try again.", "error");
        navigate("/basket");
      });
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!clientSecret) return <p className="payment-loading">Loading...</p>;

  return (
    <div className="payment-page">
      <h1>Payment</h1>

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
          <div className="summary-total">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance,
            fonts: [
              {
                cssSrc:
                  "https://api.fontshare.com/v2/css?f[]=clash-display@400&display=swap",
              },
            ],
          }}
        >
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
