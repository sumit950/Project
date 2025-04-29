import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="page-container">
      <h1>About Us</h1>
      <p>
        Welcome to our platform, a digital solution crafted with dedication and innovation by two passionate developers, <strong>Amit</strong> and <strong>Sumit</strong>. Our goal is to provide seamless and efficient digital services that enhance user experiences and simplify everyday tasks.
      </p>
      <h2>Our Vision</h2>
      <p>
        We believe in leveraging technology to create intuitive and user-friendly solutions. Our platform is designed to offer a smooth and secure experience, whether you're browsing products, booking services, or managing your profile.
      </p>
      <h2>Meet the Developers</h2>
      <ul>
        <li><strong>Sumit</strong>: A tech enthusiast with expertise in backend development, ensuring robust and scalable systems.</li>
        <li><strong>Amit</strong>: A frontend specialist, focused on delivering a seamless and engaging user interface.</li>
      </ul>
      <h2>What We Offer</h2>
      <p>
        Our website integrates a range of features, including:
      </p>
      <ul>
        <li>Efficient service booking system</li>
        <li>Secure payment integration</li>
        <li>Comprehensive user profiles with purchase and service history</li>
        <li>Seamless cart and checkout experience</li>
      </ul>
      <p>
        Our commitment is to continuously enhance our platform and provide you with the best possible digital experience. Thank you for being a part of our journey!
      </p>
    </div>
  );
};

export default AboutUs;
