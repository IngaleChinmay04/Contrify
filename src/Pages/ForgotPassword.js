import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your email address!",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/forgot-password",
        {
          email,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "Check your email for instructions to reset your password.",
        });
        if (response.data.Status === "Success") {
          navigate("/");
        }
      } else {
        throw new Error("Failed to send reset password email");
      }
    } catch (error) {
      console.log(`Error sending reset password email: ${error.message}`);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to send reset password email. Please try again later.",
      });
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-password-container">
        <h1 id="forgot-text">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder=" "
              className="textbox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="form-label">Email</label>
          </div>

          <div className="button-container">
            <button type="submit">Submit Mail</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
