import axios from "axios"
import { toast } from "react-hot-toast"

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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Network error. Please check your connection.")
      return Promise.reject(error)
    }

    const message = error.response?.data?.message || "An error occurred"
    toast.error(message)
    return Promise.reject(error)
  },
)

