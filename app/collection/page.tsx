"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useProducts } from "@/hooks/useProducts"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CollectionPage() {
  const [activeTab, setActiveTab] = useState<"makeup" | "skincare" | "fragrances">("makeup")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { getProducts } = useProducts()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Collection page: getProducts function:', typeof getProducts)
        console.log('Collection page: getProducts available:', !!getProducts)
        
        if (typeof getProducts !== 'function') {
          console.error('getProducts is not a function!')
          setProducts([])
          setLoading(false)
          return
        }
        
        const result = await getProducts()
        console.log('Collection page: getProducts result:', result)
        
        if (result.success && result.data) {
          setProducts(result.data)
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((p) => p.type === activeTab)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">Our Beauty Collections</h1>
            <p className="text-muted-foreground text-lg">Explore our premium makeup, skincare, and fragrance collections</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-12 justify-center">
          {[
            { key: "makeup", label: "Makeup Collection" },
            { key: "skincare", label: "Skincare Collection" },
            { key: "fragrances", label: "Fragrance Collection" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "makeup" | "skincare" | "fragrances")}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.key ? "bg-primary text-white" : "bg-secondary/30 text-foreground hover:bg-secondary/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  type={product.type}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No {activeTab} products available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Check back soon for our latest beauty collection!</p>
              </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
