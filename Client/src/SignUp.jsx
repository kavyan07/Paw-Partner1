import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import styled from "styled-components";
import { User, Mail, Lock, Phone, MapPin, PawPrint, Store, Heart, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #FF6B6B;
    outline: none;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
  }

  ${props => props.error && `
    border-color: #FF4444;
    &:focus {
      box-shadow: 0 0 0 4px rgba(255, 68, 68, 0.1);
    }
  `}
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #FF6B6B;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.span`
  color: #FF4444;
  font-size: 0.85rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PasswordStrength = styled.div`
  margin-top: 5px;
`;

const StrengthBar = styled.div`
  height: 4px;
  background: #E0E0E0;
  border-radius: 2px;
  margin-top: 5px;
  overflow: hidden;
`;

const StrengthIndicator = styled.div`
  height: 100%;
  width: ${props => props.strength}%;
  background: ${props => {
    if (props.strength <= 33) return '#FF4444';
    if (props.strength <= 66) return '#FFA000';
    return '#00C853';
  }};
  transition: all 0.3s ease;
`;

const StrengthText = styled.span`
  font-size: 0.85rem;
  color: ${props => {
    if (props.strength <= 33) return '#FF4444';
    if (props.strength <= 66) return '#FFA000';
    return '#00C853';
  }};
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background: ${props => props.active ? '#FF5252' : '#F5F5F5'};
    border-color: #FF6B6B;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background: #FF5252;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.2);
  }

  &:disabled {
    background: #E0E0E0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    animation: ${props => props.loading ? 'spin 1s linear infinite' : 'none'};
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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

const TermsCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  label {
    font-size: 0.9rem;
    color: #666;
    cursor: pointer;

    a {
      color: #FF6B6B;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (location.state?.selectedRole) {
      setRole(location.state.selectedRole);
    }
  }, [location.state]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, ''))) {
      newErrors.contact = "Invalid contact number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/register", {
        ...formData,
        role
      });
      setIsOtpSent(true);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "An error occurred during registration"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/verify-otp", {
        email: formData.email,
        otp
      });
      navigate('/home');
    } catch (error) {
      setErrors({
        otp: error.response?.data?.message || "Invalid OTP"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isOtpSent) {
    return (
      <BackgroundWithImage>
        <Container>
          <Form onSubmit={handleVerifyOtp}>
            <Title>Verify OTP</Title>
            <InputGroup>
              <InputIcon>
                <Lock />
              </InputIcon>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={errors.otp}
                required
              />
              {errors.otp && (
                <ErrorMessage>
                  <XCircle />
                  {errors.otp}
                </ErrorMessage>
              )}
            </InputGroup>
            <Button type="submit" loading={loading} disabled={loading}>
              {loading ? <Loader2 /> : 'Verify OTP'}
            </Button>
          </Form>
        </Container>
      </BackgroundWithImage>
    );
  }

  const passwordStrength = calculatePasswordStrength(formData.password);

  return (
    <BackgroundWithImage>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Title>Create Account</Title>
          
          <InputGroup>
            <InputIcon>
              <User />
            </InputIcon>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
              required
            />
            {errors.username && (
              <ErrorMessage>
                <XCircle />
                {errors.username}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Mail />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />
            {errors.email && (
              <ErrorMessage>
                <XCircle />
                {errors.email}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock />
            </InputIcon>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </PasswordToggle>
            {errors.password ? (
              <ErrorMessage>
                <XCircle />
                {errors.password}
              </ErrorMessage>
            ) : (
              formData.password && (
                <PasswordStrength>
                  <StrengthText strength={passwordStrength}>
                    Password strength: {passwordStrength <= 33 ? 'Weak' : passwordStrength <= 66 ? 'Medium' : 'Strong'}
                  </StrengthText>
                  <StrengthBar>
                    <StrengthIndicator strength={passwordStrength} />
                  </StrengthBar>
                </PasswordStrength>
              )
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Phone />
            </InputIcon>
            <Input
              type="tel"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleInputChange}
              error={errors.contact}
              required
            />
            {errors.contact && (
              <ErrorMessage>
                <XCircle />
                {errors.contact}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <MapPin />
            </InputIcon>
            <Input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
              required
            />
            {errors.address && (
              <ErrorMessage>
                <XCircle />
                {errors.address}
              </ErrorMessage>
            )}
          </InputGroup>

          <RoleButtonGroup>
            <RoleButton
              type="button"
              onClick={() => setRole("user")}
              active={role === "user"}
            >
              <PawPrint />
              Pet Owner
            </RoleButton>
            <RoleButton
              type="button"
              onClick={() => setRole("petShop")}
              active={role === "petShop"}
            >
              <Store />
              Pet Shop
            </RoleButton>
            <RoleButton
              type="button"
              onClick={() => setRole("adoptionCenter")}
              active={role === "adoptionCenter"}
            >
              <Heart />
              Adoption Center
            </RoleButton>
          </RoleButtonGroup>

          <TermsCheckbox>
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              I accept the <a href="/terms" target="_blank">Terms & Conditions</a>
            </label>
          </TermsCheckbox>
          {errors.terms && (
            <ErrorMessage>
              <XCircle />
              {errors.terms}
            </ErrorMessage>
          )}

          {errors.submit && (
            <ErrorMessage>
              <XCircle />
              {errors.submit}
            </ErrorMessage>
          )}

          <Button type="submit" loading={loading} disabled={loading}>
            {loading ? <Loader2 /> : 'Sign Up'}
          </Button>
          
          <ToggleButton type="button" onClick={() => navigate('/signin')}>
            Already have an account? Sign In
          </ToggleButton>
        </Form>
      </Container>
    </BackgroundWithImage>
  );
}

export default SignUp;

