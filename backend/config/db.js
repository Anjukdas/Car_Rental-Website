import mongoose from "mongoose";

const connectDB =async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`db connected ${conn}`)

    }catch(err){
        console.log(err)
    }
}

export default connectDB