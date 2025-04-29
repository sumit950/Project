import { useEffect, useState } from "react";
import ServiceProviderRegistration from "./ServiceProviderRegistration";
import "./Service.css";

const Service = () => {
  const [providers, setProviders] = useState([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    fetchProviders();
    const storedEmail = localStorage.getItem("userEmail");
    console.log("📌 Checking stored userEmail:", storedEmail);
    setUserEmail(storedEmail);
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/service-providers");
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error("❌ Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const bookService = async (providerId, providerEmail) => {
    if (!userEmail) {
      alert("❌ Please log in to book a service.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/book-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, providerEmail, userEmail }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to book service");

      alert("✅ Booking successful: " + data.message);

      // Notify provider via email
      await fetch("http://localhost:3001/api/notify-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerEmail, userEmail }),
      });

    } catch (error) {
      console.error("❌ Error booking service:", error);
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-container">
      <h2>Service Providers</h2>
      <button className="toggle-btn" onClick={() => setShowRegistration(!showRegistration)}>
        {showRegistration ? "Hide Registration" : "Register as Service Provider"}
      </button>

      {showRegistration && <ServiceProviderRegistration onProviderAdded={fetchProviders} />}

      {loading && <p className="loading">Loading services...</p>}

      <ul className="service-list">
        {providers.length > 0 ? (
          providers.map((provider) => (
            <li className="service-card" key={provider._id}>
              <h3>{provider.name}</h3>
              <p><strong>Service:</strong> {provider.serviceType}</p>
              <p><strong>Email:</strong> {provider.email}</p>
              <p><strong>Phone:</strong> {provider.phone}</p>
              <p><strong>Experience:</strong> {provider.experience} years</p>
              <p>{provider.description}</p>
              <button
                className="book-btn"
                onClick={() => bookService(provider._id, provider.email)}
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Service"}
              </button>
            </li>
          ))
        ) : (
          <p>No service providers found.</p>
        )}
      </ul>
    </div>
  );
};

export default Service;
