import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [address, setAddress] = useState(""); // Address state

  useEffect(() => {
    fetchCart();
  }, []);

  /** 🔹 Fetch Cart Items */
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("⚠ Access Denied. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:3001/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🛒 Cart Data Fetched:", response.data);
      setCart(response.data.cart || { items: [] });
    } catch (err) {
      console.error("❌ Error fetching cart:", err.response?.data || err);
      setError("❌ Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Update Item Quantity */
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3001/api/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("❌ Error updating cart:", err.response?.data || err);
      setError("❌ Failed to update cart");
    }
  };

  /** 🔹 Remove Item from Cart */
  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("❌ Error removing item:", err.response?.data || err);
      setError("❌ Failed to remove item");
    }
  };

  /** 🔹 Clear Entire Cart */
  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:3001/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("❌ Error clearing cart:", err.response?.data || err);
      setError("❌ Failed to clear cart");
    }
  };

  /** 🔹 Handle Checkout */
  const handleProceedToPayment = () => {
    setShowPaymentModal(true); // Show address modal
  };

  /** 🔹 Confirm Payment (with Address) */
  const confirmPayment = () => {
    if (!address.trim()) {
      alert("⚠ Please enter your shipping address.");
      return;
    }

    setShowPaymentModal(false);
    localStorage.setItem("shippingAddress", address); // Store address (optional)
    window.location.href = "/payment"; // Redirect to payment page
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p className="empty-cart">🛒 Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.items.map((item, index) => (
            <div key={item.productId?._id || index} className="cart-item">
              <img
                src={item.productId?.image || "default-image.jpg"}
                alt={item.productId?.name}
                className="cart-image"
              />
              <div className="cart-details">
                <h3>{item.productId?.name}</h3>
                <p>Price: ${Number(item.productId?.price || 0).toFixed(2)}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    ➖
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                  >
                    ➕
                  </button>
                </div>
                <button onClick={() => removeItem(item.productId._id)} className="remove-button">
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="clear-cart-button">
            🗑 Clear Cart
          </button>
          <button onClick={handleProceedToPayment} className="checkout-button">
            Proceed to Payment
          </button>
        </div>
      )}

      {/* 🔹 Address Input Modal */}
      {showPaymentModal && (
        <div className="payment-modal">
          <div className="modal-content">
            <h2>Enter Shipping Address</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your shipping address"
              rows="3"
              className="address-input"
            ></textarea>
            <div className="modal-actions">
              <button onClick={confirmPayment} className="confirm-button">
                Proceed to Payment
              </button>
              <button onClick={() => setShowPaymentModal(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
