import express from "express";
import productRouter from "./routers/products.js";
import connectDb from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

connectDb();
app.use("/products",productRouter);



app.listen(4003,()=>{
    console.log("Product server started on the port 4003");
})