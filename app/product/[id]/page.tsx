"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useProducts } from "@/hooks/useProducts"
import { Heart, Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const { getProduct } = useProducts()
  const { addItem } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Product page: Fetching product with ID:', productId)
        const result = await getProduct(productId)
        console.log('Product page: getProduct result:', result)
        
        if (result.success && result.data) {
          setProduct(result.data)
        } else {
          console.error('Product not found:', result.error)
          setProduct(null)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, getProduct])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-secondary/20 rounded-lg overflow-hidden aspect-square"
          >
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          {/* Product Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
                  <span className="text-sm font-semibold text-primary">
                    {product.type === "makeup" ? "Makeup" : product.type === "skincare" ? "Skincare" : "Fragrance"}
                  </span>
                </div>

            <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-6">Rs. {product.price.toLocaleString()}</p>

            <p className="text-muted-foreground text-lg mb-8">{product.description}</p>

            {/* Size Options */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex gap-3 flex-wrap">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((size) => (
                    <button
                      key={size}
                      className="px-4 py-2 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold text-sm"
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <span className="text-muted-foreground">One Size</span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border rounded-lg hover:bg-secondary"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border rounded-lg hover:bg-secondary"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-6 text-lg"
              >
                Add to Cart
              </Button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="px-6 py-3 border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? "fill-primary text-primary" : "text-primary"}`} />
              </button>
              <button className="px-6 py-3 border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors">
                <Share2 className="w-6 h-6 text-primary" />
              </button>
            </div>

            {/* Product Info */}
            <div className="border-t pt-8 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-semibold text-green-600">In Stock</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">Free shipping on orders over Rs. 5000</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
