const express = require("express");
const { getAdminData } = require("../controllers/AdminController"); // ✅ Ensure correct file name

const router = express.Router();

// ✅ Define route with a valid callback function
router.get("/admin-data", getAdminData);

module.exports = router;
