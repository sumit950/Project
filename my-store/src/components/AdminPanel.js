import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "", description: "", image: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/admin/products");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        alert("Product added!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdate = async (id) => {
    const updatedProduct = prompt("Enter new product name:", "Updated Product");
    if (!updatedProduct) return;

    try {
      const response = await fetch(`http://localhost:3001/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updatedProduct }),
      });

      if (response.ok) {
        alert("Product updated!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product deleted!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => { localStorage.removeItem("adminToken"); navigate("/admin-login"); }}>Logout</button>

      <h2>Add Product</h2>
      <form onSubmit={handleAddProduct}>
        <input type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
        <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
        <input type="text" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} required />
        <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} required />
        <input type="text" placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} required />
        <button type="submit">Add Product</button>
      </form>

      <h2>Products</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - ₹{product.price}
            <button onClick={() => handleUpdate(product._id)}>Update</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
