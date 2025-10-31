const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Please provide a product image URL"],
    },
    type: {
      type: String,
      enum: ["stitched", "unstitched", "seasonal"],
      required: [true, "Please specify product type"],
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    sizes: {
      type: [String],
      default: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    colors: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Product", productSchema)
