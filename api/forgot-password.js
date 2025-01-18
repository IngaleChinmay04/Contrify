const User = require("../models/User");
const { generateToken } = require("../helpers/jwt");
const { sendResetPasswordEmail } = require("../helpers/email");
const Token = require("../models/Token");
const connectDB = require("../helpers/db");

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = generateToken(user._id);

      await Token.create({ userId: user._id, token });

      await sendResetPasswordEmail(email, token, user._id);

      res.status(200).json({ message: "Reset password email sent" });
    } catch (error) {
      console.error("Error sending reset password email:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
