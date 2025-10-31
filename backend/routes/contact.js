const express = require("express")
const router = express.Router()
const Contact = require("../models/Contact")

// Get all contact messages (Admin)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query
    const query = {}

    if (status) query.status = status

    const messages = await Contact.find(query).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Get single message
router.get("/:id", async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id)

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    res.json({
      success: true,
      data: message,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Create contact message
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body)
    await contact.save()

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Update message status (Admin)
router.put("/:id", async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    res.json({
      success: true,
      message: "Message updated successfully",
      data: message,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Delete message (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id)

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

module.exports = router
