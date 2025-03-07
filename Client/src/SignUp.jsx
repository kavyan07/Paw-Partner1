"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  PawPrint,
  Store,
  Heart,
  Eye,
  EyeOff,
  XCircle,
  Loader2,
  FileText,
} from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
`

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  padding: 40px;
  backdrop-filter: blur(10px);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #FF6B6B;
  text-align: center;
  margin-bottom: 20px;
`

const GoogleButton = styled.button`
  background: white;
  color: #757575;
  border: 1px solid #DADCE0;
  border-radius: 12px;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 20px;

  &:hover {
    background: #F8F9FA;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  img {
    width: 24px;
    height: 24px;
  }
`

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #666;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #E0E0E0;
    margin: 0 10px;
  }
`

const InputGroup = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid ${(props) => (props.error ? "#FF4444" : "#E0E0E0")};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #FF6B6B;
    outline: none;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid ${(props) => (props.error ? "#FF4444" : "#E0E0E0")};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: #FF6B6B;
    outline: none;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
  }
`

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: ${(props) => (props.$isTextarea ? "20px" : "50%")};
  transform: ${(props) => (props.$isTextarea ? "none" : "translateY(-50%)")};
  color: #666;

  svg {
    width: 20px;
    height: 20px;
  }
`

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
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #FF6B6B;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

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
`

const RoleButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`

const RoleButton = styled.button`
  background: ${(props) => (props.$active ? "#FF6B6B" : "white")};
  color: ${(props) => (props.$active ? "white" : "#666")};
  border: 2px solid ${(props) => (props.$active ? "#FF6B6B" : "#E0E0E0")};
  border-radius: 12px;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    border-color: #FF6B6B;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const TermsCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 10px;
  
  input {
    margin-top: 3px;
  }
  
  label {
    font-size: 0.9rem;
    color: #666;
    
    a {
      color: #FF6B6B;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`

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
    animation: ${(props) => (props.$loading ? "spin 1s linear infinite" : "none")};
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

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
`

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-top: 10px;
  margin-bottom: -10px;
`

const API_BASE_URL = "http://localhost:8000/api/v1"

function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    // Additional fields for adoption centers
    adoptionCenterName: "",
    adoptionCenterDescription: "",
    // Additional fields for pet shops
    shopName: "",
    shopDescription: "",
  })
  const [role, setRole] = useState("user")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [registrationEmail, setRegistrationEmail] = useState("")
  const [tempUserData, setTempUserData] = useState(null)

  // Update validation based on role
  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required"
    } else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, ""))) {
      newErrors.contact = "Invalid contact number"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    // Validate adoption center specific fields
    if (role === "adoptionCenter") {
      if (!formData.adoptionCenterName.trim()) {
        newErrors.adoptionCenterName = "Adoption center name is required"
      }
      if (!formData.adoptionCenterDescription.trim()) {
        newErrors.adoptionCenterDescription = "Adoption center description is required"
      }
    }

    // Validate pet shop specific fields
    if (role === "petShop") {
      if (!formData.shopName.trim()) {
        newErrors.shopName = "Shop name is required"
      }
      if (!formData.shopDescription.trim()) {
        newErrors.shopDescription = "Shop description is required"
      }
    }

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  // Handle role change
  const handleRoleChange = (newRole) => {
    setRole(newRole)
    // Clear any role-specific errors when changing roles
    const relevantErrors = { ...errors }
    if (newRole !== "adoptionCenter") {
      delete relevantErrors.adoptionCenterName
      delete relevantErrors.adoptionCenterDescription
    }
    if (newRole !== "petShop") {
      delete relevantErrors.shopName
      delete relevantErrors.shopDescription
    }
    setErrors(relevantErrors)
  }

  const getEndpoint = (type) => {
    const baseEndpoint = role === "user" ? "users" : role === "petShop" ? "pet-shops" : "adoption-centers"
    return `${API_BASE_URL}/${baseEndpoint}/${type}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      // Prepare data based on role
      let requestData = {
        email: formData.email.trim().toLowerCase(), // Normalize email
        password: formData.password,
        contact: formData.contact.trim(),
        address: formData.address.trim(),
        role: role === "user" ? "user" : role,
      }

      // Add role-specific fields
      if (role === "adoptionCenter") {
        requestData = {
          ...requestData,
          adoptionCenterName: formData.adoptionCenterName.trim(),
          adoptionCenterDescription: formData.adoptionCenterDescription.trim(),
        }
      } else if (role === "petShop") {
        requestData = {
          ...requestData,
          shopName: formData.shopName.trim(),
          shopDescription: formData.shopDescription.trim(),
        }
      }

      console.log("Sending registration data:", requestData)

      const response = await axios.post(getEndpoint("register"), requestData)

      if (response.data.success) {
        setTempUserData(response.data.user)
        setRegistrationEmail(formData.email)
        setIsOtpSent(true)
        toast.success("Registration successful! Please verify your email.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      console.log("Error response:", error.response?.data)

      const errorMessage = error.response?.data?.message || "Registration failed. Please try again."
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    if (!otp.trim()) {
      toast.error("Please enter the OTP")
      return
    }

    setLoading(true)
    try {
      // Create axios instance with default headers
      const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true, // Important for cookies if your API uses them
      })

      // First verify the OTP
      const verifyResponse = await axiosInstance.post(getEndpoint("verify-otp"), {
        email: registrationEmail,
        otp: otp.trim(), // Ensure OTP is trimmed to remove any whitespace
      })

      // Check if verification was successful
      if (verifyResponse.data.success) {
        toast.success("Email verified successfully!")

        // Wait a moment before attempting login
        setTimeout(async () => {
          try {
            // Prepare login data
            const loginData = {
              email: registrationEmail,
              password: formData.password,
            }

            // Add role-specific data if needed
            if (role === "petShop") {
              loginData.shopName = formData.shopName
            }

            // Attempt to login with the correct endpoint
            const loginEndpoint = getEndpoint("login")
            console.log("Attempting login with endpoint:", loginEndpoint)
            console.log("Login data:", { ...loginData, password: "[REDACTED]" })

            // Try login with explicit credentials
            const loginResponse = await axiosInstance.post(loginEndpoint, loginData, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })

            console.log("Login response:", loginResponse.data)

            // Check if login response contains necessary data
            if (loginResponse.data && (loginResponse.data.token || loginResponse.data.accessToken)) {
              // Handle different response structures
              const token = loginResponse.data.token || loginResponse.data.accessToken
              const user = loginResponse.data.shop || loginResponse.data.user || loginResponse.data.data || {}

              // Ensure we have a user object
              if (!user) {
                throw new Error("User data missing in login response")
              }

              // Store user data and token
              localStorage.setItem("user", JSON.stringify(user))
              localStorage.setItem("token", token)
              localStorage.setItem("userRole", role) // Store role explicitly

              // Set authorization header for future requests
              axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

              // Show success message
              toast.success("Login successful! Redirecting...")

              // Delay redirect to show success message
              setTimeout(() => {
                switch (role) {
                  case "petShop":
                    navigate("/pet-shop/dashboard")
                    break
                  case "adoptionCenter":
                    navigate("/adoption-center/dashboard")
                    break
                  default:
                    navigate("/dashboard")
                }
              }, 1500)
            } else {
              throw new Error("Invalid login response format")
            }
          } catch (loginError) {
            console.error("Login error:", loginError)
            console.log("Login error response:", loginError.response?.data)

            // If login fails, still consider the registration successful
            // but direct the user to sign in manually
            toast.info("Your account has been verified successfully!")
            toast.info("Please sign in with your credentials.")

            setTimeout(() => navigate("/signin"), 2000)
          }
        }, 1000)
      } else {
        // Handle case where verification response indicates failure
        throw new Error(verifyResponse.data.message || "OTP verification failed")
      }
    } catch (error) {
      console.error("Verification error:", error)

      // Improved error handling with more specific messages
      if (error.response) {
        // Server responded with error status code
        const errorMessage =
          error.response.data?.message ||
          (error.response.status === 401 ? "Invalid OTP code" : "Verification failed. Please try again.")
        toast.error(errorMessage)

        // Log more details for debugging
        console.log("Error response data:", error.response.data)
        console.log("Error response status:", error.response.status)
      } else if (error.request) {
        // Request made but no response received
        toast.error("Server not responding. Please try again later.")
      } else {
        // Something else caused the error
        toast.error(error.message || "Verification failed. Please try again.")
      }

      setOtp("")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async (e) => {
    if (e) e.preventDefault()

    if (!registrationEmail) {
      toast.error("Email not found. Please try registering again.")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(getEndpoint("resend-otp"), {
        email: registrationEmail,
      })

      if (response.data.success) {
        toast.success("OTP has been resent to your email!")
        setOtp("")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP"
      toast.error(errorMessage)
      console.error("Resend OTP error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    try {
      window.location.href = `${API_BASE_URL}/users/auth/google`
    } catch (error) {
      toast.error("Failed to initiate Google login. Please try again.")
    }
  }

  if (isOtpSent) {
    return (
      <BackgroundWithImage>
        <Container>
          <Form onSubmit={handleVerifyOtp}>
            <Title>Verify Your Email</Title>
            <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
              We've sent a verification code to {registrationEmail}.<br />
              Please enter it below to complete your registration.
            </p>
            <InputGroup>
              <InputIcon>
                <Lock />
              </InputIcon>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)} // Don't trim on input to avoid cursor jumping
                maxLength={6}
                style={{ letterSpacing: "0.5em", textAlign: "center" }}
                required
              />
            </InputGroup>

            <Button type="submit" $loading={loading} disabled={loading}>
              {loading ? <Loader2 /> : "Verify Email"}
            </Button>

            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOtp}
                style={{
                  background: "none",
                  border: "none",
                  color: "#FF6B6B",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                disabled={loading}
              >
                Resend OTP
              </button>
            </p>
          </Form>
        </Container>
        <ToastContainer position="top-right" />
      </BackgroundWithImage>
    )
  }

  return (
    <BackgroundWithImage>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Title>Create Account</Title>

          <GoogleButton type="button" onClick={handleGoogleLogin}>
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Continue with Google
          </GoogleButton>

          <OrDivider>or</OrDivider>

          <RoleButtonGroup>
            <RoleButton type="button" onClick={() => handleRoleChange("user")} $active={role === "user"}>
              <PawPrint />
              Pet Owner
            </RoleButton>
            <RoleButton type="button" onClick={() => handleRoleChange("petShop")} $active={role === "petShop"}>
              <Store />
              Pet Shop
            </RoleButton>
            <RoleButton
              type="button"
              onClick={() => handleRoleChange("adoptionCenter")}
              $active={role === "adoptionCenter"}
            >
              <Heart />
              Adoption Center
            </RoleButton>
          </RoleButtonGroup>

          <SectionTitle>Account Information</SectionTitle>

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
          </InputGroup>
          {errors.username && (
            <ErrorMessage>
              <XCircle />
              {errors.username}
            </ErrorMessage>
          )}

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
          </InputGroup>
          {errors.email && (
            <ErrorMessage>
              <XCircle />
              {errors.email}
            </ErrorMessage>
          )}

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
            <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff /> : <Eye />}
            </PasswordToggle>
          </InputGroup>
          {errors.password && (
            <ErrorMessage>
              <XCircle />
              {errors.password}
            </ErrorMessage>
          )}

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
          </InputGroup>
          {errors.contact && (
            <ErrorMessage>
              <XCircle />
              {errors.contact}
            </ErrorMessage>
          )}

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
          </InputGroup>
          {errors.address && (
            <ErrorMessage>
              <XCircle />
              {errors.address}
            </ErrorMessage>
          )}

          {/* Adoption Center specific fields */}
          {role === "adoptionCenter" && (
            <>
              <SectionTitle>Adoption Center Details</SectionTitle>

              <InputGroup>
                <InputIcon>
                  <Store />
                </InputIcon>
                <Input
                  type="text"
                  name="adoptionCenterName"
                  placeholder="Adoption Center Name"
                  value={formData.adoptionCenterName}
                  onChange={handleInputChange}
                  error={errors.adoptionCenterName}
                  required
                />
              </InputGroup>
              {errors.adoptionCenterName && (
                <ErrorMessage>
                  <XCircle />
                  {errors.adoptionCenterName}
                </ErrorMessage>
              )}

              <InputGroup>
                <InputIcon $isTextarea>
                  <FileText />
                </InputIcon>
                <Textarea
                  name="adoptionCenterDescription"
                  placeholder="Describe your adoption center..."
                  value={formData.adoptionCenterDescription}
                  onChange={handleInputChange}
                  error={errors.adoptionCenterDescription}
                  required
                />
              </InputGroup>
              {errors.adoptionCenterDescription && (
                <ErrorMessage>
                  <XCircle />
                  {errors.adoptionCenterDescription}
                </ErrorMessage>
              )}
            </>
          )}

          {/* Pet Shop specific fields */}
          {role === "petShop" && (
            <>
              <SectionTitle>Pet Shop Details</SectionTitle>

              <InputGroup>
                <InputIcon>
                  <Store />
                </InputIcon>
                <Input
                  type="text"
                  name="shopName"
                  placeholder="Pet Shop Name"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  error={errors.shopName}
                  required
                />
              </InputGroup>
              {errors.shopName && (
                <ErrorMessage>
                  <XCircle />
                  {errors.shopName}
                </ErrorMessage>
              )}

              <InputGroup>
                <InputIcon $isTextarea>
                  <FileText />
                </InputIcon>
                <Textarea
                  name="shopDescription"
                  placeholder="Describe your pet shop..."
                  value={formData.shopDescription}
                  onChange={handleInputChange}
                  error={errors.shopDescription}
                  required
                />
              </InputGroup>
              {errors.shopDescription && (
                <ErrorMessage>
                  <XCircle />
                  {errors.shopDescription}
                </ErrorMessage>
              )}
            </>
          )}

          <TermsCheckbox>
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              I accept the{" "}
              <a href="/terms" target="_blank" rel="noreferrer">
                Terms & Conditions
              </a>
            </label>
          </TermsCheckbox>
          {errors.terms && (
            <ErrorMessage>
              <XCircle />
              {errors.terms}
            </ErrorMessage>
          )}

          <Button type="submit" $loading={loading} disabled={loading}>
            {loading ? <Loader2 /> : "Sign Up"}
          </Button>

          <ToggleButton type="button" onClick={() => navigate("/signin")}>
            Already have an account? Sign In
          </ToggleButton>
        </Form>
      </Container>
      <ToastContainer position="top-right" />
    </BackgroundWithImage>
  )
}

export default SignUp

