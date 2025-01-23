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
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error)
      toast.error("Network error. Please check your connection and try again.")
      return Promise.reject(error)
    }

    // Handle CORS errors
    if (error.response.status === 0) {
      console.error("CORS error:", error)
      toast.error("Unable to connect to the server. Please try again later.")
      return Promise.reject(error)
    }

    // Handle authentication errors
    if (error.response.status === 401) {
      console.error("Authentication error:", error)

      // Only redirect to login if token exists and is invalid
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }

      return Promise.reject(error)
    }

    // Handle server errors
    if (error.response.status >= 500) {
      console.error("Server error:", error)
      toast.error("Server error. Please try again later.")
      return Promise.reject(error)
    }

    // Handle validation errors
    if (error.response.status === 400) {
      const message = error.response.data.message || "Validation error"
      toast.error(message)
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

