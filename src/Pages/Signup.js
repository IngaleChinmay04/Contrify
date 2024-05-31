import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Signup.css";
import axios from "axios";
import axiosInstance from "../axiosConfig";

function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const navigate = useNavigate();

  const handleGithubUsernameChange = async (value) => {
    setGithubUsername(value);
    try {
      const response = await axiosInstance.get(`/users/${value}`);
      if (response.status === 200) {
        setIsUsernameValid(true);
      }
    } catch (error) {
      setIsUsernameValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fullName ||
      !githubUsername ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      console.log("All fields are required");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are required!",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      return;
    }

    if (!isUsernameValid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a valid GitHub username!",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/signup", {
        fullName,
        githubUsername,
        email,
        password,
      });

      if (response.status !== 201) {
        throw new Error("Fail to Signup");
      }
      console.log("ID : " + response.data.userId);
      navigate("/chooseInterest", { state: { userId: response.data.userId } });
    } catch (error) {
      console.log(`Error Signup: ${error}`);
      if (error.response) {
        console.log(`Error status: ${error.response.status}`);
        if (
          error.response.status === 400 &&
          error.response.data.message === "User already exists"
        ) {
          Swal.fire({
            icon: "error",
            title: "User already exists!",
            text: "Try Logging in!!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An internal server error occurred. Please try again later!",
          });
        }
      } else if (error.request) {
        console.log("Error making request");
      } else {
        console.log(`Error message: ${error.message}`);
      }
    }
  };

  return (
    <div className="wrapper-container">
      <div className="signUp-container">
        <h1 id="signup-text">Start Your Open Source Journey - Sign Up Now</h1>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="fullName"
              placeholder=" "
              className="textbox"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <label className="form-label">Full Name</label>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="githubUsername"
              placeholder=" "
              className={`textbox${isUsernameValid ? " valid" : ""}`}
              value={githubUsername}
              onChange={(e) => handleGithubUsernameChange(e.target.value)}
            />
            <label className="form-label">Github Username</label>
            {isUsernameValid && (
              <span className="validation-icon">
                <span style={{ fontWeight: "bold" }}>&#10004;</span>
              </span>
            )}
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder=" "
              className="textbox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="form-label">E-mail</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder=" "
              className="textbox"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="form-label">Password</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder=" "
              className="textbox"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label className="form-label">Confirm Password</label>
          </div>
          <p>
            *if you don't have a GitHub account, you'll <br />
            need to create one before proceeding. <br />
            Visit GitHub Sign Up to create your account."
          </p>
          <div className="button-container">
            <button type="submit">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
