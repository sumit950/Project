import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Product.css";

const Product = ({ updateCart }) => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add items to the cart!");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/purchase",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      updateCart(response.data.cart.items);
      alert("Product added to cart!");
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error);
      alert("Failed to add product to cart.");
    }
  };

  // ✅ Filter products based on search query from URL
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-container">
      <h1 className="product-title">Our Products</h1>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">₹{product.price}</p>
              <button className="btn" onClick={() => handleBuyNow(product)}>
                Buy Now
              </button>
            </div>
          ))
        ) : (
          <p>No products found.</p> // ✅ Message if no match found
        )}
      </div>
    </div>
  );
};

export default Product;
