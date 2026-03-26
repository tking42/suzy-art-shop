import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import { ToastContext } from "./context/ToastContext";
import ConfirmModal from "./components/ConfirmModal";
import "./Basket.css";

const SERVER_BASE = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

const getImageSrc = (image) => {
  if (!image) return "https://via.placeholder.com/220";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/uploads/")) return `${SERVER_BASE}${image}`;
  if (!image.startsWith("/")) return "/" + image;
  return image;
};

const Basket = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    if (cart.length === 0) navigate("/shop");
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

      <div className="basket-header">
        <h1 className="basket-title">Basket</h1>
        <span className="basket-count">{cart.length} {cart.length === 1 ? "item" : "items"}</span>
      </div>

      <div className="basket-items">
        {cart.map(item => (
          <div className="basket-item" key={item._id}>
            <div className="basket-item-image">
              <img src={getImageSrc(item.image)} alt={item.name} />
            </div>

            <div className="basket-item-info">
              <p className="basket-item-name">{item.name}</p>
              <p className="basket-item-price">£{item.price.toFixed(2)}</p>
            </div>

            <div className="basket-item-right">
              <div className="qty-controls">
                <button onClick={() => handleDecrease(item)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item._id)}>+</button>
              </div>
              <p className="basket-item-total">£{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="basket-footer">
        <div className="basket-total">
          <span>Total</span>
          <span>£{total.toFixed(2)}</span>
        </div>
        <button className="basket-checkout-btn" onClick={() => navigate("/payment")}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Basket;
