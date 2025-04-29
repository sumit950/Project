import React from "react";
import "./CategorySection.css";

const categories = [
  { name: "Bestseller Product", action: "View Product" },
  { name: "New Product", action: "View Product" },
  { name: "Most Viewed", action: "View Product" },
  { name: "Most Purchased", action: "View Product" },
];

const CategorySection = () => {
  return (
    <div className="category-section">
      {categories.map((category, index) => (
        <div className="category" key={index}>
          <h3>{category.name}</h3>
          <button>{category.action}</button>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;
