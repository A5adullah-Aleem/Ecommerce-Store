"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-serif font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
          <Link href="/collection">
            <Button className="bg-primary hover:bg-primary/90">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-lg">{item.name}</h3>
                    <p className="text-primary font-semibold">Rs. {item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-1 border rounded hover:bg-secondary"
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 border rounded hover:bg-secondary"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    <button onClick={() => removeItem(item.productId)} className="text-red-500 hover:text-red-700 mt-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm h-fit sticky top-4"
          >
            <h2 className="text-2xl font-serif font-bold mb-4">Order Summary</h2>
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
                <span>Tax</span>
                <span>Rs. {Math.round(total * 0.17).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>Rs. {(total + 500 + Math.round(total * 0.17)).toLocaleString()}</span>
            </div>
            <Link href="/checkout" className="w-full block">
              <Button className="w-full bg-primary hover:bg-primary/90 mb-2">Proceed to Checkout</Button>
            </Link>
            <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
              Clear Cart
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
