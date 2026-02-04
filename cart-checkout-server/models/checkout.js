import mongoose from "mongoose"

const checkoutSchema = new mongoose.Schema({
  checkoutId: { type: String, unique: true },
  userId: String,
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    default: "PENDING"
  },
  totalAmount: Number
})

export default mongoose.model("Checkout", checkoutSchema)
