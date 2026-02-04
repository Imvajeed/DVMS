import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: false }
)

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    items: [cartItemSchema],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
)

// Auto-delete cart after expiry
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model("Cart", cartSchema)
