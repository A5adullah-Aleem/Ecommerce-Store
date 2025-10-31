import { connectDB } from "@/lib/db"
import { Product } from "@/lib/models/Product"
import { Collection } from "@/lib/models/Collection"

const seedProducts = [
  {
    name: "Elegant Stitched Saree",
    description: "Beautiful hand-embroidered stitched saree with traditional patterns",
    price: 4999,
    image: "/elegant-stitched-saree.jpg",
    category: "women",
    collection: "Traditional",
    type: "stitched",
    inStock: true,
    sizes: ["Free Size"],
    colors: ["Red", "Blue", "Green"],
  },
  {
    name: "Premium Unstitched Fabric",
    description: "High-quality unstitched fabric perfect for custom tailoring",
    price: 2499,
    image: "/premium-unstitched-fabric.jpg",
    category: "women",
    collection: "Casual",
    type: "unstitched",
    inStock: true,
    sizes: ["2.5 Meters"],
    colors: ["Beige", "Cream", "White"],
  },
  {
    name: "Designer Stitched Suit",
    description: "Modern designer suit with intricate embroidery work",
    price: 5999,
    image: "/designer-stitched-suit.jpg",
    category: "women",
    collection: "Modern",
    type: "stitched",
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Maroon"],
  },
  {
    name: "Seasonal Unstitched Collection",
    description: "Latest seasonal fabric collection with modern prints",
    price: 1999,
    image: "/seasonal-unstitched-collection.jpg",
    category: "women",
    collection: "Seasonal",
    type: "unstitched",
    inStock: true,
    sizes: ["2.5 Meters"],
    colors: ["Pink", "Purple", "Orange"],
  },
  {
    name: "Classic Stitched Dress",
    description: "Timeless classic dress perfect for any occasion",
    price: 3499,
    image: "/classic-stitched-dress.jpg",
    category: "women",
    collection: "Traditional",
    type: "stitched",
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Gold", "Silver", "Bronze"],
  },
  {
    name: "Luxury Unstitched Silk",
    description: "Premium silk fabric for special occasions",
    price: 6999,
    image: "/luxury-unstitched-silk.jpg",
    category: "women",
    collection: "Premium",
    type: "unstitched",
    inStock: true,
    sizes: ["2.5 Meters"],
    colors: ["Emerald", "Sapphire", "Ruby"],
  },
]

const seedCollections = [
  {
    name: "Traditional Collection",
    description: "Timeless traditional designs with classic patterns",
    image: "/traditional-collection.jpg",
    type: "stitched",
    productCount: 2,
  },
  {
    name: "Casual Collection",
    description: "Comfortable and stylish casual wear",
    image: "/casual-collection.jpg",
    type: "unstitched",
    productCount: 1,
  },
  {
    name: "Modern Collection",
    description: "Contemporary designs for the modern woman",
    image: "/modern-collection.jpg",
    type: "stitched",
    productCount: 1,
  },
  {
    name: "Seasonal Collection",
    description: "Latest seasonal trends and patterns",
    image: "/seasonal-collection.jpg",
    type: "unstitched",
    productCount: 1,
  },
  {
    name: "Premium Collection",
    description: "Luxury fabrics and exclusive designs",
    image: "/premium-collection.jpg",
    type: "unstitched",
    productCount: 1,
  },
]

async function seed() {
  try {
    await connectDB()
    console.log("[v0] Connected to MongoDB")

    // Clear existing data
    await Product.deleteMany({})
    await Collection.deleteMany({})
    console.log("[v0] Cleared existing data")

    // Seed collections
    const collections = await Collection.insertMany(seedCollections)
    console.log(`[v0] Seeded ${collections.length} collections`)

    // Seed products
    const products = await Product.insertMany(seedProducts)
    console.log(`[v0] Seeded ${products.length} products`)

    console.log("[v0] Seed completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("[v0] Seed error:", error)
    process.exit(1)
  }
}

seed()
