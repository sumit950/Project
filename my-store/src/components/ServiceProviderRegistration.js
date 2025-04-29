import { useState } from "react";
import "./ServiceProviderRegistration.css";

const RegisterServiceProvider = ({ onProviderAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    serviceType: "",
    experience: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // ✅ Ensure required fields are not empty
    if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.serviceType) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const submissionData = {
        ...formData,
        experience: formData.experience ? Number(formData.experience) : 0,
      };

      console.log("Submitting data:", submissionData);

      const response = await fetch("http://localhost:3001/api/register-service-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      // ✅ Check response status
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Server response:", data);

      setMessage("Service Provider registered successfully!");
      onProviderAdded(); // Refresh the list of service providers
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        serviceType: "",
        experience: "",
        description: "",
      });
    } catch (error) {
      console.error("Registration Error:", error);
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="service-provider-form-container">
      <h2>Register as a Service Provider</h2>
      {message && <p className="service-provider-message">{message}</p>}
      <form onSubmit={handleSubmit} className="service-provider-form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="^\d{10}$"
          title="Enter a valid 10-digit phone number"
        />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input type="text" name="serviceType" placeholder="Service Type" value={formData.serviceType} onChange={handleChange} required />
        <input
          type="number"
          name="experience"
          placeholder="Experience (years)"
          value={formData.experience}
          onChange={handleChange}
          min="0"
        />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterServiceProvider;
