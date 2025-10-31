const express = require("express")
const router = express.Router()
const Product = require("../models/Product")

// Get all products
router.get("/", async (req, res) => {
  try {
    const { type, collection, featured } = req.query
    const query = { active: true }

    if (type) query.type = type
    if (collection) query.collection = collection
    if (featured === "true") query.featured = true

    const products = await Product.find(query).populate("collection", "name").sort({ createdAt: -1 })

    res.json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("collection", "name")

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Create product (Admin)
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Update product (Admin)
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Delete product (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

module.exports = router
