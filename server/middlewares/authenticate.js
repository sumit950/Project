const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "⚠ Unauthorized" });

    const decoded = jwt.verify(token, "your_secret_key"); // 🔹 Replace with your actual secret key
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "❌ Authentication Failed", error: error.message });
  }
};

module.exports = { authenticateUser };
