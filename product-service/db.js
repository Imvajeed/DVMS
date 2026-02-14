import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/product-server";

    await mongoose.connect(MONGO_URL);

    console.log("✅ Database connected");
  } catch (e) {
    console.log("❌ Database is not connected:");
    console.log(e);
    process.exit(1);
  }
};

export default connectDb;
