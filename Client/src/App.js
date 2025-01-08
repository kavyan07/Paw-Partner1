import React, { useState } from "react";
import axios from "axios";
//import { useHistory } from "react-router-dom";
import * as Components from "./Components";

function App() {
  //const history = useHistory(); // Initialize useHistory hook
  const [signIn, toggleSignIn] = useState(true); // State to toggle between Sign In/Sign Up
  const [role, setRole] = useState("user"); // State to track the role (user, admin, pet shop, adoption center)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: ""
  });
  const [otp, setOtp] = useState(""); // State to track OTP
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track if OTP is sent

  // Toggle between Sign In and Sign Up forms
  const toggleForm = () => {
    toggleSignIn(!signIn);
  };

  // Handle the role change via radio button selection
  const handleRadioChange = (e) => {
    setRole(e.target.value);
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

  return (
    <Components.Background>
      <Components.Container>
        <Components.CardContainer>
          {/* Render corresponding forms based on the selected role */}
          {role === "admin" && (
            <>
              {/* Admin Sign Up Form */}
              {!signIn && !isOtpSent && (
                <Components.FormContainer>
                  <Components.Form onSubmit={handleSignUp}>
                    <Components.Title>Admin Create Account</Components.Title>
                    <Components.Input type="text" name="username" placeholder="Name" onChange={handleInputChange} />
                    <Components.Input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                    <Components.Input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                    <Components.Button type="submit">Sign Up</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}

              {/* Admin OTP Verification Form */}
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

              {/* Admin Sign In Form */}
              {signIn && (
                <Components.FormContainer>
                  <Components.Form onSubmit={handleSignIn}>
                    <Components.Title>Admin Sign In</Components.Title>
                    <Components.Input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                    <Components.Input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                    <Components.Anchor href="#">Forgot your password?</Components.Anchor>
                    <Components.Button type="submit">Sign In</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}
            </>
          )}

          {role === "user" && (
            <>
              {/* User Sign Up Form */}
              {!signIn && !isOtpSent && (
                <Components.FormContainer>
                  <Components.Form onSubmit={handleSignUp}>
                    <Components.Title>User Create Account</Components.Title>
                    <Components.Input type="text" name="username" placeholder="Name" onChange={handleInputChange} />
                    <Components.Input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                    <Components.Input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                    <Components.Button type="submit">Sign Up</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}

              {/* User OTP Verification Form */}
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

              {/* User Sign In Form */}
              {signIn && (
                <Components.FormContainer>
                  <Components.Form onSubmit={handleSignIn}>
                    <Components.Title>User Sign In</Components.Title>
                    <Components.Input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                    <Components.Input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                    <Components.Anchor href="#">Forgot your password?</Components.Anchor>
                    <Components.Button type="submit">Sign In</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}
            </>
          )}

          {role === "petShop" && (
            <>
              {/* Pet Shop Sign Up Form */}
              {!signIn && !isOtpSent && (
                <Components.FormContainer>
                  <Components.Form onSubmit={handleSignUp}>
                    <Components.Title>Pet Shop Create Account</Components.Title>
                    <Components.Input type="text" name="username" placeholder="Shop Name" onChange={handleInputChange} />
                    <Components.Input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                    <Components.Input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                    <Components.Button type="submit">Sign Up</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}

              {/* Pet Shop OTP Verification Form */}
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

              {/* Pet Shop Sign In Form */}
              {signIn && (
                <Components.FormContainer>
                  <Components.Form onSubmit={handleSignIn}>
                    <Components.Title>Pet Shop Sign In</Components.Title>
                    <Components.Input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                    <Components.Input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                    <Components.Anchor href="#">Forgot your password?</Components.Anchor>
                    <Components.Button type="submit">Sign In</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}
            </>
          )}

          {role === "adoptionCenter" && (
            <>
              {/* Adoption Center Sign Up Form */}
              {!signIn && !isOtpSent && (
                <Components.FormContainer>
                  <Components.Form onSubmit={handleSignUp}>
                    <Components.Title>Adoption Center Create Account</Components.Title>
                    <Components.Input type="text" name="username" placeholder="Center Name" onChange={handleInputChange} />
                    <Components.Input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                    <Components.Input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                    <Components.Button type="submit">Sign Up</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}

              {/* Adoption Center OTP Verification Form */}
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

              {/* Adoption Center Sign In Form */}
              {signIn && (
                <Components.FormContainer>
                  <Components.Form onSubmit={handleSignIn}>
                    <Components.Title>Adoption Center Sign In</Components.Title>
                    <Components.Input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                    <Components.Input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                    <Components.Anchor href="#">Forgot your password?</Components.Anchor>
                    <Components.Button type="submit">Sign In</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}
            </>
          )}

          {/* Toggle Button for switching between Sign In and Sign Up */}
          <Components.ToggleButtonContainer>
            <Components.ToggleButton onClick={toggleForm}>
              {signIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Components.ToggleButton>
          </Components.ToggleButtonContainer>

          {/* Render Radio Buttons below the toggle button */}
          <Components.RadioContainer>
            {["user", "admin", "petShop", "adoptionCenter"].map((roleOption) => (
              <Components.RadioLabel key={roleOption}>
                <Components.RadioInput
                  type="radio"
                  value={roleOption}
                  checked={role === roleOption}
                  onChange={handleRadioChange}
                />
                {roleOption.replace(/([A-Z])/g, " $1").toUpperCase()}
              </Components.RadioLabel>
            ))}
          </Components.RadioContainer>
        </Components.CardContainer>
      </Components.Container>
    </Components.Background>
  );
}

export default App;