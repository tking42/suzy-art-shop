import { useEffect, useContext } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CartContext } from "./context/CartContext";

const Success = () => {
  const { clearCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("redirect_status");

  useEffect(() => {
    if (!status) {
      navigate("/shop");
      return;
    }
    if (status === "succeeded") {
      clearCart();
    }
  }, []);

  if (status === "succeeded") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Payment Successful</h1>
        <p>Thank you for your purchase!</p>
        <Link to="/shop">
          <button style={{ marginTop: "32px" }}>Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Payment Unsuccessful</h1>
      <p>Something went wrong with your payment. Please try again.</p>
      <Link to="/basket">
        <button style={{ marginTop: "32px" }}>Back to Basket</button>
      </Link>
    </div>
  );
};

export default Success;
