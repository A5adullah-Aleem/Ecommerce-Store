const express = require("express")
const router = express.Router()
const Order = require("../models/Order")

// Get all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const { status, paymentStatus } = req.query
    const query = {}

    if (status) query.status = status
    if (paymentStatus) query.paymentStatus = paymentStatus

    const orders = await Order.find(query).populate("items.product", "name price image").sort({ createdAt: -1 })

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name price image")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Create order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Update order status (Admin)
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(
      "items.product",
      "name price image",
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      data: order,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Delete order (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

module.exports = router
