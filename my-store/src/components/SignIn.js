import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/signin", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store token
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store full user details
        localStorage.setItem("userEmail", response.data.user.email); // Store only email for booking
        console.log("✅ User logged in:", response.data.user);

        // Redirect based on user role (Optional)
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/profile"); // Redirect to profile page (change if needed)
        }
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
