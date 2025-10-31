"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { motion } from "framer-motion"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Makeup", href: "/collection?type=makeup" },
    { label: "Skincare", href: "/collection?type=skincare" },
    { label: "Fragrances", href: "/collection?type=fragrances" },
    { label: "Track Order", href: "/track-order" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-serif font-bold text-primary">Glamour</div>
          <div className="text-xs font-semibold text-muted-foreground">Cosmetics</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium hover:text-primary transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Cart Icon */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingBag className="w-6 h-6 text-primary hover:text-primary/80 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-secondary/50 border-t"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </header>
  )
}
