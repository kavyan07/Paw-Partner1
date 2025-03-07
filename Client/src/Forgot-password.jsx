"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import { Mail, Lock, Eye, EyeOff, XCircle, Loader2, ArrowLeft, Check } from "lucide-react"
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

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
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

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  
  &:hover {
    color: #FF6B6B;
  }
`

const OtpContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
`

const OtpInput = styled.input`
  width: 50px;
  height: 60px;
  border: 2px solid ${(props) => (props.error ? "#FF4444" : "#E0E0E0")};
  border-radius: 12px;
  font-size: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #FF6B6B;
    outline: none;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
  }
`

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:disabled {
    color: #999;
    cursor: not-allowed;
  }
`

const SuccessIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  
  svg {
    width: 60px;
    height: 60px;
    color: #4CAF50;
  }
`

const API_BASE_URL = "http://localhost:8000/api/v1"

function ForgotPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get email and role from location state if available
  const initialEmail = location.state?.email || ""
  const initialRole = location.state?.role || "user"

  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState(initialEmail)
  const [role, setRole] = useState(initialRole)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // References for OTP inputs
  const otpRefs = useRef([])

  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6)
  }, [])

  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // Get the appropriate API endpoint based on user role
  const getApiEndpoint = () => {
    switch (role) {
      case "adoptionCenter":
        return `${API_BASE_URL}/adoption-centers`
      case "petShop":
        return `${API_BASE_URL}/pet-shops`
      case "user":
      default:
        return `${API_BASE_URL}/users`
    }
  }

  const handleRequestOTP = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setErrors({ email: "Email is required" })
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Email is invalid" })
      return
    }

    setLoading(true)
    try {
      const endpoint = `${getApiEndpoint()}/forgot-password`

      const response = await axios.post(endpoint, { email })

      toast.success("OTP sent to your email")
      setStep(2)
      setResendTimer(60) // 60 seconds cooldown
    } catch (error) {
      console.error("Error requesting OTP:", error)

      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to send OTP. Please try again."

      setErrors({ submit: errorMessage })
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
        if (otpRefs.current[index - 1]) {
          otpRefs.current[index - 1].focus()
        }
      }
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return

    setLoading(true)
    try {
      const endpoint = `${getApiEndpoint()}/forgot-password`

      await axios.post(endpoint, { email })

      toast.success("New OTP sent to your email")
      setResendTimer(60) // 60 seconds cooldown
    } catch (error) {
      console.error("Error resending OTP:", error)

      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to resend OTP. Please try again."

      setErrors({ submit: errorMessage })
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()

    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP" })
      return
    }

    // Move to password reset step
    setStep(3)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const endpoint = `${getApiEndpoint()}/verify-reset-password-otp`

      await axios.post(endpoint, {
        email,
        otp: otp.join(""),
        newPassword: password,
      })

      toast.success("Password reset successful!")
      setStep(4)
    } catch (error) {
      console.error("Error resetting password:", error)

      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to reset password. Please try again."

      setErrors({ submit: errorMessage })
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Title>Forgot Password</Title>
            <Subtitle>Enter your email address and we'll send you an OTP to reset your password</Subtitle>

            <InputGroup>
              <InputIcon>
                <Mail />
              </InputIcon>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: null })
                }}
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

            {errors.submit && (
              <ErrorMessage>
                <XCircle />
                {errors.submit}
              </ErrorMessage>
            )}

            <Button type="submit" $loading={loading} disabled={loading}>
              {loading ? <Loader2 /> : "Send OTP"}
            </Button>
          </>
        )

      case 2:
        return (
          <>
            <Title>Enter OTP</Title>
            <Subtitle>We've sent a 6-digit code to {email}</Subtitle>

            <OtpContainer>
              {otp.map((digit, index) => (
                <OtpInput
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  ref={(el) => (otpRefs.current[index] = el)}
                  error={errors.otp}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoFocus={index === 0}
                />
              ))}
            </OtpContainer>

            {errors.otp && (
              <ErrorMessage>
                <XCircle />
                {errors.otp}
              </ErrorMessage>
            )}

            <ResendButton type="button" onClick={handleResendOTP} disabled={resendTimer > 0}>
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </ResendButton>

            {errors.submit && (
              <ErrorMessage>
                <XCircle />
                {errors.submit}
              </ErrorMessage>
            )}

            <Button type="submit" $loading={loading} disabled={loading}>
              {loading ? <Loader2 /> : "Verify OTP"}
            </Button>
          </>
        )

      case 3:
        return (
          <>
            <Title>Reset Password</Title>
            <Subtitle>Create a new password for your account</Subtitle>

            <InputGroup>
              <InputIcon>
                <Lock />
              </InputIcon>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: null })
                }}
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

            <InputGroup>
              <InputIcon>
                <Lock />
              </InputIcon>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null })
                }}
                error={errors.confirmPassword}
                required
              />
              <PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </PasswordToggle>
              {errors.confirmPassword && (
                <ErrorMessage>
                  <XCircle />
                  {errors.confirmPassword}
                </ErrorMessage>
              )}
            </InputGroup>

            {errors.submit && (
              <ErrorMessage>
                <XCircle />
                {errors.submit}
              </ErrorMessage>
            )}

            <Button type="submit" $loading={loading} disabled={loading}>
              {loading ? <Loader2 /> : "Reset Password"}
            </Button>
          </>
        )

      case 4:
        return (
          <>
            <SuccessIcon>
              <Check />
            </SuccessIcon>
            <Title>Password Reset</Title>
            <Subtitle>Your password has been reset successfully</Subtitle>

            <Button type="button" onClick={() => navigate("/signin")}>
              Back to Sign In
            </Button>
          </>
        )
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    switch (step) {
      case 1:
        handleRequestOTP(e)
        break
      case 2:
        handleVerifyOTP(e)
        break
      case 3:
        handleResetPassword(e)
        break
    }
  }

  return (
    <BackgroundWithImage>
      <Container>
        {step < 4 && (
          <BackButton type="button" onClick={() => (step > 1 ? setStep(step - 1) : navigate("/signin"))}>
            <ArrowLeft size={16} />
            {step > 1 ? "Back" : "Back to Sign In"}
          </BackButton>
        )}

        <Form onSubmit={handleSubmit}>{renderStep()}</Form>
      </Container>
      <ToastContainer position="top-right" />
    </BackgroundWithImage>
  )
}

export default ForgotPassword

