import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import * as Components from "./Components";
import styled from "styled-components";

const Background = styled(Components.BackgroundWithImage)`
  background-image: url('/path/to/your/background-image.jpg');
  background-size: cover;
  background-position: center;
`;

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    contact: "",
    address: ""
  });
  const [role, setRole] = useState("user");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

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

  const handleRoleChange = (role) => {
    setRole(role);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/register", formData);
      alert(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/verify-otp", { email: formData.email, otp });
      alert(response.data.message);
      setIsOtpSent(false);
      navigate('/home'); // Redirect to home page after successful OTP verification
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/resend-otp", { email: formData.email });
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const getPlaceholder = (field) => {
    switch (role) {
      case "admin":
        return field === "email" ? "Admin Email" : field === "username" ? "Admin Name" : field === "password" ? "Admin Password" : field === "contact" ? "Admin Contact" : "Admin Address";
      case "petShop":
        return field === "email" ? "Pet Shop Email" : field === "username" ? "Pet Shop Name" : field === "password" ? "Pet Shop Password" : field === "contact" ? "Pet Shop Contact" : "Pet Shop Address";
      case "adoptionCenter":
        return field === "email" ? "Adoption Center Email" : field === "username" ? "Adoption Center Name" : field === "password" ? "Adoption Center Password" : field === "contact" ? "Adoption Center Contact" : "Adoption Center Address";
      default:
        return field === "email" ? "User Email" : field === "username" ? "User Name" : field === "password" ? "User Password" : field === "contact" ? "User Contact" : "User Address";
    }
  };

  return (
    <Background>
      <Components.Container>
        <Components.CardContainer>
          {!isOtpSent && (
            <Components.FormContainer>
              <Components.Form onSubmit={handleSignUp}>
                <Components.Title>Create Account</Components.Title>
                <Components.Input type="text" name="username" placeholder={getPlaceholder("username")} onChange={handleInputChange} />
                <Components.Input type="email" name="email" placeholder={getPlaceholder("email")} onChange={handleInputChange} />
                <Components.Input type="password" name="password" placeholder={getPlaceholder("password")} onChange={handleInputChange} />
                <Components.Input type="text" name="contact" placeholder={getPlaceholder("contact")} onChange={handleInputChange} />
                <Components.Input type="text" name="address" placeholder={getPlaceholder("address")} onChange={handleInputChange} />
                <Components.ButtonGroup>
                  <Components.RoleButton
                    type="button"
                    onClick={() => handleRoleChange("user")}
                    active={role === "user"}
                  >
                    User
                  </Components.RoleButton>
                  <Components.RoleButton
                    type="button"
                    onClick={() => handleRoleChange("admin")}
                    active={role === "admin"}
                  >
                    Admin
                  </Components.RoleButton>
                  <Components.RoleButton
                    type="button"
                    onClick={() => handleRoleChange("petShop")}
                    active={role === "petShop"}
                  >
                    Pet Shop
                  </Components.RoleButton>
                  <Components.RoleButton
                    type="button"
                    onClick={() => handleRoleChange("adoptionCenter")}
                    active={role === "adoptionCenter"}
                  >
                    Adoption Center
                  </Components.RoleButton>
                </Components.ButtonGroup>
                <Components.Button type="submit">Sign Up</Components.Button>
              </Components.Form>
            </Components.FormContainer>
          )}

          {isOtpSent && (
            <Components.FormContainer>
              <Components.Form onSubmit={handleVerifyOtp}>
                <Components.Title>Verify OTP</Components.Title>
                <Components.Input type="text" name="otp" placeholder="Enter OTP" onChange={handleOtpChange} />
                <Components.Button type="submit">Verify OTP</Components.Button>
                <Components.Button onClick={handleResendOtp}>Resend OTP</Components.Button>
              </Components.Form>
            </Components.FormContainer>
          )}
        </Components.CardContainer>
      </Components.Container>
    </Background>
  );
}

export default SignUp;