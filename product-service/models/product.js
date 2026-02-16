import mongoose from "mongoose"

console.log("Compiling Product model...")


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 1 // credits
    },

    sellerId: {
      type: String, // userId from Auth Service
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);

