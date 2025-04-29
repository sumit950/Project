import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    image: "",
  });

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/admin/products", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          throw new Error("Unauthorized access");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  // Create Product
  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch("http://localhost:3001/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      const createdProduct = await response.json();
      setProducts((prev) => [...prev, createdProduct]);
      setNewProduct({ name: "", category: "", price: 0, description: "", image: "" });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Update Product
  const handleUpdateProduct = async (productId) => {
    const updatedData = { ...newProduct }; // Updated data

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`http://localhost:3001/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("adminToken");

      await fetch(`http://localhost:3001/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove the token from localStorage
    navigate("/admin-login"); // Redirect to the login page
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Logout Button */}
      <button onClick={handleLogout}>Logout</button>

      <div>
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <button onClick={handleCreateProduct}>Add Product</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>{product.price}</p>
            <p>{product.description}</p>
            <p>
              <img src={product.image} alt={product.name} />
            </p>
            <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
            <button onClick={() => handleUpdateProduct(product._id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
