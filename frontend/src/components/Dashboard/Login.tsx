/// <reference types="vite/client" />

import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import { useToast } from "../../components/ui/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await apiFetch("/api/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", data.username);
      localStorage.setItem("centre_id", data.centre_id ?? "");
      localStorage.setItem("role", data.user_role);
      localStorage.setItem(
        "is_admin",
        data.user_role === "Admin" ? "true" : "false",
      );

      toast({
        title: "Authentication successful",
        description: `Welcome back, ${data.username}`,
        variant: "success",
      });

      setTimeout(() => {
        navigate("/app/dashboard", { replace: true });
      }, 800);
    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
    }
  };

  /* ---------------- FORGOT PASSWORD ---------------- */

  const handleForgotPassword = async () => {
    if (!email) return;

    try {
      setResetLoading(true);

      await apiFetch("/api/forgot-password/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      toast({
        title: "Email Sent",
        description: "Check your inbox for new password",
        variant: "success",
      });

      setShowForgot(false);
      setEmail("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
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

          <div className="forgot-link" onClick={() => setShowForgot(true)}>
            Forgot Password?
          </div>

          <input type="submit" value="Sign In" className="login-button" />
        </form>
      </div>

      {/* ---------- MODAL ---------- */}
      {showForgot && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reset Password</h3>

            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="modal-buttons">
              <button
                className="primary"
                onClick={handleForgotPassword}
                disabled={resetLoading}
              >
                {resetLoading ? "Sending..." : "Send"}
              </button>

              <button
                className="secondary"
                onClick={() => setShowForgot(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </StyledWrapper>
  );
};

export default Login;

/* ---------------- STYLES ---------------- */

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: #eef2f5;

  .container {
    max-width: 350px;
    background: linear-gradient(180deg, #ffffff 0%, #f4f7fb 100%);
    border-radius: 20px;
    padding: 30px;
    border: 1px solid #ddd;
    box-shadow:
      0 10px 30px rgba(16, 137, 211, 0.1),
      0 4px 6px rgba(16, 137, 211, 0.05);
  }

  .heading {
    text-align: center;
    font-weight: 700;
    font-size: 28px;
    color: rgb(16, 137, 211);
    margin-bottom: 5px;
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
  }

  .form .input:focus {
    outline: none;
    border-inline: 2px solid #12b1d1;
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
  }

  .dark & {
    background: #1e1e1e;

    .container {
      background: #2c2c2c;
      border: 1px solid #444;
    }

    .heading {
      color: #4fc3f7;
    }

    .form .input {
      background: #3a3a3a;
      color: #fff;
    }

    .form .login-button {
      background: linear-gradient(90deg, #4fc3f7 0%, #00bcd4 100%);
    }
.forgot-link {
  text-align: right;
  font-size: 13px;
  margin-top: 8px;
  cursor: pointer;
  color: #1089d3;
  transition: opacity 0.2s ease;
}

.forgot-link:hover {
  opacity: 0.8;
}

/* Softer overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.15); /* very light blur tone */
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* Brighter, elevated modal */
.modal {
  background: #ffffff;
  padding: 28px;
  border-radius: 18px;
  width: 320px;
  box-shadow:
    0 20px 40px rgba(16, 137, 211, 0.12),
    0 4px 10px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.25s ease-in-out;
}

.modal h3 {
  margin-bottom: 18px;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

/* Softer input */
.modal input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  margin-bottom: 18px;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

.modal input:focus {
  outline: none;
  border-color: #1089d3;
  box-shadow: 0 0 0 3px rgba(16, 137, 211, 0.15);
}

/* Buttons */
.modal-buttons {
  display: flex;
  gap: 12px;
}

.modal-buttons button {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-buttons .primary {
  background: linear-gradient(
    90deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  color: white;
}

.modal-buttons .primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(16, 137, 211, 0.25);
}

.modal-buttons .secondary {
  background: #f1f5f9;
  color: #475569;
}

.modal-buttons .secondary:hover {
  background: #e2e8f0;
}

@keyframes fadeIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

`;
