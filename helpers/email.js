const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Contrify!",
    html: `<h1>Welcome to Contrify!</h1><p>Dear ${name}, Welcome to Contrify!</p>`,
  };
  await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (email, token, userId) => {
  const resetPasswordLink = `https://your-vercel-app-url/resetpassword/${userId}/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `<p>You can reset your password by clicking the following link: <a href="${resetPasswordLink}">Reset Password</a></p>`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail, sendResetPasswordEmail };
