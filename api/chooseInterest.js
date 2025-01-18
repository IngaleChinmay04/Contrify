const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { userId, interests } = req.body;
    await User.findByIdAndUpdate(userId, { interests });
    res.status(200).json({ message: "Interests updated successfully" });
  } catch (error) {
    console.error("Error updating interests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
