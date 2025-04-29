const express = require("express");
const { getUserProfile } = require("../controllers/UserController");
const { authenticateUser } = require("../middlewares/authenticate"); // ✅ Correct import

const router = express.Router();

// ✅ Ensure this route exists
router.get("/profile", authenticateUser, getUserProfile);

module.exports = router;
