"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  username: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  verifyTwoFactor: (code: string) => Promise<boolean>
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default demo credentials
const DEMO_EMAIL = "admin@urbanfarm.com"
const DEMO_PASSWORD = "password123"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await api.get("/auth/me")
          setUser(response.data)
          setIsAuthenticated(true)
        } catch (error) {
          localStorage.removeItem("token")
          console.error("Authentication check failed:", error)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Check if using demo credentials
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        // Set demo user and token
        const demoUser = {
          id: 1,
          username: "Admin User",
          email: DEMO_EMAIL,
          role: "admin",
        }

        const demoToken = "demo-token-12345"
        localStorage.setItem("token", demoToken)

        setUser(demoUser)
        setIsAuthenticated(true)

        toast({
          title: "Demo Login successful",
          description: "Welcome to the Urban Farming Management System! All features are now accessible.",
        })

        return true
      }

      // Regular API login
      const response = await api.post("/auth/login", { email, password })

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token)

        // Fetch user details after successful login
        const userResponse = await api.get("/auth/me")
        setUser(userResponse.data)
        setIsAuthenticated(true)

        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        return true
      }

      return false
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
      return false
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { username, email, password })

      if (response.status === 201 || response.status === 200) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. You can now log in.",
        })
        return true
      }

      return false
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        title: "Registration failed",
        description: "An error occurred during registration",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const verifyTwoFactor = async (code: string) => {
    try {
      const response = await api.post("/auth/verify-2fa", { code })

      if (response.status === 200) {
        // If 2FA verification updates the token, save it
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token)
        }

        // Fetch user details after successful 2FA verification
        const userResponse = await api.get("/auth/me")
        setUser(userResponse.data)
        setIsAuthenticated(true)

        toast({
          title: "Verification successful",
          description: "Two-factor authentication verified successfully.",
        })

        return true
      }

      return false
    } catch (error) {
      console.error("2FA verification failed:", error)
      toast({
        title: "Verification failed",
        description: "Invalid verification code",
        variant: "destructive",
      })
      return false
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const response = await api.post("/auth/forgot-password", { email })

      if (response.status === 200) {
        toast({
          title: "Password reset email sent",
          description: "Check your email for password reset instructions.",
        })
        return true
      }

      return false
    } catch (error) {
      console.error("Forgot password request failed:", error)
      toast({
        title: "Request failed",
        description: "Failed to send password reset email",
        variant: "destructive",
      })
      return false
    }
  }

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await api.post("/auth/reset-password", { token, password })

      if (response.status === 200) {
        toast({
          title: "Password reset successful",
          description: "Your password has been reset. You can now log in with your new password.",
        })
        return true
      }

      return false
    } catch (error) {
      console.error("Password reset failed:", error)
      toast({
        title: "Reset failed",
        description: "Failed to reset password",
        variant: "destructive",
      })
      return false
    }
  }

  return (
      <AuthContext.Provider
          value={{
            user,
            isAuthenticated,
            isLoading,
            login,
            register,
            logout,
            verifyTwoFactor,
            forgotPassword,
            resetPassword,
          }}
      >
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
