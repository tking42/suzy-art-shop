import { useEffect, useContext, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import "./Success.css";
import { CartContext } from "./context/CartContext";
import axios from "axios";

const Success = () => {
  const { clearCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(null);

  const status = searchParams.get("redirect_status");
  const paymentIntentId = searchParams.get("payment_intent");

  useEffect(() => {
    if (!status) {
      navigate("/shop");
      return;
    }

    if (status === "succeeded") {
      clearCart();

      const poll = async (attemptsLeft) => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/orders/by-payment-intent/${paymentIntentId}`
          );
          if (res.data.emailSent || attemptsLeft <= 1) {
            setEmailSent(res.data.emailSent);
          } else {
            setTimeout(() => poll(attemptsLeft - 1), 1500);
          }
        } catch {
          setEmailSent(false);
        }
      };

      poll(5);
    }
  }, []);

  if (status === "succeeded") {
    return (
      <div className="success-page">
        <p className="success-label">Order Confirmed</p>
        <h1 className="success-heading">Thank You</h1>
        <div className="success-divider" />
        <p className="success-body">Your order has been received and we'll get to work on it straight away.</p>
        {emailSent === true && (
          <p className="success-note">A confirmation email has been sent with your order details. Check your spam folder if you don't see it.</p>
        )}
        {emailSent === false && (
          <p className="success-error">We were unable to send a confirmation email — please keep this page for your records.</p>
        )}
        <Link to="/shop">
          <button>Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="success-page">
      <p className="success-label">Payment Failed</p>
      <h1 className="success-heading">Something went wrong</h1>
      <div className="success-divider" />
      <p className="success-body">Your payment could not be processed. Please try again.</p>
      <Link to="/basket">
        <button>Back to Basket</button>
      </Link>
    </div>
  );
};

export default Success;
