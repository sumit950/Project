import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaHome, FaServicestack, FaProductHunt, FaInfoCircle, FaUser } from "react-icons/fa";
import "./SidePanel.css";

const SidePanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className={`side-panel ${isOpen ? "open" : ""}`}>
      {/* Close Button */}
      <div className="close-btn" onClick={onClose}>
        <FaTimes className="close-icon" />
      </div>

      {/* Navigation Links */}
      <ul>
        <li onClick={() => { navigate("/"); onClose(); }}>
          <FaHome className="icon" /> Home
        </li>
        <li onClick={() => { navigate("/service"); onClose(); }}>
          <FaServicestack className="icon" /> Services
        </li>
        <li onClick={() => { navigate("/product"); onClose(); }}>
          <FaProductHunt className="icon" /> Products
        </li>
        <li onClick={() => { navigate("/aboutus"); onClose(); }}>
          <FaInfoCircle className="icon" /> About Us
        </li>
        <li onClick={() => { navigate("/signin"); onClose(); }}>
          <FaUser className="icon" /> Sign In
        </li>
        <li onClick={() => { navigate("/signup"); onClose(); }}>
          <FaUser className="icon" /> Sign Up
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
