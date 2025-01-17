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

const RoleButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const RoleButton = styled.button`
  background: ${props => props.active ? '#FF6B6B' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 2px solid ${props => props.active ? '#FF6B6B' : '#E0E0E0'};
  padding: 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#FF5252' : '#F5F5F5'};
    border-color: #FF6B6B;
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

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    contact: "",
    address: ""
  });
  const [role, setRole] = useState("user");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/register", {
        ...formData,
        role
      });
      alert(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/verify-otp", {
        email: formData.email,
        otp
      });
      alert(response.data.message);
      navigate('/home');
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  if (isOtpSent) {
    return (
      <BackgroundWithImage>
        <Container>
          <Form onSubmit={handleVerifyOtp}>
            <Title>Verify OTP</Title>
            <Input
              type="text"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button type="submit">Verify OTP</Button>
          </Form>
        </Container>
      </BackgroundWithImage>
    );
  }

  return (
    <BackgroundWithImage>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Title>Create Account</Title>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleInputChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
            required
          />
          <Input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleInputChange}
            required
          />
          <RoleButtonGroup>
            <RoleButton
              type="button"
              onClick={() => setRole("user")}
              active={role === "user"}
            >
              Pet Owner
            </RoleButton>
            <RoleButton
              type="button"
              onClick={() => setRole("petShop")}
              active={role === "petShop"}
            >
              Pet Shop
            </RoleButton>
            <RoleButton
              type="button"
              onClick={() => setRole("adoptionCenter")}
              active={role === "adoptionCenter"}
            >
              Adoption Center
            </RoleButton>
          </RoleButtonGroup>
          <Button type="submit">Sign Up</Button>
          <ToggleButton type="button" onClick={() => navigate('/signin')}>
            Already have an account? Sign In
          </ToggleButton>
        </Form>
      </Container>
    </BackgroundWithImage>
  );
}

export default SignUp;