import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styled from "styled-components";

const BackgroundWithImage = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  padding: 40px;
  backdrop-filter: blur(10px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #FF6B6B;
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #FF6B6B;
    outline: none;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
  }
`;

const Button = styled.button`
  background: #FF6B6B;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #FF5252;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.2);
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    color: #FF5252;
    text-decoration: underline;
  }
`;

const ForgotPassword = styled.a`
  color: #FF6B6B;
  font-size: 0.9rem;
  text-align: right;
  text-decoration: none;
  cursor: pointer;
  margin-top: -10px;

  &:hover {
    color: #FF5252;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: #FF5252;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -10px;
`;

const ResendTimer = styled.p`
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/login", formData);
      localStorage.setItem("token", response.data.token);
      alert(response.data.message);
      navigate('/home');
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/forgot-password", {
        email: formData.email
      });
      alert(response.data.message);
      setIsOtpSent(true);
      startResendTimer();
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const handleVerifyResetPasswordOtp = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/verify-reset-password-otp", {
        email: formData.email,
        otp,
        newPassword
      });
      alert(response.data.message);
      setIsOtpSent(false);
      setForgotPassword(false);
      navigate('/signin');
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/forgot-password", {
        email: formData.email
      });
      alert(response.data.message);
      startResendTimer();
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  if (forgotPassword && !isOtpSent) {
    return (
      <BackgroundWithImage>
        <Container>
          <Form onSubmit={handleForgotPassword}>
            <Title>Forgot Password</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Button type="submit">Send OTP</Button>
            <ToggleButton type="button" onClick={() => {
              setForgotPassword(false);
              setError("");
            }}>
              Back to Sign In
            </ToggleButton>
          </Form>
        </Container>
      </BackgroundWithImage>
    );
  }

  if (forgotPassword && isOtpSent) {
    return (
      <BackgroundWithImage>
        <Container>
          <Form onSubmit={handleVerifyResetPasswordOtp}>
            <Title>Reset Password</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit">Reset Password</Button>
            {resendTimer > 0 ? (
              <ResendTimer>Resend OTP in {resendTimer}s</ResendTimer>
            ) : (
              <ToggleButton type="button" onClick={handleResendOtp}>
                Resend OTP
              </ToggleButton>
            )}
            <ToggleButton type="button" onClick={() => {
              setForgotPassword(false);
              setIsOtpSent(false);
              setError("");
            }}>
              Back to Sign In
            </ToggleButton>
          </Form>
        </Container>
      </BackgroundWithImage>
    );
  }

  return (
    <BackgroundWithImage>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Title>Welcome Back</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <ForgotPassword onClick={() => {
            setForgotPassword(true);
            setError("");
          }}>
            Forgot Password?
          </ForgotPassword>
          <Button type="submit">Sign In</Button>
          <ToggleButton type="button" onClick={() => navigate('/signup')}>
            Don't have an account? Sign Up
          </ToggleButton>
        </Form>
      </Container>
    </BackgroundWithImage>
  );
}

export default SignIn;