import { useEffect, useContext } from "react";
import { CartContext } from "./context/CartContext";

const Success = () => {
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Payment Successful</h1>
      <p>Thank you for your purchase!</p>
    </div>
  );
};

export default Success;
