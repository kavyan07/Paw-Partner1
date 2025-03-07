/**
 * Helper functions for authentication
 */

// Save user data to localStorage
export const saveUserData = (user, token) => {
  if (!user || !token) return false

  localStorage.setItem("user", JSON.stringify(user))
  localStorage.setItem("token", token)
  localStorage.setItem("userRole", user.role || "user")

  return true
}

// Redirect user based on their role
export const redirectBasedOnRole = (navigate, customRole = null) => {
  // Get role from localStorage or use provided custom role
  const role =
    customRole || JSON.parse(localStorage.getItem("user"))?.role || localStorage.getItem("userRole") || "user"

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
}

// Get authentication token
export const getAuthToken = () => {
  return localStorage.getItem("token")
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token")
}

// Get current user data
export const getCurrentUser = () => {
  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

// Logout user
export const logoutUser = (navigate) => {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  localStorage.removeItem("userRole")

  if (navigate) {
    navigate("/signin")
  }
}

