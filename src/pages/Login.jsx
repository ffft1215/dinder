import "../styles/Login.css";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const baseURL = "http://localhost:3001";

  const handleLogin = async () => {
    try {
      const response = await fetch(baseURL + "/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);

        login(email, password);

        if (data.onboarded === false) {
          navigate("/onboarding");
        } else {
          navigate("/");
        }
      } else {
        console.error("Error logging in", response.statusText);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="MainContainer">
      <div className="LoginContainer">
        <div className="LoginTitle">
          din<span style={{ color: "#FFD233" }}>der</span>
        </div>
        <div className="LoginSubtitle">Login</div>
        <input
          type="text"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className="LoginInput"
        />
        <div className="LoginSubtitle" style={{ marginTop: 8 }}>
          Password
        </div>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          className="LoginInput"
        />
        <div className="LoginButton" onClick={handleLogin}>
          Login
        </div>
        <a href="/signup" className="LoginSignUpText">
          Sign Up
        </a>
      </div>
    </div>
  );
}
