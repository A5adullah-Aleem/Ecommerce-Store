const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      })
    }

    const admin = await Admin.findOne({ username }).select("+password")

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const isPasswordMatch = await admin.matchPassword(password)

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Admin Register (Protected - only for initial setup)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    })

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      })
    }

    const admin = new Admin({
      username,
      email,
      password,
    })

    await admin.save()

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

module.exports = router
