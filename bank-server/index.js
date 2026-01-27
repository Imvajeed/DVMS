import express from "express";
import bankRouter from "./routers/bank.js"


const app = express();


app.use('/bank',bankRouter);



app.listen(4001,()=>{
    console.log('server started on 4001');
})