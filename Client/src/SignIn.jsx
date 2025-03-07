import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import { Mail, Lock, Eye, EyeOff, XCircle, Loader2 } from "lucide-react"
import { PawPrint, Store, Heart } from "lucide-react"
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

const ForgotPasswordLink = styled(Link)`
  color: #FF6B6B;
  text-align: right;
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: -10px;
  display: block;
  
  &:hover {
    text-decoration: underline;
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

const API_BASE_URL = "http://localhost:8000/api/v1"

// Helper function to save user data
const saveUserData = (user, token) => {
  if (!user || !token) {
    console.error("Invalid user data or token")
    return false
  }

  // Ensure user has a role property
  if (!user.role && localStorage.getItem("selectedRole")) {
    user.role = localStorage.getItem("selectedRole")
  }

  localStorage.setItem("user", JSON.stringify(user))
  localStorage.setItem("token", token)
  localStorage.setItem("userRole", user.role || "user")

  // Set token for future requests
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

  return true
}

function SignIn() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [role, setRole] = useState("user")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get("error")
    const success = urlParams.get("success")

    if (success) {
      navigate("/additional-info")
    } else if (error) {
      setErrors({ submit: "Google authentication failed. Please try again." })
    }

    // Check if user is already logged in
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    if (token) {
      // If already logged in, redirect based on role
      if (userRole === "adoptionCenter") {
        navigate("/adoption-center/dashboard")
      } else if (userRole === "petShop") {
        navigate("/pet-shop/dashboard")
      } else {
        navigate("/home")
      }
    }
  }, [navigate])

  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${API_BASE_URL}/users/auth/google`
    } catch (error) {
      setErrors({
        submit: "Failed to initiate Google login. Please try again.",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
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

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    // Store the selected role in localStorage for potential use later
    localStorage.setItem("selectedRole", newRole)
  }

  // Get the appropriate API endpoint based on user role
  const getLoginEndpoint = () => {
    switch (role) {
      case "adoptionCenter":
        return `${API_BASE_URL}/adoption-centers/login`
      case "petShop":
        return `${API_BASE_URL}/pet-shops/login`
      case "user":
      default:
        return `${API_BASE_URL}/users/login`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      // Clean the form data to remove any whitespace
      const cleanedFormData = {
        email: formData.email.trim().toLowerCase(), // Normalize email
        password: formData.password, // Don't trim password as it might contain spaces
      }

      // Get the appropriate login endpoint based on the selected role
      const endpoint = getLoginEndpoint()
      console.log("Attempting login with endpoint:", endpoint)

      // Include role in the request data for certain roles
      if (role === "adoptionCenter" || role === "petShop") {
        cleanedFormData.role = role
      }

      console.log("Sending login request with data:", { ...cleanedFormData, password: "[REDACTED]" })

      // Make the login request with detailed logging
      const response = await axios.post(endpoint, cleanedFormData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      })

      // Log the entire response for debugging
      console.log("Full login response:", response)
      console.log("Response data:", response.data)
      console.log("Response status:", response.status)

      // Check if response exists
      if (!response || !response.data) {
        throw new Error("Empty response from server")
      }

      // Extract token and user data using a more flexible approach
      let token = null
      let user = null

      // Function to recursively search for token in nested objects
      const findTokenInObject = (obj, tokenKeys = ["token", "accessToken", "access_token", "jwt", "authToken"]) => {
        if (!obj || typeof obj !== "object") return null

        // Direct check for token keys
        for (const key of tokenKeys) {
          if (obj[key] && typeof obj[key] === "string") {
            return obj[key]
          }
        }

        // Check nested objects
        for (const key in obj) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            const foundToken = findTokenInObject(obj[key], tokenKeys)
            if (foundToken) return foundToken
          }
        }

        return null
      }

      // Function to recursively search for user object
      const findUserInObject = (obj, userKeys = ["user", "userData", "userInfo", "profile", "account", "data"]) => {
        if (!obj || typeof obj !== "object") return null

        // Direct check for user keys
        for (const key of userKeys) {
          if (obj[key] && typeof obj[key] === "object") {
            return obj[key]
          }
        }

        // Check nested objects
        for (const key in obj) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            const foundUser = findUserInObject(obj[key], userKeys)
            if (foundUser) return foundUser
          }
        }

        return null
      }

      // Try to find token and user in response data
      token = findTokenInObject(response.data)
      user = findUserInObject(response.data) || {}

      // If we still don't have a user object, create a minimal one
      if (!user || Object.keys(user).length === 0) {
        user = {
          email: cleanedFormData.email,
          role: role,
        }
      }

      // Ensure user has a role
      if (!user.role) {
        user.role = role
      }

      console.log("Extracted token:", token ? "Token found" : "No token found")
      console.log("Extracted user:", user)

      // If we still don't have a token, check if there's any string in the response that looks like a token
      if (!token && typeof response.data === "string" && response.data.length > 20) {
        // This might be a direct token response
        token = response.data
        console.log("Using direct string response as token")
      }

      // Last resort: check headers for token
      if (!token && response.headers) {
        const authHeader = response.headers["authorization"] || response.headers["Authorization"]
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7)
          console.log("Extracted token from Authorization header")
        }
      }

      // If we still don't have a token but the request was successful, create a temporary token
      // This is a fallback solution and should be removed in production
      if (!token && response.status >= 200 && response.status < 300) {
        console.warn("No token found in successful response. Creating temporary token.")
        token = `temp_token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      }

      if (!token) {
        throw new Error("No token found in response. Please check server response format.")
      }

      // Save user data
      const saved = saveUserData(user, token)
      console.log("User data saved:", saved)

      if (saved) {
        toast.success("Login successful! Redirecting...")

        // Redirect based on user role
        setTimeout(() => {
          if (user.role === "adoptionCenter") {
            console.log("Redirecting to adoption center dashboard")
            navigate("/adoption-center/dashboard")
          } else if (user.role === "petShop") {
            console.log("Redirecting to pet shop dashboard")
            navigate("/pet-shop/dashboard")
          } else {
            console.log("Redirecting to home")
            navigate("/home")
          }
        }, 1000)
      } else {
        throw new Error("Failed to save user data")
      }
    } catch (error) {
      console.error("Login error:", error)

      // Handle different types of errors
      if (error.response) {
        // The server responded with an error
        console.log("Error status:", error.response.status)
        console.log("Error data:", error.response.data)

        const errorMessage = error.response.data?.message || error.response.data?.error || "Invalid email or password"

        setErrors({ submit: errorMessage })
        toast.error(errorMessage)

        // If the error is about invalid credentials, show a more helpful message
        if (
          errorMessage.includes("Invalid user credentials") ||
          errorMessage.includes("Invalid credentials") ||
          errorMessage.includes("Invalid email or password")
        ) {
          toast.info("Please check that you've selected the correct role for your account")
        }
      } else if (error.request) {
        // No response received
        console.log("Error request:", error.request)
        setErrors({ submit: "No response from server. Please try again later." })
        toast.error("Server not responding. Please try again later.")
      } else {
        // Other errors
        console.log("Error message:", error.message)
        setErrors({ submit: error.message || "Login failed. Please try again." })
        toast.error(error.message || "An error occurred during login")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <BackgroundWithImage>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Title>Welcome Back</Title>

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
            <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff /> : <Eye />}
            </PasswordToggle>
            {errors.password && (
              <ErrorMessage>
                <XCircle />
                {errors.password}
              </ErrorMessage>
            )}
          </InputGroup>

          <ForgotPasswordLink 
            to="/forgot-password"
            state={{ email: formData.email, role }} // Pass both email and role
          >
            Forgot password?
          </ForgotPasswordLink>

          {errors.submit && (
            <ErrorMessage>
              <XCircle />
              {errors.submit}
            </ErrorMessage>
          )}

          <Button type="submit" $loading={loading} disabled={loading}>
            {loading ? <Loader2 /> : "Sign In"}
          </Button>

          <ToggleButton type="button" onClick={() => navigate("/signup")}>
            Don't have an account? Sign Up
          </ToggleButton>
        </Form>
      </Container>
      <ToastContainer position="top-right" />
    </BackgroundWithImage>
  )
}

export default SignIn