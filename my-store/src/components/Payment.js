import React, { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import "./Payment.css";

// ✅ Load Stripe with your public key from .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    setPaymentSuccess("");
    setLoading(true);

    try {
      if (paymentMethod === "stripe") {
        if (!stripe || !elements) {
          throw new Error("Stripe is not ready. Please try again.");
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

        if (error) {
          throw new Error(error.message);
        }

        const response = await axios.post("http://localhost:3001/api/payment/stripe", {
          paymentMethodId: paymentMethod.id,
        });

        if (response.data.success) {
          setPaymentSuccess("✅ Payment successful via Stripe!");
        } else {
          throw new Error("Stripe payment failed.");
        }
      } else if (paymentMethod === "paypal") {
        setPaymentSuccess("✅ Payment successful via PayPal!");
      } else if (paymentMethod === "cod") {
        setPaymentSuccess("✅ Order placed successfully with Cash on Delivery!");
      } else if (paymentMethod === "gpay") {
        if (!transactionId.trim()) {
          throw new Error("❌ Please enter a valid transaction ID.");
        }

        const response = await axios.post("http://localhost:3001/api/payment/gpay", {
          transactionId,
        });

        if (response.data.success) {
          setPaymentSuccess("✅ Payment verified via GPay!");
        } else {
          throw new Error("❌ Payment verification failed. Please check your transaction ID.");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">Complete Your Payment</h2>

      {/* Payment Methods */}
      <div className="payment-methods">
        {["stripe", "paypal", "cod", "gpay"].map((method) => (
          <div
            key={method}
            className={`payment-method ${paymentMethod === method ? "active" : ""}`}
            onClick={() => setPaymentMethod(method)}
          >
            {method === "stripe" && "💳 Credit/Debit Card (Stripe)"}
            {method === "paypal" && "🅿 PayPal"}
            {method === "cod" && "🚚 Cash on Delivery"}
            {method === "gpay" && "📲 Google Pay (GPay)"}
          </div>
        ))}
      </div>

      {/* Payment Form */}
      <form className="payment-form" onSubmit={handlePayment}>
        {paymentMethod === "stripe" && (
          <div className="stripe-section">
            <CardElement className="StripeElement" />
          </div>
        )}

        {paymentMethod === "gpay" && (
          <div className="gpay-section">
            <p>Scan the QR Code and enter the transaction ID after payment.</p>
            <img src={"/gpay-qr.jpg"} alt="GPay QR Code" className="gpay-qr" />
            <input
              type="text"
              placeholder="Enter GPay Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
            />
          </div>
        )}

        <button className="payment-button" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {/* Display Messages */}
      {error && <p className="payment-error">{error}</p>}
      {paymentSuccess && <p className="payment-success">{paymentSuccess}</p>}
    </div>
  );
};

// Wrap in Elements provider for Stripe
const PaymentWrapper = () => (
  <Elements stripe={stripePromise}>
    <Payment />
  </Elements>
);

export default PaymentWrapper;
