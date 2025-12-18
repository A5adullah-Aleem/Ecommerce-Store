"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Heart, Share2, ShoppingCart, Check, Truck, Shield, RotateCcw, ChevronRight } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: "women" | "men" | "kids"
  collection: string
  type: "makeup" | "skincare" | "fragrances"
  in_stock: boolean
  sizes: string[]
  colors: string[]
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[]
  created_at: string
  updated_at: string
}

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  )
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  )
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} at Glamour Cosmetics!`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      makeup: "Makeup",
      skincare: "Skincare",
      fragrances: "Fragrance",
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb Navigation - SEO friendly */}
      <nav 
        className="max-w-7xl mx-auto px-4 py-4 border-b" 
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>
            <ChevronRight className="w-4 h-4" />
          </li>
          <li>
            <Link href="/collection" className="hover:text-primary transition-colors">
              Products
            </Link>
          </li>
          <li>
            <ChevronRight className="w-4 h-4" />
          </li>
          <li>
            <Link
              href={`/collection?type=${product.type}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {getTypeLabel(product.type)}
            </Link>
          </li>
          <li>
            <ChevronRight className="w-4 h-4" />
          </li>
          <li className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <article itemScope itemType="https://schema.org/Product">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-secondary/20 rounded-2xl overflow-hidden aspect-square relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  itemProp="image"
                  loading="eager"
                />
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Type Badge & Stock Status */}
              <div className="flex items-center gap-3">
                <span className="inline-block bg-primary/10 px-4 py-2 rounded-full text-sm font-semibold text-primary">
                  {getTypeLabel(product.type)}
                </span>
                {product.in_stock ? (
                  <span 
                    className="inline-flex items-center gap-1 text-green-600 text-sm font-medium"
                    itemProp="availability"
                    content="https://schema.org/InStock"
                  >
                    <Check className="w-4 h-4" />
                    In Stock
                  </span>
                ) : (
                  <span 
                    className="text-red-500 text-sm font-medium"
                    itemProp="availability"
                    content="https://schema.org/OutOfStock"
                  >
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product Name & Price */}
              <div>
                <h1 
                  className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3"
                  itemProp="name"
                >
                  {product.name}
                </h1>
                <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <p className="text-3xl font-bold text-primary">
                    <span itemProp="priceCurrency" content="PKR">Rs. </span>
                    <span itemProp="price" content={product.price.toString()}>
                      {product.price.toLocaleString()}
                    </span>
                  </p>
                  <meta itemProp="url" content={`/products/${product.slug}`} />
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p 
                  className="text-muted-foreground text-lg leading-relaxed"
                  itemProp="description"
                >
                  {product.description}
                </p>
              </div>

              {/* Size Options */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h2 className="font-semibold mb-3 text-foreground">Size</h2>
                  <div className="flex gap-3 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium text-sm transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h2 className="font-semibold mb-3 text-foreground">
                    Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
                  </h2>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium text-sm transition-all ${
                          selectedColor === color
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-300 hover:border-primary"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h2 className="font-semibold mb-3 text-foreground">Quantity</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors flex items-center justify-center"
                    disabled={!product.in_stock}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors flex items-center justify-center"
                    disabled={!product.in_stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className={`flex-1 py-6 text-lg transition-all ${
                    addedToCart
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="w-14 h-14 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors flex items-center justify-center"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
                    }`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="w-14 h-14 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors flex items-center justify-center"
                  aria-label="Share product"
                >
                  <Share2 className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Orders over Rs. 5,000</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% Protected</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7-day policy</p>
                </div>
              </div>

              {/* Product Info Table */}
              <div className="border-t pt-6 space-y-3">
                <h2 className="font-semibold text-foreground mb-4">Product Details</h2>
                <dl className="grid grid-cols-2 gap-y-3 text-sm">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium capitalize" itemProp="category">{product.category}</dd>
                  
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium">{getTypeLabel(product.type)}</dd>
                  
                  <dt className="text-muted-foreground">Collection</dt>
                  <dd className="font-medium">{product.collection}</dd>
                  
                  <dt className="text-muted-foreground">SKU</dt>
                  <dd className="font-medium text-xs" itemProp="sku">{product.id.slice(0, 8).toUpperCase()}</dd>
                </dl>
              </div>

              {/* Brand info - hidden but for SEO */}
              <div itemProp="brand" itemScope itemType="https://schema.org/Brand" className="hidden">
                <meta itemProp="name" content="Glamour Cosmetics" />
              </div>
            </motion.div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

