const express = require("express")
const router = express.Router()
const Collection = require("../models/Collection")
const Product = require("../models/Product")

// Get all collections
router.get("/", async (req, res) => {
  try {
    const { type } = req.query
    const query = { active: true }

    if (type) query.type = type

    const collections = await Collection.find(query).populate("products").sort({ createdAt: -1 })

    res.json({
      success: true,
      count: collections.length,
      data: collections,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Get single collection
router.get("/:id", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate("products")

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      })
    }

    res.json({
      success: true,
      data: collection,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Create collection (Admin)
router.post("/", async (req, res) => {
  try {
    const collection = new Collection(req.body)
    await collection.save()

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      data: collection,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Update collection (Admin)
router.put("/:id", async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      })
    }

    res.json({
      success: true,
      message: "Collection updated successfully",
      data: collection,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Delete collection (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id)

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      })
    }

    res.json({
      success: true,
      message: "Collection deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

module.exports = router
