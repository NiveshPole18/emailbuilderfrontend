import axios from "axios"
import { toast } from "react-hot-toast"

const API_URL = process.env.REACT_APP_API_URL || "https://emailbuilderbackend-1.onrender.com/api"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Enable credentials
  withCredentials: true,
})

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error("Network error. Please check your connection.")
      return Promise.reject(new Error("Network error"))
    }

    // Handle CORS errors
    if (error.response.status === 0) {
      toast.error("CORS error. Please check the API configuration.")
      return Promise.reject(new Error("CORS error"))
    }

    const message = error.response?.data?.message || "An error occurred"
    toast.error(message)

    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

