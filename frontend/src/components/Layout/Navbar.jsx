import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/navbarStyles.css";
import logo from "/images/logo.png";
import cart_icon from "/images/cart.png";
import { logoutUser } from "../../services/authService";
import { isAuthenticated, getUserFromToken } from "../../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      const userData = getUserFromToken();
      setUser(userData);
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
  };

  const isLoggedIn = !!user;

  return (
    <nav className="cakehub-nav-bar">
      <div className="cakehub-nav-container">
        {/* Logo */}
        <div className="cakehub-nav-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Company Logo" style={{ cursor: "pointer" }} />
        </div>

        {/* Navigation Links */}
        <div className="cakehub-nav-middle">
          <ul className="cakehub-nav-links">
            {/* Admin Links */}
            {isLoggedIn && user?.role === "admin" && (
              <>
                <li>
                  <Link to="/adminpanel" className="cakehub-nav-link">
                    Admin Panel
                  </Link>
                </li>
                <li>
                  <Link to="/bakers" className="cakehub-nav-link">
                    Bakers
                  </Link>
                </li>
                <li>
                  <Link to="/admincontact" className="cakehub-nav-link">
                    Contact Messages
                  </Link>
                </li>
              </>
            )}

            {/* Baker Links */}
            {isLoggedIn && user?.role === "baker" && (
              <>
                <li>
                  <Link to="/bkdashboard" className="cakehub-nav-link">
                    Baker Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/myproducts" className="cakehub-nav-link">
                    My Products
                  </Link>
                </li>
                <li>
                  <Link to="/bcrequests" className="cakehub-nav-link">
                    Design Requests
                  </Link>
                </li>
              </>
            )}

            {/* Customer Links */}
            {isLoggedIn && user?.role === "customer" && (
              <>
                <li>
                  <Link to="/" className="cakehub-nav-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="cakehub-nav-link">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" className="cakehub-nav-link">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/cakedesign" className="cakehub-nav-link">
                    Cake Design
                  </Link>
                </li>
              </>
            )}

            {/* Common Links */}
            {isLoggedIn && user?.role !== "admin" && (
              <>
                <li>
                  <Link to="/about" className="cakehub-nav-link">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="cakehub-nav-link">
                    Contact
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Right Section */}
        <div className="cakehub-nav-right">
          {isLoggedIn && user?.role === "customer" && (
            <Link to="/cart" className="cakehub-nav-cart-icon">
              <img src={cart_icon} alt="Cart" />
            </Link>
          )}

          {isLoggedIn ? (
            <div className="cakehub-user-dropdown">
              <span className="cakehub-user-greeting">Hello, {user?.name}</span>
              <div className="cakehub-dropdown-content">
                {user?.role !== "admin" && <Link to="/profile">Profile</Link>}
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="cakehub-login-button">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
