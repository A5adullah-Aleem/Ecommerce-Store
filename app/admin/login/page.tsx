"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Package, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem("adminToken", result.data.token)
        toast.success("Login successful!")
        // Use window.location to force a full page reload and clear any cached state
        window.location.href = "/admin"
      } else {
        toast.error(result.error || "Login failed")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">EasyShop Admin</h1>
            <p className="text-gray-600 mt-2">Sign in to your admin account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="admin@easyshop.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Email:</strong> admin@easyshop.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
