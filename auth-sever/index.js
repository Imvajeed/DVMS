import express from "express";
import connectDB from "./db.js";
import usersRouter from "./routers/users.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import profileRouter from "./routers/profile.js"
import resetPassword from './routers/resetPassword.js';
import dotenv from "dotenv";
import { connectRabbitMQ } from "./events/rabbitmq.js";

await connectRabbitMQ();

dotenv.config();

const app = express();
connectDB();
app.use(express.json());
app.use(cookieParser())


app.use('/users',usersRouter);
app.use('/profile',profileRouter);
app.use('/reset-password', resetPassword)


app.listen(4000,()=>{
    console.log("Auth Server Started on port number 4000")
})