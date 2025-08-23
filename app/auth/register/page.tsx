"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Shield, Users, UserPlus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    user_type: "patient",
    phone_number: "",
    date_of_birth: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const result = await register(formData)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Registration failed")
    }

    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      user_type: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cream via-healthcare-sage to-healthcare-forest flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-healthcare-forest rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-healthcare-sage rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-healthcare-cream rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <UserPlus className="h-8 w-8 text-healthcare-forest" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-healthcare-forest mb-2">Join Alturos Health</h1>
          <p className="text-healthcare-forest/70">Create your account to get started</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-healthcare-forest">Create Account</CardTitle>
            <CardDescription className="text-center text-healthcare-forest/60">
              Fill in your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* Account Type */}
              <div className="space-y-2">
                <Label className="text-healthcare-forest font-medium">Account Type</Label>
                <Select value={formData.user_type} onValueChange={handleSelectChange}>
                  <SelectTrigger className="h-12 border-healthcare-sage/30 focus:border-healthcare-forest">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-healthcare-forest font-medium">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="h-12 border-healthcare-sage/30 focus:border-healthcare-forest focus:ring-healthcare-forest/20"
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-healthcare-forest font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="h-12 border-healthcare-sage/30 focus:border-healthcare-forest focus:ring-healthcare-forest/20"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Username and Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-healthcare-forest font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="h-12 border-healthcare-sage/30 focus:border-healthcare-forest focus:ring-healthcare-forest/20"
                    placeholder="Choose username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-healthcare-forest font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 border-healthcare-sage/30 focus:border-healthcare-forest focus:ring-healthcare-forest/20"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Phone and Date of Birth */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-healthcare-forest font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="h-12 border-healthcare-sage/30 focus:border-healthcare-forest focus:ring-healthcare-forest/20"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className="text-healthcare-forest font-medium">
                    Date of Birth
                  </Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="h-12 border-healthcare-sage/30 focus:border-healthcare-forest focus:ring-healthcare-forest/20"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-healthcare-forest font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 pr-12 border-healthcare-sage/30 focus:border-healthcare-forest focus:ring-healthcare-forest/20"
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-healthcare-forest/60 hover:text-healthcare-forest"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirm" className="text-healthcare-forest font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password_confirm"
                      name="password_confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.password_confirm}
                      onChange={handleChange}
                      className="h-12 pr-12 border-healthcare-sage/30 focus:border-healthcare-forest focus:ring-healthcare-forest/20"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-healthcare-forest/60 hover:text-healthcare-forest"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full h-12 bg-healthcare-forest hover:bg-healthcare-forest/90 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading || authLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-healthcare-forest/60">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-healthcare-forest font-semibold hover:text-healthcare-forest/80"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center space-x-8 text-healthcare-forest/60">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm">HIPAA Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">Trusted by 10k+ patients</span>
          </div>
        </div>
      </div>
    </div>
  )
}
