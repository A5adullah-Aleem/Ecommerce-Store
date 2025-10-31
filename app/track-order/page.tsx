"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

interface Order {
  id: string
  customer_name: string
  email: string
  phone: string
  address: string
  city?: string
  postal_code?: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  created_at: string
  updated_at: string
}

const statusConfig = {
  pending: {
    label: "Order Pending",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    icon: Clock,
    description: "Your order has been received and is being processed"
  },
  processing: {
    label: "Processing",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: Package,
    description: "Your order is being prepared for shipment"
  },
  shipped: {
    label: "Shipped",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    icon: Truck,
    description: "Your order is on its way to you"
  },
  delivered: {
    label: "Delivered",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: CheckCircle,
    description: "Your order has been delivered successfully"
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: XCircle,
    description: "Your order has been cancelled"
  }
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Auto-search if orderId is provided in URL
  useEffect(() => {
    const urlOrderId = searchParams.get("orderId")
    if (urlOrderId) {
      setOrderId(urlOrderId)
      // Auto-search after a short delay
      setTimeout(() => {
        handleSearch(new Event("submit") as any)
      }, 500)
    }
  }, [searchParams])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!orderId.trim() && !email.trim()) {
      toast.error("Please enter either Order ID or Email")
      return
    }

    setLoading(true)
    setError("")
    setOrder(null)

    try {
      const params = new URLSearchParams()
      if (orderId.trim()) params.append("orderId", orderId.trim())
      if (email.trim()) params.append("email", email.trim())

      const response = await fetch(`/api/orders/track?${params}`)
      const result = await response.json()

      if (result.success && result.data) {
        setOrder(result.data)
        toast.success("Order found!")
      } else {
        setError(result.error || "Order not found")
        toast.error("Order not found")
      }
    } catch (error) {
      console.error("Error tracking order:", error)
      setError("Failed to track order. Please try again.")
      toast.error("Failed to track order")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const Icon = statusConfig[status].icon
    return <Icon className="h-5 w-5" />
  }

  const getStatusTimeline = (currentStatus: string) => {
    const statuses = ["pending", "processing", "shipped", "delivered"]
    const currentIndex = statuses.indexOf(currentStatus)
    
    return statuses.map((status, index) => {
      const isCompleted = index <= currentIndex
      const isCurrent = index === currentIndex
      const config = statusConfig[status as keyof typeof statusConfig]
      
      return (
        <div key={status} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isCompleted ? config.bgColor : "bg-gray-100"
          }`}>
            {getStatusIcon(status as keyof typeof statusConfig)}
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${
              isCompleted ? config.color : "text-gray-500"
            }`}>
              {config.label}
            </p>
            {isCurrent && (
              <p className="text-xs text-gray-500">{config.description}</p>
            )}
          </div>
          {index < statuses.length - 1 && (
            <div className={`flex-1 h-0.5 mx-4 ${
              isCompleted ? "bg-primary" : "bg-gray-200"
            }`} />
          )}
        </div>
      )
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif font-bold mb-4">Track Your Order</h1>
          <p className="text-muted-foreground text-lg">
            Enter your Order ID or Email to check the status of your order
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 rounded-lg p-8 mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="text-center">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Track Order
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Order Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Order Status</h2>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${statusConfig[order.status].bgColor} mr-4`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </h3>
                    <p className="text-gray-600">{statusConfig[order.status].description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-lg font-semibold">{order.id}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-4">Order Progress</h4>
                <div className="flex items-center">
                  {getStatusTimeline(order.status)}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{order.address}</p>
                    {order.city && (
                      <p className="font-medium">{order.city}, {order.postal_code}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date</span>
                    <span className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium">{order.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium">Rs. {order.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium">Product ID: {item.productId}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Rs. {item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total: Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}
