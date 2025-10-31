const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
    },
    subject: {
      type: String,
      required: [true, "Please provide a subject"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please provide a message"],
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
    reply: String,
  },
  { timestamps: true },
)

module.exports = mongoose.model("Contact", contactSchema)
