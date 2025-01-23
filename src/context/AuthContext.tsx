import type React from "react"
import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { toast } from "react-hot-toast"
import { api } from "../utils/api.ts"
import { validateSignup } from "../utils/validation.ts"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => void
  signUp: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await api.get("/auth/me")
          setUser(response.data)
        } catch (error: any) {
          console.error("Auth check failed:", error)
          // Only remove token if it's actually invalid, not for network errors
          if (error.response?.status === 401) {
            localStorage.removeItem("token")
            setUser(null)
          }
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const signUp = async (name: string, email: string, password: string) => {
    const errors = validateSignup(name, email, password)
    if (errors.length > 0) {
      throw new Error(errors.join(" "))
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      })

      const { token, user: userData } = response.data
      localStorage.setItem("token", token)
      setUser(userData)
      toast.success("Registration successful!")
    } catch (error: any) {
      console.error("Signup failed:", error)

      // Handle different types of errors
      if (!error.response) {
        throw new Error("Network error. Please check your connection.")
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || "Invalid registration data")
      }

      throw new Error(error.response?.data?.message || "Registration failed")
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      const { token, user: userData } = response.data
      localStorage.setItem("token", token)
      setUser(userData)
      toast.success("Login successful!")
    } catch (error: any) {
      console.error("Login failed:", error)

      // Handle different types of errors
      if (!error.response) {
        throw new Error("Network error. Please check your connection.")
      }

      if (error.response?.status === 401) {
        throw new Error("Invalid email or password")
      }

      throw new Error(error.response?.data?.message || "Login failed")
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, logout, signUp, login }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

