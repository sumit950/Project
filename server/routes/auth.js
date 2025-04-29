const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure the correct path to your User model

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer token

        if (!token) {
            return res.status(401).json({ message: "❌ No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = await User.findById(decoded.id).select("-password"); // Attach user to request

        if (!req.user) {
            return res.status(404).json({ message: "❌ User not found" });
        }

        next(); // Proceed to next middleware
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "❌ Token is not valid" });
    }
};

module.exports = authenticateUser;
