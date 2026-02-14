import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cartRoutes from "./routers/cart.js";
import checkoutRoutes from "./routers/checkout.js";

dotenv.config();

const app = express();
app.use(express.json());

/* ---------------- DB CONNECTION ---------------- */

const connectDB = async () => {
  try {
    const mongoURL =
      process.env.MONGO_URL || "mongodb://mongo:27017/cart-server";

    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Cart-Checkout Service DB Connected");
  } catch (err) {
    console.log("❌ MongoDB not ready, retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

/* ---------------- ROUTES ---------------- */

app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "Checkout service running" });
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Cart-Checkout Server running on port ${PORT}`);
});
