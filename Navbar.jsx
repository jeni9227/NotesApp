import React from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <div className="Nav">

      <div className="left">
        <b>📝 Notes</b>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/favs">Favs</Link>
      </div>

      <div className="right">
        <input type="text" placeholder="Search" />
        <button>Light</button>
      </div>

    </div>
  );
}

export default Navbar;