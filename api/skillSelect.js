const express = require("express");
const router = express.Router();
const User = require("../models/User");
const sendWelcomeEmail = require("../helpers/sendWelcomeEmail"); // assuming sendWelcomeEmail is a helper function

router.post("/", async (req, res) => {
  try {
    const { userId, skillLevel } = req.body;
    await User.findByIdAndUpdate(userId, { skillLevel });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendWelcomeEmail(user.email, user.fullName); // Send the welcome email

    res.status(200).json({ message: "Skill updated successfully" });
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
