import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Form = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin"); // default to Admin

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login/", {
        username: email, // sending email as username
        password: password,
      });

      const userRole = response.data.user.user_role;
      localStorage.setItem("access", response.data.tokens.access);
      localStorage.setItem("refresh", response.data.tokens.refresh);
      localStorage.setItem("user_role", userRole);

      // Navigate based on role
      if (userRole === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/centre-dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed! Please check your credentials.");
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="heading">Sign In</div>
        <form className="form" onSubmit={handleSubmit}>
          <input
            placeholder="E-mail"
            id="email"
            name="email"
            type="email"
            className="input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            id="password"
            name="password"
            type="password"
            className="input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Role Dropdown */}
          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ marginTop: "12px" }}
          >
            <option value="Admin">Admin</option>
            <option value="Centre">Centre</option>
          </select>

          <span className="forgot-password">
            <a href="#">Forgot Password?</a>
          </span>
          <input
            defaultValue="Sign In"
            type="submit"
            className="login-button"
          />
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: #eef2f5;

  .container {
    max-width: 350px;
    background: linear-gradient(
      180deg,
      rgb(255, 255, 255) 0%,
      rgb(244, 247, 251) 100%
    );
    border-radius: 20px;
    padding: 30px;
    border: 1px solid #ddd;
    box-shadow: 0 10px 30px rgba(16, 137, 211, 0.1),
      0 4px 6px rgba(16, 137, 211, 0.05);
  }

  .heading {
    text-align: center;
    font-weight: 700;
    font-size: 28px;
    color: rgb(16, 137, 211);
    margin-bottom: 5px;
  }

  .form {
    margin-top: 20px;
  }

  .form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 12px 20px;
    border-radius: 12px;
    margin-top: 12px;
    box-shadow: #cff0ff 0px 5px 10px -5px;
    border-inline: 2px solid transparent;
    transition: border-inline 0.2s ease-in-out;
  }

  .form .input:focus {
    outline: none;
    border-inline: 2px solid #12b1d1;
  }

  .form .forgot-password {
    display: block;
    margin-top: 10px;
    margin-left: 10px;
  }

  .form .forgot-password a {
    font-size: 12px;
    color: #0099ff;
    text-decoration: none;
  }

  .form .login-button {
    display: block;
    width: 100%;
    font-weight: 600;
    background: linear-gradient(
      90deg,
      rgb(16, 137, 211) 0%,
      rgb(18, 177, 209) 100%
    );
    color: white;
    padding-block: 12px;
    margin: 25px auto 20px auto;
    border-radius: 12px;
    box-shadow: rgba(16, 137, 211, 0.4) 0px 10px 20px -10px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .form .login-button:hover {
    transform: translateY(-2px);
    box-shadow: rgba(16, 137, 211, 0.6) 0px 15px 25px -10px;
  }

  .form .login-button:active {
    transform: translateY(1px);
    box-shadow: rgba(16, 137, 211, 0.2) 0px 5px 10px -5px;
  }
`;

export default Form;
