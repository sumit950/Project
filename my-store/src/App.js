import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { fetchProducts } from "./api";
import Service from "./components/Service";
import Product from "./components/Product";
import AboutUs from "./components/AboutUs";
import Header from "./components/Header";
import Profile from "./components/Profile";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ServiceProviderRegistration from "./components/ServiceProviderRegistration";
import ProductDetail from "./components/ProductDetail";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import BookingForm from "./components/BookingForm";
import AdminDashboard from "./components/AdminDashboard";
import Orders from "./components/Order"; 
import AdminLogin from "./components/AdminLogin";
import "./App.css";

const stripePromise = loadStripe("your-publishable-key-here"); // ✅ Replace with actual key

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const data = await fetchProducts();
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid product data");
        }
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, []);

  // ✅ Protect Admin Panel Route
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("adminToken");
    return token ? children : <Navigate to="/admin-login" />;
  };

  // ✅ Redirect Logged-in Admin to Admin Panel
  const AdminLoginRoute = () => {
    const token = localStorage.getItem("adminToken");
    return token ? <Navigate to="/admin" /> : <AdminLogin />;
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <Router>
      <Header cart={cart} />
      <Routes>
        <Route path="/" element={<Home products={products} loading={loading} error={error} />} />
        <Route path="/service" element={<Service />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} /> {/* ✅ Admin Protected */}
        <Route path="/admin-login" element={<AdminLoginRoute />} /> {/* ✅ Prevents logged-in admin from seeing login page */}
        <Route path="/product" element={<Product updateCart={updateCart} />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/service-provider-registration" element={<ServiceProviderRegistration />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product/:id" element={<ProductDetail products={products} />} />
        <Route path="/bookingform" element={<BookingForm />} />
        <Route path="/cart" element={<Cart cart={cart} updateCart={updateCart} />} />
        <Route path="/payment" element={
          <Elements stripe={stripePromise}>
            <Payment cart={cart} />
          </Elements>
        } />
      </Routes>
    </Router>
  );
};

export default App;
