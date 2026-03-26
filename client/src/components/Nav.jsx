import { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Nav.css";

const Nav = () => {
  const { cart } = useContext(CartContext);
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isShopSection = pathname === "/shop" || pathname.startsWith("/shop/");
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const close = () => setMenuOpen(false);

  return (
    <nav>
      <div className="navContainer">
        <h1>Tea and Cake Productions</h1>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navButtonsContainer ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={close} className={({ isActive }) => isActive ? "navButton active" : "navButton"}>Home</NavLink>
          <NavLink to="/shop" onClick={close} className={({ isActive }) => isActive ? "navButton active" : "navButton"}>Shop</NavLink>
          <NavLink to="/about" onClick={close} className={({ isActive }) => isActive ? "navButton active" : "navButton"}>About</NavLink>
        </div>
      </div>

      {isShopSection && (
        <div className="subNav">
          {itemCount > 0 ? (
            <NavLink to="/basket" className="subNavButton">
              Basket <span className="basketCount">{itemCount}</span>
            </NavLink>
          ) : (
            <span className="subNavButton subNavButton--disabled">Basket</span>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
