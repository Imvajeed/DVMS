import express from "express";
import productRouter from "./routers/products.js";
import connectDb from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

connectDb();
app.use("/products",productRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
