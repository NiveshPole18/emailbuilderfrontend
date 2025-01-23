import React, { createContext, useContext, useState, type ReactNode, useEffect } from "react"
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
          // Update the endpoint to match the backend
          const response = await api.get("/auth/me")
          setUser(response.data)
        } catch (error) {
          console.error("Auth check failed:", error)
          localStorage.removeItem("token")
          setUser(null)
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
      // Update the endpoint to match the backend
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      })

      const { token, user: userData } = response.data
      localStorage.setItem("token", token)
      setUser(userData)
    } catch (error: any) {
      console.error("Signup failed:", error)
      const message = error.response?.data?.message || "Signup failed"
      throw new Error(message)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // Update the endpoint to match the backend
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      const { token, user: userData } = response.data
      localStorage.setItem("token", token)
      setUser(userData)
    } catch (error: any) {
      console.error("Login failed:", error)
      const message = error.response?.data?.message || "Login failed"
      throw new Error(message)
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

