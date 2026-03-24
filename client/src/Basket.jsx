import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import { ToastContext } from "./context/ToastContext";
import ConfirmModal from "./components/ConfirmModal";
import "./Basket.css";
import axios from "axios";

const Basket = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/shop");
    }
  }, [cart, navigate]);

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      setPendingRemove(item);
    } else {
      decreaseQty(item._id);
    }
  };

  const confirmRemove = () => {
    removeFromCart(pendingRemove._id);
    addToast(`${pendingRemove.name} removed from basket`);
    setPendingRemove(null);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) return null;

  return (
    <div className="basket-page">
      {pendingRemove && (
        <ConfirmModal
          message={`Remove "${pendingRemove.name}" from your basket?`}
          onConfirm={confirmRemove}
          onCancel={() => setPendingRemove(null)}
        />
      )}
      <h1>Basket</h1>

      {cart.map(item => (
        <div className="basket-item" key={item._id}>
          <img src={item.image} alt={item.name} />

          <div className="basket-info">
            <h3>{item.name}</h3>
            <p>£{item.price}</p>

            <div className="qty-controls">
              <button onClick={() => handleDecrease(item)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(item._id)}>+</button>
            </div>
          </div>

          <div className="item-total">
            £{item.price * item.quantity}
          </div>
        </div>
      ))}

      <div className="basket-total">
        <h2>Total: £{total.toFixed(2)}</h2>
      </div>

      <button
        className="buy-button"
        onClick={async () => {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/create-checkout-session`,
              { cart }
            );
            window.location.href = res.data.url;
          } catch (error) {
            console.error("Basket error:", error);
            addToast("Something went wrong. Please try again.", "error");
          }
        }}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default Basket;
