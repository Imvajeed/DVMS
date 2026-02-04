import mongoose from "mongoose";

const connectDb = async ()=>{
    mongoose.connect("mongodb://localhost:27017/product-server").then(()=>{
        console.log("Database connected");
    }).catch(e=>{
        console.log("Database is not connected : ");
        console.log(e);
    })
}

export default connectDb;