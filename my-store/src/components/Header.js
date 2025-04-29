import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaShoppingCart, FaUser, FaBars, FaTimes, 
  FaHome, FaServicestack, FaProductHunt, 
  FaInfoCircle 
} from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Add state for search input

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/signin");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/product?search=${searchQuery}`); // ✅ Redirect with search query
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>Digital Nexus</div>
        <div className="menu-toggle" onClick={toggleMenu}>
          <FaBars className="menu-icon" />
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // ✅ Store input value
          />
          <button onClick={handleSearch}>Search</button> {/* ✅ Call search function */}
        </div>
        <div className="header-icons">
          <FaShoppingCart className="icon" title="Cart" onClick={() => navigate("/cart")} />
          <FaUser className="icon" title="Profile" onClick={() => navigate("/profile")} />
          {isAuthenticated && (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </header>

      <div className={`side-panel ${isMenuOpen ? "open" : ""}`}>
        <div className="side-panel-logo" onClick={() => { navigate("/"); toggleMenu(); }}>
          Digital Nexus
        </div>
        <div className="close-btn" onClick={toggleMenu}>
          <FaTimes className="close-icon" />
        </div>
        <ul>
          <li onClick={() => { navigate("/"); toggleMenu(); }}>
            <FaHome className="icon" /> Home
          </li>
          <li onClick={() => { navigate("/service"); toggleMenu(); }}>
            <FaServicestack className="icon" /> Services
          </li>
          <li onClick={() => { navigate("/product"); toggleMenu(); }}>
            <FaProductHunt className="icon" /> Products
          </li>
          <li onClick={() => { navigate("/aboutus"); toggleMenu(); }}>
            <FaInfoCircle className="icon" /> About Us
          </li>
          <li onClick={() => { navigate("/service-provider-registration"); toggleMenu(); }}>
            <FaUser className="icon" /> Service Provider Registration
          </li>
          {!isAuthenticated ? (
            <>
              <li onClick={() => { navigate("/signin"); toggleMenu(); }}>
                <FaUser className="icon" /> Sign In
              </li>
              <li onClick={() => { navigate("/signup"); toggleMenu(); }}>
                <FaUser className="icon" /> Sign Up
              </li>
              <li onClick={() => { navigate("/bookingform"); toggleMenu(); }}>
            <FaInfoCircle className="icon" /> Booking Form
          </li>
            </>
          ) : (
            <li onClick={handleLogout}>
              <FaUser className="icon" /> Logout
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Header;
