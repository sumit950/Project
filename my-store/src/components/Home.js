import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("bestseller"); // Default category

  const categories = ["bestseller", "new", "mostviewed", "mostpurchased"];

  // ✅ Memoize fetch function to prevent unnecessary re-renders
  const fetchProductsByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    setProducts([]); // Clear previous products

    try {
      const response = await fetch(`http://localhost:3001/api/products/category/${category.toLowerCase()}`);

      if (!response.ok) {
        throw new Error(response.status === 400 ? "Invalid category." : "Failed to fetch products.");
      }

      const data = await response.json();
      console.log("Received Data:", data);

      // ✅ Handle empty categories properly
      if (data.length === 0) {
        setError(`No products found in the '${category}' category.`);
      } else {
        setProducts(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch products when `selectedCategory` changes
  useEffect(() => {
    fetchProductsByCategory(selectedCategory);
  }, [fetchProductsByCategory, selectedCategory]);

  return (
    <div className="home-container">
      {/* ✅ Category Selection */}
      <div className="product-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)} // ✅ Only update category
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* ✅ Product Display Section */}
      <div className="products-section">
        <h2>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products</h2>
        <p>Explore our best {selectedCategory.toLowerCase()} products.</p>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <img
                  src={product.image || "https://via.placeholder.com/200x200?text=No+Image"}
                  alt={product.name}
                  className="product-img"
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p><strong>${Number(product.price).toFixed(2)}</strong></p>
                  <Link to={`/product/${product._id}`} className="btn">
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>

      {/* ✅ Footer */}
      <footer className="footer">
        <p>&copy; 2025 Digital Nexus. All Rights Reserved.</p>
        <p>Contact us: support@mystore.com</p>
      </footer>
    </div>
  );
};

export default Home;
