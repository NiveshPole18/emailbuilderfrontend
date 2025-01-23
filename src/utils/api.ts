import axios from "axios"
import { toast } from "react-hot-toast"

const API_URL = process.env.REACT_APP_API_URL || "https://emailbuilderbackend-1.onrender.com/api"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add token to headers if it exists
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`${config.method?.toUpperCase()} ${config.url}`, config)
    }

    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Response from ${response.config.url}:`, response)
    }
    return response
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error)
      toast.error("Unable to connect to the server. Please check your connection.")
      return Promise.reject(new Error("Network error"))
    }

    // Handle CORS errors
    if (error.response.status === 0) {
      console.error("CORS error:", error)
      toast.error("Unable to connect to the server due to CORS policy.")
      return Promise.reject(new Error("CORS error"))
    }

    // Handle authentication errors
    if (error.response.status === 401) {
      const message = error.response.data?.message || "Authentication failed"
      console.error("Auth error:", message)

      // Only clear token and redirect for invalid token errors
      if (error.response.data?.code === "INVALID_TOKEN") {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }

      toast.error(message)
      return Promise.reject(new Error(message))
    }

    // Handle validation errors
    if (error.response.status === 400) {
      const errors = error.response.data?.errors
      if (Array.isArray(errors)) {
        errors.forEach((err) => toast.error(err.message))
      } else {
        toast.error(error.response.data?.message || "Validation failed")
      }
      return Promise.reject(error)
    }

    // Handle server errors
    if (error.response.status >= 500) {
      console.error("Server error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
      return Promise.reject(error)
    }

    // Handle other errors
    const message = error.response.data?.message || "An error occurred"
    toast.error(message)
    return Promise.reject(error)
  },
)

