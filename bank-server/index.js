import express from "express";
import bankRouter from "./routers/bank.js"
import dotenv from "dotenv";
import { connectRabbitMQ } from "./events/rabbitmq.js"
import { startUserConsumer } from "./events/userConsumer.js"
import { startBankConsumer } from "./events/bank-consumer.js";
import connectDB from "./db.js";

connectDB();

await connectRabbitMQ();
await startUserConsumer();
await startBankConsumer();

dotenv.config();


const app = express();


app.use('/bank',bankRouter);



app.listen(4001,()=>{
    console.log('server started on 4001');
})