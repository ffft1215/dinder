import "../styles/SignUp.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const baseURL = "http://localhost:3001";

  const [warning, setWarning] = useState(false);

  const onSignUpClick = () => {
    if (password !== confirmPassword) {
      setWarning(true);
      alert("Your passwords must match");
    } else if (email === "" || password === "") {
      alert("Please fill in all fields");
    } else {
      handleSignup(email, password);
    }
  };

  const handleSignup = async (email, password) => {
    try {
      const response = await fetch(baseURL + "/users/register", {
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
        navigate("/onboarding");
      } else {
        console.error("Error signing up:", response.statusText);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="MainSignUpContainer">
      <div className="SignUpContainer">
        <div className="SignUpTitle">Sign up</div>
        <div type="text" id="email" className="SignUpSubtitle">
          Login Email
        </div>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="SignUpInput"
        />
        <div className="SignUpSubtitle" style={{ marginTop: 8 }}>
          Password
        </div>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setWarning(false);
          }}
          className="SignUpInput"
          style={{ border: warning ? "1px solid red" : "none" }}
        />
        <div className="SignUpSubtitle" style={{ marginTop: 8 }}>
          Confirm Password
        </div>
        <input
          type="password"
          id="password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setWarning(false);
          }}
          className="SignUpInput"
          style={{ border: warning ? "1px solid red" : "none" }}
        />
        <div className="SignUpButton" onClick={onSignUpClick}>
          Sign up
        </div>
      </div>
    </div>
  );
}
