const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwt");
const connectDB = require("../helpers/db");

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = generateToken(user._id);

      res.status(201).json({ userId: user._id, token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
