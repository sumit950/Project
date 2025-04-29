import React from "react";
import "./ProductSection.css";

const products = [
  { id: 1, name: "Laptop", img: "laptop.jpg" },
  { id: 2, name: "Phone", img: "phone.jpg" },
  { id: 3, name: "Headphones", img: "headphones.jpg" },
  { id: 4, name: "PS5 Console", img: "console.jpg" },
];

const ProductSection = () => {
  return (
    <section className="product-section">
      <h2>OUR PRODUCTS</h2>
      <p>Explore the wide range of products we offer to help you succeed in the digital world.</p>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.img} alt={product.name} />
            <button>Explore Product</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
