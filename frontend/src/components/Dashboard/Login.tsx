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
  const [showRegister, setShowRegister] = useState(false);

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
      const data = await apiFetch("/login/", {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Register",
      description: "Registration API integration pending",
      variant: "success",
    });
  };

  /* ---------------- FORGOT PASSWORD ---------------- */

  const handleForgotPassword = async () => {
    if (!email) return;

    try {
      setResetLoading(true);

      await apiFetch("/forgot-password/", {
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
      <div className="auth-container">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <h1>Welcome</h1>

          <p>
            Calm and modern authentication page with secure Login & Register
            system.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* TOGGLE */}
          <div className="toggle-buttons">
            <button
              className={!showRegister ? "active" : ""}
              onClick={() => setShowRegister(false)}
            >
              Login
            </button>

            <button
              className={showRegister ? "active" : ""}
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {!showRegister ? (
            <div>
              <h2 className="form-title">Login</h2>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  className="modern-input"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="modern-input"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div
                  className="forgot-link"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </div>

                <button type="submit" className="submit-btn">
                  Login
                </button>
              </form>
            </div>
          ) : (
            /* REGISTER FORM */

            <div>
              <h2 className="form-title">Register</h2>

              <form>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="modern-input"
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="modern-input"
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="modern-input"
                  required
                />

                <button type="submit" className="submit-btn">
                  Register
                </button>
              </form>
            </div>
          )}
        </div>

        {/* FORGOT PASSWORD MODAL */}
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
      </div>
    </StyledWrapper>
  );
};

export default Login;

/* ---------------- STYLES ---------------- */

const StyledWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(to right, #dfe9f3, #ffffff);

  .auth-container {
    width: 900px;
    height: 550px;

    background: white;

    border-radius: 20px;

    overflow: hidden;

    display: flex;

    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .left-panel {
    flex: 1;

    background: linear-gradient(135deg, #89f7fe, #66a6ff);

    color: white;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    padding: 40px;

    text-align: center;
  }

  .left-panel h1 {
    font-size: 42px;
    margin-bottom: 10px;
  }

  .left-panel p {
    font-size: 18px;
    line-height: 1.6;
  }

  .right-panel {
    flex: 1;

    padding: 40px;

    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .toggle-buttons {
    display: flex;

    margin-bottom: 30px;

    background: #f2f2f2;

    border-radius: 10px;

    overflow: hidden;
  }

  .toggle-buttons button {
    flex: 1;

    padding: 15px;

    border: none;

    cursor: pointer;

    font-size: 16px;

    background: transparent;

    transition: 0.3s;
  }

  .toggle-buttons button.active {
    background: #66a6ff;

    color: white;
  }

  .form-title {
    margin-bottom: 20px;

    color: #333;
  }

  .modern-input {
    width: 100%;

    padding: 14px;

    margin-bottom: 15px;

    border: 1px solid #ccc;

    border-radius: 10px;

    font-size: 15px;
  }

  .modern-input:focus {
    outline: none;

    border-color: #66a6ff;
  }

  .submit-btn {
    width: 100%;

    padding: 14px;

    border: none;

    border-radius: 10px;

    background: #66a6ff;

    color: white;

    font-size: 16px;

    cursor: pointer;

    transition: 0.3s;
  }

  .submit-btn:hover {
    opacity: 0.9;
  }

  .forgot-link {
    text-align: right;

    font-size: 13px;

    margin-bottom: 20px;

    color: #1089d3;

    cursor: pointer;
  }

  .error-message {
    color: #e63946;

    background: rgba(230, 57, 70, 0.1);

    padding: 10px;

    border-radius: 8px;

    margin-bottom: 15px;
  }

  .modal-overlay {
    position: fixed;

    inset: 0;

    background: rgba(15, 23, 42, 0.15);

    backdrop-filter: blur(4px);

    display: flex;

    justify-content: center;
    align-items: center;

    z-index: 999;
  }

  .modal {
    background: white;

    padding: 28px;

    border-radius: 18px;

    width: 320px;
  }

  .modal input {
    width: 100%;

    padding: 12px;

    margin-bottom: 18px;

    border-radius: 10px;

    border: 1px solid #ccc;
  }

  .modal-buttons {
    display: flex;

    gap: 12px;
  }

  .modal-buttons button {
    flex: 1;

    padding: 10px;

    border: none;

    border-radius: 10px;

    cursor: pointer;
  }

  .primary {
    background: #66a6ff;

    color: white;
  }

  .secondary {
    background: #f1f5f9;
  }
`;
