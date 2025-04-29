import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookingForm.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const BookingForm = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [bookings, setBookings] = useState([]);
  const availableTimes = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

  useEffect(() => {
    axios.get("http://localhost:3000/api/bookings").then((res) => {
      setBookings(res.data);
    });
  }, [date]);

  const handleBooking = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/bookings", {
        name,
        email,
        date: date.toDateString(),
        time,
        service,
      });
      alert(res.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Book a Service</h2>
      <Calendar onChange={setDate} value={date} />
      <h3>Selected Date: {date.toDateString()}</h3>

      <h4>Available Time Slots:</h4>
      {availableTimes.map((t) => (
        <button
          key={t}
          onClick={() => setTime(t)}
          disabled={bookings.some((b) => b.date === date.toDateString() && b.time === t)}
          style={{ margin: "5px", padding: "10px", cursor: "pointer" }}
        >
          {t}
        </button>
      ))}

      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Service" onChange={(e) => setService(e.target.value)} />
      <button onClick={handleBooking}>Book Now</button>
    </div>
  );
};

export default BookingForm;
