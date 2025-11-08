import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save only what's needed
        localStorage.setItem("username", data.username);
        localStorage.setItem("user_role", data.user_role);
        localStorage.setItem("centre_id", data.centre_id || "");

        // ✅ Redirect by role
        if (data.user_role === "Admin") navigate("/admin/dashboard");
        else if (data.user_role === "Centre") navigate("/centre/dashboard");
        else navigate("/dashboard");
      } else {
        setError(data.error || "Invalid username or password.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="heading">Sign In</div>
        {error && <div className="error-message">{error}</div>}

        <form className="form" onSubmit={handleLogin}>
          <input
            placeholder="Username"
            type="text"
            className="input"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            className="input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
          <input type="submit" value="Sign In" className="login-button" />
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
  transition: background 0.3s ease;

  .container {
    max-width: 350px;
    background: linear-gradient(180deg, #ffffff 0%, #f4f7fb 100%);
    border-radius: 20px;
    padding: 30px;
    border: 1px solid #ddd;
    box-shadow: 0 10px 30px rgba(16, 137, 211, 0.1),
      0 4px 6px rgba(16, 137, 211, 0.05);
    transition: background 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;
  }

  .heading {
    text-align: center;
    font-weight: 700;
    font-size: 28px;
    color: rgb(16, 137, 211);
    margin-bottom: 5px;
    transition: color 0.3s ease;
  }
  .error-message {
    color: #e63946;
    background: rgba(230, 57, 70, 0.1);
    border: 1px solid rgba(230, 57, 70, 0.3);
    padding: 8px 12px;
    border-radius: 8px;
    text-align: center;
    font-size: 14px;
    margin-bottom: 10px;
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
    transition: all 0.3s ease;
  }

  .form .input:focus {
    outline: none;
    border-inline: 2px solid #12b1d1;
  }

  .form .forgot-password a {
    font-size: 12px;
    color: #0099ff;
    text-decoration: none;
    transition: color 0.3s ease;
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
    transition: all 0.3s ease;
  }

  /* DARK MODE */
  .dark & {
    background: #1e1e1e;

    .container {
      background: #2c2c2c;
      border: 1px solid #444;
      box-shadow: 0 10px 30px rgba(79, 195, 247, 0.1),
        0 4px 6px rgba(79, 195, 247, 0.05);
    }

    .heading {
      color: #4fc3f7;
    }

    .form .input {
      background: #3a3a3a;
      color: #fff;
      box-shadow: 0 5px 10px rgba(79, 195, 247, 0.1);
      border-inline: 2px solid transparent;
    }

    .form .input:focus {
      border-inline: 2px solid #4fc3f7;
    }

    .form .forgot-password a {
      color: #4fc3f7;
    }

    .form .login-button {
      background: linear-gradient(90deg, #4fc3f7 0%, #00bcd4 100%);
      box-shadow: rgba(79, 195, 247, 0.4) 0px 10px 20px -10px;
    }
  }
`;

export default Login;
