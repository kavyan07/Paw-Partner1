/**
 * Utility functions for debugging login and navigation issues
 */

// Debug function to check if redirection is working
export const debugRedirect = (navigate, path) => {
    console.log(`Attempting to navigate to: ${path}`)
    try {
      navigate(path)
      console.log(`Navigation to ${path} initiated`)
  
      // Check if navigation worked after a short delay
      setTimeout(() => {
        console.log(`Current location after navigation attempt: ${window.location.pathname}`)
        if (window.location.pathname !== path) {
          console.warn(`Navigation may have failed. Expected: ${path}, Actual: ${window.location.pathname}`)
  
          // Fallback to direct URL change
          console.log("Applying fallback navigation via window.location")
          window.location.href = path
        }
      }, 500)
    } catch (error) {
      console.error(`Navigation error:`, error)
  
      // Fallback to direct URL change
      console.log("Applying fallback navigation via window.location after error")
      window.location.href = path
    }
  }
  
  // Debug function to check user data
  export const debugUserData = () => {
    try {
      const token = localStorage.getItem("token")
      const userRole = localStorage.getItem("userRole")
      const userData = localStorage.getItem("user")
  
      console.log("Debug User Data:")
      console.log("- Token exists:", !!token)
      console.log("- User role:", userRole)
      console.log("- User data exists:", !!userData)
  
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          console.log("- Parsed user:", {
            ...parsedUser,
            role: parsedUser.role,
            id: parsedUser.id || parsedUser._id,
          })
        } catch (e) {
          console.error("- Failed to parse user data:", e)
        }
      }
  
      return { token, userRole, userData }
    } catch (error) {
      console.error("Error debugging user data:", error)
      return { token: null, userRole: null, userData: null }
    }
  }
  
  // Function to check if a route exists in the application
  export const checkRouteExists = (path) => {
    // This is a simple check that doesn't actually verify the route exists in React Router
    // but can help identify obvious typos or issues
    const commonRoutes = [
      "/",
      "/signin",
      "/signup",
      "/home",
      "/pet-profile",
      "/adoption-centers",
      "/pet-shops",
      "/pet-shop/dashboard",
      "/adoption-center/dashboard",
      "/forgot-password",
      "/additional-info",
    ]
  
    const exists = commonRoutes.includes(path)
    console.log(`Route check: ${path} ${exists ? "exists" : "may not exist"} in common routes`)
    return exists
  }
  
  // Function to fix common path issues
  export const normalizePath = (path) => {
    // Remove trailing slashes
    let normalized = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path
  
    // Ensure leading slash
    normalized = normalized.startsWith("/") ? normalized : `/${normalized}`
  
    // Check for common typos
    const corrections = {
      "/dashboard": "/home",
      "/pet-shop-dashboard": "/pet-shop/dashboard",
      "/petshop/dashboard": "/pet-shop/dashboard",
      "/adoption-center-dashboard": "/adoption-center/dashboard",
      "/adoptionCenter/dashboard": "/adoption-center/dashboard",
    }
  
    if (corrections[normalized]) {
      console.log(`Path correction: ${normalized} → ${corrections[normalized]}`)
      return corrections[normalized]
    }
  
    return normalized
  }
  
  