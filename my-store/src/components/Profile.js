import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("❌ Please log in to view your profile.");
          setLoading(false);
          return;
        }

        console.log("📌 Fetching user profile...");

        const response = await fetch("http://localhost:3001/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`❌ Failed to load profile: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ API Response:", data);

        setProfile(data);
      } catch (error) {
        console.error("❌ Profile Fetch Error:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {loading && <p>Loading profile...</p>}
      {error && <p className="error">{error}</p>}
      {profile && !loading && !error ? (
        <>
          <p><strong>Name:</strong> {profile?.name || "N/A"}</p>
          <p><strong>Email:</strong> {profile?.email || "N/A"}</p>

          {/* Address Section */}
          <h3>Address</h3>
          {profile?.address ? (
            <p>{profile.address}</p>
          ) : (
            <p>No address available.</p>
          )}

          {/* Cart Section */}
          <h3>Cart</h3>
          {profile.cart && profile.cart.length > 0 ? (
            <ul>
              {profile.cart.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity} x ₹{item.price}
                </li>
              ))}
            </ul>
          ) : (
            <p>No items in cart.</p>
          )}
        </>
      ) : (
        !loading && <p>No profile data found.</p>
      )}
    </div>
  );
};

export default Profile;
