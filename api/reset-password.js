const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("../helpers/db");

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    const { id, token } = req.params;
    const { password } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid token" });
      }

      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate(id, { password: hash })
            .then(() =>
              res.status(200).json({ message: "Password reset successful" })
            )
            .catch((err) =>
              res.status(500).json({ message: "Error updating password" })
            );
        })
        .catch((err) =>
          res.status(500).json({ message: "Error hashing password" })
        );
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
