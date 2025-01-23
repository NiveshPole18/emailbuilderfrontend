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
      toast.error("Network error. Please check your connection.")
      return Promise.reject(new Error("Network error"))
    }

    // Handle 404 errors
    if (error.response.status === 404) {
      console.error("Resource not found:", error.config.url)
      toast.error(`Resource not found: ${error.config.url}`)
    }

    // Handle authentication errors
    if (error.response.status === 401) {
      console.error("Authentication error:", error)
      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    // Handle other errors
    const message = error.response?.data?.message || "An error occurred"
    toast.error(message)

    return Promise.reject(error)
  },
)

