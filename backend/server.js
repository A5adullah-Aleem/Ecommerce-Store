const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") })

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  }
}

// Connect to MongoDB
connectDB()

// Import Routes
const productRoutes = require("./routes/products")
const collectionRoutes = require("./routes/collections")
const orderRoutes = require("./routes/orders")
const contactRoutes = require("./routes/contact")
const authRoutes = require("./routes/auth")

// Test Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "✅ Backend is running and connected to MongoDB!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use("/api/products", productRoutes)
app.use("/api/collections", collectionRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/auth", authRoutes)

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
})

module.exports = app
