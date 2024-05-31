const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: String,
  createdAt: { type: Date, expires: "1h", default: Date.now },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
