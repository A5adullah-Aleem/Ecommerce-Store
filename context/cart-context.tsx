"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === newItem.productId)
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === newItem.productId ? { ...item, quantity: item.quantity + newItem.quantity } : item,
        )
      }
      return [...prevItems, newItem]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      setItems((prevItems) => prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
