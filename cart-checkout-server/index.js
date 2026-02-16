import dotenv from "dotenv";
import express from "express"
import mongoose from "mongoose"
import cartRoutes from "./routers/cart.js"
import checkoutRoutes from "./routers/checkout.js"
import { connectRabbitMQ } from "./events/rabbitmq.js";
import { startCheckoutConsumers } from "./events/checkoutConsumer.js";
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
await connectRabbitMQ();
await startCheckoutConsumers();

const app = express()
app.use(express.json())

app.use("/cart", cartRoutes)
app.use("/checkout", checkoutRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "Checkout service running" })
})

app.listen(4005, () => {
  console.log("Checkout service running on port 4005")
})
