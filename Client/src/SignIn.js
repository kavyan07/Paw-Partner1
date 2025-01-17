import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import * as Components from "./Components";
import styled from "styled-components";

const SocialLoginButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;

  .social-btn {
    width: 200px; /* Set a fixed width for the button */
    height: 50px;
    padding: 0 20px;
    border-radius: 25px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 16px;
    text-decoration: none;
  }

  .google-btn {
    background-color: #4285F4;
  }
`;

const DottedLine = styled.div`
  border-top: 1px dotted #ccc;
  margin: 20px 0;
  text-align: center;

  &:before {
    content: " ";
    display: inline-block;
    position: relative;
    top: -14px;
    background: white;
    padding: 0 10px;
  }
`;

const Spacer = styled.div`
  height: 20px; /* Adjust the height as needed */
`;

const SignInButton = styled(Components.Button)`
  width: 180px; /* Adjust the width as needed */
  display: block;
  margin: 0 auto;
`;

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/login", formData);
      alert(response.data.message);
      localStorage.setItem("token", response.data.token); // Store token
      navigate('/home'); // Redirect to home page
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/forgot-password", { email: formData.email });
      alert(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleVerifyResetPasswordOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/verify-reset-password-otp", { email: formData.email, otp, newPassword });
      alert(response.data.message);
      setIsOtpSent(false);
      setForgotPassword(false);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleGoogleLoginSuccess = (response) => {
    console.log(response);
    // Handle Google login success (e.g., send token to backend)
    navigate('/home'); // Redirect to home page
  };

  const handleGoogleLoginFailure = (response) => {
    console.error(response);
    alert("Google login failed");
  };

  return (
    <Components.BackgroundWithImage>
      <Components.Container>
        <Components.CardContainer>
          {!forgotPassword && (
            <Components.FormContainer>
              <Components.Form onSubmit={handleSignIn}>
                <Components.Title>Sign In</Components.Title>
                <Components.Input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                <Components.Input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                <Components.Anchor href="#" onClick={() => setForgotPassword(true)}>Forgot your password?</Components.Anchor>
                <SignInButton type="submit">Sign In</SignInButton>
              </Components.Form>
              <Spacer />
              <Components.ToggleButtonContainer>
                <Components.ToggleButton onClick={() => navigate('/signup')}>
                  Don't have an account? Sign Up
                </Components.ToggleButton>
              </Components.ToggleButtonContainer>
              <DottedLine />
              <SocialLoginButton>
                <GoogleLogin
                  clientId="YOUR_GOOGLE_CLIENT_ID"
                  buttonText="Sign in with Google"
                  onSuccess={handleGoogleLoginSuccess}
                  onFailure={handleGoogleLoginFailure}
                  cookiePolicy={'single_host_origin'}
                  className="social-btn google-btn"
                />
              </SocialLoginButton>
            </Components.FormContainer>
          )}

          {forgotPassword && !isOtpSent && (
            <Components.FormContainer>
              <Components.Form onSubmit={handleForgotPassword}>
                <Components.Title>Forgot Password</Components.Title>
                <Components.Input type="email" name="email" placeholder="Enter your email" onChange={handleInputChange} />
                <Components.Button type="submit">Send OTP</Components.Button>
              </Components.Form>
            </Components.FormContainer>
          )}

          {forgotPassword && isOtpSent && (
            <Components.FormContainer>
              <Components.Form onSubmit={handleVerifyResetPasswordOtp}>
                <Components.Title>Reset Password</Components.Title>
                <Components.Input type="text" name="otp" placeholder="Enter OTP" onChange={handleOtpChange} />
                <Components.Input type="password" name="newPassword" placeholder="Enter new password" onChange={handleNewPasswordChange} />
                <Components.Button type="submit">Reset Password</Components.Button>
              </Components.Form>
            </Components.FormContainer>
          )}
        </Components.CardContainer>
      </Components.Container>
    </Components.BackgroundWithImage>
  );
}

export default SignIn;