import React, { useState, useEffect } from "react";
import "./Order.css"

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map((o) => (
          <li key={o._id}>
            {o.user.name} - ${o.totalAmount} - {o.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
