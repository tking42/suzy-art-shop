import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Nav.css";

const Nav = () => {
  const { cart } = useContext(CartContext);
  const { pathname } = useLocation();

  const isShopSection = pathname === "/shop" || pathname.startsWith("/shop/");
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav>
      <div className="navContainer">
        <h1>Tea and Cake Productions</h1>
        <div className="navButtonsContainer">
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? "navButton active" : "navButton"}
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) => isActive ? "navButton active" : "navButton"}
          >
            Shop
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? "navButton active" : "navButton"}
          >
            Contact
          </NavLink>
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