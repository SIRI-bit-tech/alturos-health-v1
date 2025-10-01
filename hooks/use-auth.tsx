"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { authApi, removeAuthToken } from "@/lib/api"

interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: "patient" | "doctor" | "admin" | "staff"
  phone_number?: string
  date_of_birth?: string
  profile_picture?: string
}

interface AuthContextType {
  user: User | null
  profile: any | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; error?: string }>
  register: (userData: any) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)

          // Fetch fresh profile data
          const { data, error } = await authApi.getProfile()
          if (data && !error) {
            setProfile(data)
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error)
          removeAuthToken()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true)
    try {
      const { data, error } = await authApi.login(credentials)

      if (data && !error) {
        setUser(data.user)
        setProfile(data.profile)
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("access_token", data.access)
        localStorage.setItem("refresh_token", data.refresh)
        // Mirror token into a cookie so Next.js middleware can read it
        try {
          document.cookie = `access_token=${data.access}; Path=/; Max-Age=${60 * 60 * 4}; SameSite=Lax` // 4 hours
        } catch (_) {
          // ignore if not in browser
        }
        return { success: true }
      } else {
        return { success: false, error: error || "Login failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      const { data, error } = await authApi.register(userData)

      if (data && !error) {
        // Some backends return tokens on register; others don't. Handle both.
        const hasTokens = Boolean((data as any).access && (data as any).refresh)

        if (hasTokens) {
          setUser((data as any).user)
          localStorage.setItem("user", JSON.stringify((data as any).user))
          localStorage.setItem("access_token", (data as any).access)
          localStorage.setItem("refresh_token", (data as any).refresh)
          return { success: true }
        }

        // If tokens weren't returned, immediately log the user in
        const loginResult = await authApi.login({
          username: userData.username,
          password: userData.password,
        })

        if (loginResult.data && !loginResult.error) {
          setUser((loginResult.data as any).user)
          localStorage.setItem("user", JSON.stringify((loginResult.data as any).user))
          localStorage.setItem("access_token", (loginResult.data as any).access)
          localStorage.setItem("refresh_token", (loginResult.data as any).refresh)
        try {
          document.cookie = `access_token=${(loginResult.data as any).access}; Path=/; Max-Age=${60 * 60 * 4}; SameSite=Lax`
        } catch (_) {}
          return { success: true }
        }

        return { success: false, error: loginResult.error || "Auto-login after registration failed" }
      } else {
        return { success: false, error: error || "Registration failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setProfile(null)
      removeAuthToken()
      try {
        document.cookie = "access_token=; Path=/; Max-Age=0; SameSite=Lax"
      } catch (_) {}
    }
  }

  const updateProfile = async (data: any) => {
    try {
      const { data: updatedProfile, error } = await authApi.updateProfile(data)

      if (updatedProfile && !error) {
        setProfile(updatedProfile)
        return { success: true }
      } else {
        return { success: false, error: error || "Update failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const refreshProfile = async () => {
    try {
      const { data, error } = await authApi.getProfile()
      if (data && !error) {
        setProfile(data)
      }
    } catch (error) {
      console.error("Error refreshing profile:", error)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
