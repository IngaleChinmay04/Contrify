const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Token = require("./tokenModel");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://127.0.0.1:27017/open-source-web-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

const User = mongoose.model("Users", userSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "opensourcewebappteam@gmail.com",
    pass: "kqcm ugal madi uodb",
  },
});

const generateToken = (userId) => {
  return jwt.sign({ userId }, "jwt_secret_key", { expiresIn: "1h" });
};

module.exports = generateToken;

async function sendResetPasswordEmail(email, token, userId) {
  const resetPasswordLink = `http://localhost:3000/resetpassword/${userId}/${token}`;
  const mailOptions = {
    from: "opensourcewebappteam@gmail.com",
    to: email,
    subject: "Reset Your Password",
    html: `<p>You can reset your password by clicking the following link: <a href="${resetPasswordLink}">Reset Password</a></p>`,
  };
  await transporter.sendMail(mailOptions);
}

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

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
});

app.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.json({ status: "Error verifying token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
});

app.get("/g", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = generateToken(user._id);

    await Token.create({ userId: user._id, token });

    res.status(201).json({ userId: user._id, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    await Token.findOneAndDelete({ token });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/signup", async (req, res) => {
  try {
    const userData = await User.find();
    res.json(userData);
  } catch (error) {
    console.error("Error fetching sign up data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.put("/updateProfile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedProfileData = req.body;

    await User.findByIdAndUpdate(userId, updatedProfileData);

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/getData/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const interests = userData.interests;

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/userProfile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { fullName, githubUsername, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
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
      firstName: "",
      lastName: "",
      currentRole: "",
      currentSpace: "",
      contactNumber: 0,
      githubProfileLink: "",
      linkedinProfileLink: "",
      selectedGender: "",
      uploadedImage: "",
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User Created Successfully", userId: newUser._id });
  } catch (error) {
    console.log(`Error in Creating User: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/chooseInterest", async (req, res) => {
  try {
    const { userId, interests } = req.body;
    await User.findByIdAndUpdate(userId, { interests });
    res.status(200).json({ message: "Interests updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

async function sendWelcomeEmail(email, name) {
  const mailOptions = {
    from: "opensourcewebappteam@gmail.com",
    to: email,
    subject: "Welcome to Open Source Web App!",
    html: `<h1>Welcome to Open Source Navigator!</h1>

    <p>Dear ${name},</p>

    <p>Welcome to Open Source Navigator! We're thrilled to have you join our vibrant community of aspiring developers and open-source enthusiasts. Our platform is designed to empower you on your journey to becoming a confident and proficient contributor to the world of open source.</p>

    <p>Here at Open Source Navigator, we understand the challenges that beginners face when navigating the vast landscape of open-source projects. That's why we've created a comprehensive platform to guide you every step of the way. From demystifying essential open-source concepts to providing personalized recommendations and learning resources, we're committed to helping you unlock your full potential.</p>

    <p>Here are some key features of our platform that you'll find invaluable:</p>
    <ul>
        <li><strong>Personalized Recommendations:</strong> Receive tailored suggestions for GitHub repositories based on your interests, skill level, and activity.</li>
        <li><strong>Comprehensive Glossary:</strong> Explore our glossary of essential open-source terms to build a solid foundation of knowledge.</li>
        <li><strong>Curated Learning Resources:</strong> Access handpicked tutorials, articles, and videos to deepen your understanding of specific topics.</li>
    </ul>

    <p>Whether you're a novice programmer or a seasoned developer, Open Source Navigator is your gateway to meaningful collaboration, skill development, and community engagement. We're excited to embark on this journey with you and witness your contributions to the open-source ecosystem.</p>

    <p>If you have any questions, feedback, or suggestions, please don't hesitate to reach out to us. Our team is here to support you every step of the way.</p>

    <p>Once again, welcome to Open Source Navigator! Let's innovate, collaborate, and make a difference together.</p>

    <p>Warm regards,<br>
    Chinmay Ingale<br>
    Open Source Navigator Developer<br>
    Open Source Navigator Team</p>
`,
  };
  await transporter.sendMail(mailOptions);
}

app.post("/skillSelect", async (req, res) => {
  try {
    const { userId, skillLevel } = req.body;
    await User.findByIdAndUpdate(userId, { skillLevel });
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendWelcomeEmail(user.email, user.fullName);

    res.json({ message: "Skill updated successfully" });
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
