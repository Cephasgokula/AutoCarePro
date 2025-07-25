"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { signIn, signUp, updateProfile, changePassword, type AuthUser } from "@/lib/mock-auth-api"

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (
    name: string,
    email: string,
    password: string,
    phone: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUserProfile: (
    updates: Partial<Pick<AuthUser, "name" | "phone">>,
  ) => Promise<{ success: boolean; error?: string }>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { user: userData, error } = await signIn(email, password)

    if (userData) {
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, error: error || "Login failed" }
  }

  const signup = async (name: string, email: string, password: string, phone: string) => {
    const { user: userData, error } = await signUp(name, email, password, phone)

    if (userData) {
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, error: error || "Signup failed" }
  }

  const updateUserProfile = async (updates: Partial<Pick<AuthUser, "name" | "phone">>) => {
    if (!user) return { success: false, error: "Not authenticated" }

    const { user: updatedUser, error } = await updateProfile(user.id, updates)

    if (updatedUser) {
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return { success: true }
    }

    return { success: false, error: error || "Update failed" }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: "Not authenticated" }

    const { success, error } = await changePassword(user.id, currentPassword, newPassword)
    return { success, error: error || undefined }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateUserProfile,
        updatePassword,
        isLoading,
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
