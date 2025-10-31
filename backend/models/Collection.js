const mongoose = require("mongoose")

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a collection name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a collection description"],
    },
    type: {
      type: String,
      enum: ["stitched", "unstitched", "seasonal"],
      required: true,
    },
    image: {
      type: String,
      required: [true, "Please provide a collection image URL"],
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Collection", collectionSchema)
