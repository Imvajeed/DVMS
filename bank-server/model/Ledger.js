import mongoose from "mongoose"

const ledgerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    referenceType: {
      type: String,
      enum: [
        "USER_CREATED",
        "TRANSFER",
        "PURCHASE",
        "REFUND",
        "ADJUSTMENT",
        "SELL"
      ],
      required: true
    },

    referenceId: {
      type: String
      // e.g. otherUserId, productId, orderId
    },

    metadata: {
      type: Object
      // optional: order info, notes, admin reason
    }
  },
  {
    timestamps: true
  }
)

// IMPORTANT: Ledger is IMMUTABLE
ledgerSchema.pre("save", function () {
  if (!this.isNew) {
    throw new Error("Ledger entries are immutable");
  }
});

export default mongoose.model("Ledger", ledgerSchema)
