import { useContext } from "react";
import { CartContext } from "./context/CartContext";
import "./Checkout.css";

const Checkout = () => {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart
  } = useContext(CartContext);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {cart.map(item => (
        <div className="checkout-item" key={item._id}>
          <img src={item.image} alt={item.name} />

          <div className="checkout-info">
            <h3>{item.name}</h3>
            <p>£{item.price}</p>

            <div className="qty-controls">
              <button onClick={() => decreaseQty(item._id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(item._id)}>+</button>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeFromCart(item._id)}
            >
              Remove
            </button>
          </div>

          <div className="item-total">
            £{item.price * item.quantity}
          </div>
        </div>
      ))}

      <div className="checkout-total">
        <h2>Total: £{total.toFixed(2)}</h2>
      </div>

      <button className="buy-button">
        Proceed to Payment
      </button>
    </div>
  );
};

export default Checkout;