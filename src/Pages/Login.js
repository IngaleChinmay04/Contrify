import React from "react";
import { Link } from "react-router-dom";
import "./Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields!",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      if (response.status !== 201) {
        throw new Error("Fail to Login");
      }
      // console.log("ID : " + response.data.userId);
      navigate("/homePage", {
        state: { userId: response.data.userId, token: response.data.token },
      });
    } catch (error) {
      console.log(`Error logging in: ${error}`);
      console.log(`Error message: ${error.message}`);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid email or password!",
      });
    }
  };

  return (
    <div className="wrapper-container">
      <div className="login-container">
        <h1 id="login-text">Login to Explore Open Source Awesomeness</h1>
        <form className="login-form-container" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name=""
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
              name=""
              placeholder=" "
              className="textbox"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="form-label">Password</label>
          </div>
          <p>
            Forgot Password? <Link to="/forgotpassword">Click Here...</Link>
          </p>

          <div className="button-container">
            <button>Login</button>
          </div>
          <p>
            Don't Have an account? <Link to="/signup">Create account Now!</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
