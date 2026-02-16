import express from "express";
import productRouter from "./routers/products.js";
import connectDb from "./db.js";
import dotenv from "dotenv";
import { startProductConsumer } from "./events/productConsumer.js";
import { connectRabbitMQ } from "./events/rabbitmq.js";

dotenv.config();

connectDb();
await connectRabbitMQ();
await startProductConsumer();

const app = express();
app.use(express.json());


app.use("/products",productRouter);



app.listen(4003,()=>{
    console.log("Product server started on the port 4003");
})