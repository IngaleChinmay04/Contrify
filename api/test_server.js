// mainserver.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./helpers/db"); // Ensure this points to your DB connection helper

// Import API routes
const signupRoute = require("./api/signup");
const loginRoute = require("./api/login");
const forgotPasswordRoute = require("./api/forgot-password");
// Import other routes as needed...

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
connectDB()
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit if DB connection fails
  });

// API Routes
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);
app.use("/api/forgot-password", forgotPasswordRoute);
// Add other routes similarly...

// Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
