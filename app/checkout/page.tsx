"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { createOrder } from "@/lib/api"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface CheckoutFormData {
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>()

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsLoading(true)
    try {
      const orderData = {
        customer_name: data.customerName,
        email: data.email,
        phone: data.phone,
        address: `${data.address}, ${data.city}, ${data.postalCode}`,
        city: data.city,
        postal_code: data.postalCode,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: total + 500 + Math.round(total * 0.17),
        status: "pending",
      }

      const order = await createOrder(orderData)
      if (order && order.id) {
        toast.success(`Order placed successfully! Order ID: ${order.id}`)
        clearCart()
        router.push(`/track-order?orderId=${order.id}`)
      } else {
        throw new Error("Failed to create order - no order ID returned")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add items to your cart before checking out</p>
          <Button onClick={() => router.push("/collection")}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-2xl font-serif font-bold mb-6">Shipping Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  {...register("customerName", { required: "Name is required" })}
                  placeholder="John Doe"
                  className="w-full"
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  {...register("phone", { required: "Phone is required" })}
                  placeholder="+92 300 1234567"
                  className="w-full"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input
                  {...register("address", { required: "Address is required" })}
                  placeholder="123 Main Street"
                  className="w-full"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    {...register("city", { required: "City is required" })}
                    placeholder="Karachi"
                    className="w-full"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <Input
                    {...register("postalCode", { required: "Postal code is required" })}
                    placeholder="75500"
                    className="w-full"
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 mt-6">
                {isLoading ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm h-fit"
          >
            <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 pb-6 border-b">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs. 500</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (17%)</span>
                <span>Rs. {Math.round(total * 0.17).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>Rs. {(total + 500 + Math.round(total * 0.17)).toLocaleString()}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
