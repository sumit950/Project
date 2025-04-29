import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css"; // Import CSS file

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate(); // Use navigate for redirection
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product ID:", id); // Debugging log

        const response = await fetch(`http://localhost:3001/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
        console.log("Fetched product data:", data);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    try {
      const purchaseResponse = await fetch("http://localhost:3001/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure authentication
        },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });

      const purchaseResult = await purchaseResponse.json();
      if (!purchaseResponse.ok) throw new Error(purchaseResult.message);

      // Redirect to cart after successful purchase
      alert("✅ Product purchased and added to cart!");
      navigate("/cart"); // Redirect user to cart page
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-detail">
      <h2>{product?.name}</h2>
      <img src={product?.image || `https://via.placeholder.com/200x200?text=${product?.name}`} alt={product?.name} />
      <p>{product?.description}</p>
      <p><strong>Price: ${product?.price}</strong></p>
      <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default ProductDetail;
