import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://mongo:27017/nexatalk");
        console.log("Mongodb Connected");
    }catch(error){
        console.error("Mongodb connection failed",error);
        process.exit(1);
    }
};