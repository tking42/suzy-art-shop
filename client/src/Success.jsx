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
        <h1>Payment Successful</h1>
        <p>Thank you for your purchase!</p>
        {emailSent === true && (
          <p>A confirmation email has been sent with your order details. Please check your spam folder if you cannot see it.</p>
        )}
        {emailSent === false && (
          <p>We were unable to send a confirmation email. Please keep your order reference for your records.</p>
        )}
        <Link to="/shop">
          <button style={{ marginTop: "32px" }}>Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="success-page">
      <h1>Payment Unsuccessful</h1>
      <p>Something went wrong with your payment. Please try again.</p>
      <Link to="/basket">
        <button style={{ marginTop: "32px" }}>Back to Basket</button>
      </Link>
    </div>
  );
};

export default Success;
