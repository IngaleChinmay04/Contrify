const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  token: String,
});

module.exports = mongoose.model("Token", tokenSchema);
