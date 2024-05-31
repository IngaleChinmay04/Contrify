import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import Swal from "sweetalert2";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const token = urlParams.get("token");

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/reset-password/${userId}/${token}`,
        {
          password,
        }
      );

      setPassword("");
      setConfirmPassword("");
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.Status,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to reset password. Please try again later.",
      });
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-password-container">
        <h1 id="reset-text">Reset Password</h1>
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <input
              type="text"
              name="fullName"
              placeholder=" "
              className="textbox"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="form-label">New Password</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="fullName"
              placeholder=" "
              className="textbox"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label className="form-label">Confirm Password</label>
          </div>

          <div className="button-container">
            <button type="submit">Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
