import axios from "axios"
import { toast } from "react-hot-toast"

// Use the correct API URL
const API_URL = process.env.REACT_APP_API_URL || "https://emailbuilderbackend-1.onrender.com/api"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
    return Promise.reject(error)
  },
)

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Network error. Please check your connection.")
      return Promise.reject(new Error("Network error"))
    }

    // Handle specific error codes
    switch (error.response.status) {
      case 401:
        localStorage.removeItem("token") // Clear invalid token
        toast.error("Session expired. Please login again.")
        window.location.href = "/login"
        break
      case 404:
        toast.error("Resource not found")
        break
      default:
        toast.error(error.response?.data?.message || "An error occurred")
    }

    return Promise.reject(error)
  },
)

