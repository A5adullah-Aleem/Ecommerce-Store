"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  type: "makeup" | "skincare" | "fragrances"
}

export function ProductCard({ id, name, price, image, type }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <Link href={`/product/${id}`}>
        <div className="relative overflow-hidden bg-secondary/20 aspect-square">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-primary">
            {type === "makeup" ? "Makeup" : type === "skincare" ? "Skincare" : "Fragrance"}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="font-serif font-bold text-lg hover:text-primary transition-colors line-clamp-2">{name}</h3>
        </Link>
        <p className="text-primary font-semibold text-lg mt-2">Rs. {price.toLocaleString()}</p>

        <div className="flex gap-2 mt-4">
          <Link href={`/product/${id}`} className="flex-1">
            <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              View Details
            </button>
          </Link>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="px-3 py-2 border border-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-primary text-primary" : "text-primary"}`} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
