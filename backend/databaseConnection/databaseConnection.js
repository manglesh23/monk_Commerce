import mongoose  from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
export const connectDatabase=async()=>{
    try{
       await mongoose.connect(process.env.MONGO_URI)
       console.log("database connected")
    }catch(e){
        return{
            error:true,
            details:e
        }
    }
}