const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwt");
const { sendWelcomeEmail } = require("../helpers/email");
const connectDB = require("../helpers/db");

module.exports = async (req, res) => {
  await connectDB(); // Connect to MongoDB

  if (req.method === "POST") {
    const { fullName, githubUsername, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        fullName,
        githubUsername,
        email,
        password: hashedPassword,
        skillLevel: "",
        interests: ["JavaScript", "React", "Node"],
        displayName: fullName,
      });

      await newUser.save();

      // Send Welcome Email
      await sendWelcomeEmail(newUser.email, newUser.fullName);

      const token = generateToken(newUser._id);

      res.status(201).json({
        message: "User Created Successfully",
        userId: newUser._id,
        token,
      });
    } catch (error) {
      console.log("Error in Creating User:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
