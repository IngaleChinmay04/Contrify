const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  githubUsername: String,
  email: String,
  password: String,
  skillLevel: String,
  interests: [String],
  displayName: String,
  firstName: String,
  lastName: String,
  currentRole: String,
  currentSpace: String,
  contactNumber: String,
  githubProfileLink: String,
  linkedinProfileLink: String,
  selectedGender: String,
  uploadedImage: String,
});

module.exports = mongoose.model("User", userSchema);
