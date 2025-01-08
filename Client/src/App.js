import React, { useState } from "react";
import axios from "axios";
import * as Components from "./Components";

function App() {
  const [signIn, toggleSignIn] = useState(true); // State to toggle between Sign In/Sign Up
  const [role, setRole] = useState("user"); // State to track the role (user, admin, pet shop, adoption center)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    contact: "",
    address: ""
  });
  const [otp, setOtp] = useState(""); // State to track OTP
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track if OTP is sent
  const [forgotPassword, setForgotPassword] = useState(false); // State to toggle Forgot Password form
  const [newPassword, setNewPassword] = useState(""); // State to track new password

  // Toggle between Sign In and Sign Up forms
  const toggleForm = () => {
    toggleSignIn(!signIn);
    setForgotPassword(false); // Reset Forgot Password state
  };

  // Handle the role change via button click
  const handleRoleChange = (role) => {
    setRole(role);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle new password input change
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Handle form submission for Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/register", formData);
      alert(response.data.message);
      setIsOtpSent(true); // Set OTP sent state to true
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/verify-otp", { email: formData.email, otp });
      alert(response.data.message);
      setIsOtpSent(false); // Reset OTP sent state
      toggleSignIn(true); // Switch to Sign In form
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Handle resending OTP
  const handleResendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/resend-otp", { email: formData.email });
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Handle form submission for Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/login", formData);
      alert(response.data.message);
      //history.push("/home"); // Redirect to Home Page
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Handle Forgot Password request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/forgot-password", { email: formData.email });
      alert(response.data.message);
      setIsOtpSent(true); // Set OTP sent state to true
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Handle OTP verification for password reset
  const handleVerifyResetPasswordOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/verify-reset-password-otp", { email: formData.email, otp, newPassword });
      alert(response.data.message);
      setIsOtpSent(false); // Reset OTP sent state
      toggleSignIn(true); // Switch to Sign In form
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Determine the placeholder text for the input fields based on the selected role
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
    <Components.Background>
      <Components.Container signIn={signIn}>
        <Components.CardContainer>
          {/* Sign Up Form */}
          {!signIn && !isOtpSent && (
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

          {/* OTP Verification Form */}
          {!signIn && isOtpSent && (
            <Components.FormContainer>
              <Components.Form onSubmit={handleVerifyOtp}>
                <Components.Title>Verify OTP</Components.Title>
                <Components.Input type="text" name="otp" placeholder="Enter OTP" onChange={handleOtpChange} />
                <Components.Button type="submit">Verify OTP</Components.Button>
                <Components.Button onClick={handleResendOtp}>Resend OTP</Components.Button>
              </Components.Form>
            </Components.FormContainer>
          )}

          {/* Sign In Form */}
          {signIn && !forgotPassword && (
            <Components.FormContainer>
              <Components.Form onSubmit={handleSignIn}>
                <Components.Title>Sign In</Components.Title>
                <Components.Input type="email" name="email" placeholder={getPlaceholder("email")} onChange={handleInputChange} />
                <Components.Input type="password" name="password" placeholder={getPlaceholder("password")} onChange={handleInputChange} />
                <Components.Anchor href="#" onClick={() => setForgotPassword(true)}>Forgot your password?</Components.Anchor>
                <Components.Button type="submit">Sign In</Components.Button>
              </Components.Form>
            </Components.FormContainer>
          )}

          {/* Forgot Password Form */}
          {forgotPassword && !isOtpSent && (
            <Components.FormContainer>
              <Components.Form onSubmit={handleForgotPassword}>
                <Components.Title>Forgot Password</Components.Title>
                <Components.Input type="email" name="email" placeholder="Enter your email" onChange={handleInputChange} />
                <Components.Button type="submit">Send OTP</Components.Button>
              </Components.Form>
            </Components.FormContainer>
          )}

          {/* OTP Verification for Password Reset Form */}
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

          {/* Toggle Button for switching between Sign In and Sign Up */}
          <Components.ToggleButtonContainer>
            <Components.ToggleButton onClick={toggleForm}>
              {signIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Components.ToggleButton>
          </Components.ToggleButtonContainer>
        </Components.CardContainer>
      </Components.Container>
    </Components.Background>
  );
}

export default App;