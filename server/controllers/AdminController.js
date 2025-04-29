exports.getAdminData = (req, res) => {
    try {
      res.status(200).json({ message: "✅ Admin Data Fetched Successfully" });
    } catch (error) {
      res.status(500).json({ message: "❌ Error fetching admin data", error: error.message });
    }
  };
  