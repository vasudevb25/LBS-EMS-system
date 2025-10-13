import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="heading">Sign In</div>
        <form className="form" method='POST' onSubmit={handleSubmit}>
          <input placeholder="E-mail" id="email" name="email" type="email" className="input" required />
          <input placeholder="Password" id="password" name="password" type="password" className="input" required />
          <span className="forgot-password"><a href="#">Forgot Password?</a></span>
          <input defaultValue="Sign In" type="submit" className="login-button" />
        </form>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* 🛠️ CENTERING FIX */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  /* Optional: Add a subtle background color to the wrapper */
  background: #eef2f5;

  .container {
    max-width: 350px;
    background: #f8f9fd;
    /* 🎨 Updated gradient for a softer look */
    background: linear-gradient(
      180deg, /* Changed angle */
      rgb(255, 255, 255) 0%,
      rgb(244, 247, 251) 100%
    );
    border-radius: 20px; /* Slightly reduced radius for a modern feel */
    padding: 30px; /* Increased padding */
    border: 1px solid #ddd; /* Softer border */
    /* 🎨 Adjusted shadow for a modern "neumorphic" feel */
    box-shadow: 0 10px 30px rgba(16, 137, 211, 0.1), 0 4px 6px rgba(16, 137, 211, 0.05);
  }

  .heading {
    text-align: center;
    font-weight: 700; /* Slightly reduced weight */
    font-size: 28px; /* Slightly reduced size */
    color: rgb(16, 137, 211);
    margin-bottom: 5px; /* Added margin */
  }

  .form {
    margin-top: 20px;
  }

  .form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 12px 20px; /* Reduced padding for height */
    border-radius: 12px; /* Smaller border radius on inputs */
    margin-top: 12px; /* Adjusted margin */
    box-shadow: #cff0ff 0px 5px 10px -5px; /* Softer input shadow */
    border-inline: 2px solid transparent;
    transition: border-inline 0.2s ease-in-out;
  }

  .form .input::-moz-placeholder {
    color: rgb(170, 170, 170);
  }

  .form .input::placeholder {
    color: rgb(170, 170, 170);
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
    font-size: 12px; /* Slightly larger font */
    color: #0099ff;
    text-decoration: none;
  }

  .form .login-button {
    display: block;
    width: 100%;
    font-weight: 600; /* Slightly reduced weight */
    background: linear-gradient(
      90deg, /* Changed angle */
      rgb(16, 137, 211) 0%,
      rgb(18, 177, 209) 100%
    );
    color: white;
    padding-block: 12px; /* Reduced padding */
    margin: 25px auto 20px auto; /* Adjusted margins */
    border-radius: 12px; /* Reduced radius */
    box-shadow: rgba(16, 137, 211, 0.4) 0px 10px 20px -10px; /* Cleaner shadow */
    border: none;
    cursor: pointer; /* Added cursor */
    transition: all 0.2s ease-in-out;
  }

  .form .login-button:hover {
    transform: translateY(-2px); /* Lift slightly instead of scaling */
    box-shadow: rgba(16, 137, 211, 0.6) 0px 15px 25px -10px;
  }

  .form .login-button:active {
    transform: translateY(1px);
    box-shadow: rgba(16, 137, 211, 0.2) 0px 5px 10px -5px;
  }`;

export default Form;