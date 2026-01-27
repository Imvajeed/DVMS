import mongoose from "mongoose"

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: String,          // from Auth Service
      required: true,
      unique: true,
      index: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "FROZEN"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model("Account", accountSchema)
