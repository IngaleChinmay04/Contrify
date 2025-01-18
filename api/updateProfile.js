const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.put("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedProfileData = req.body;

    await User.findByIdAndUpdate(userId, updatedProfileData);

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
