import React from "react";
import { NavLink } from "react-router-dom";
import "./Nav.css";

const Nav = () => {
  return (
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
  );
};

export default Nav;