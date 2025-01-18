const mongoose = require("mongoose");

const dbURI = process.env.REACT_APP_MONGODB_URI; // Use Vercel environment variable

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
};

module.exports = connectDB;
