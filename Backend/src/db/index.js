import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
 
const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Mongodb Connected !!!`);
        console.log(`DB Host :- ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("MongoDB Connection Error :- ",error);
        process.exit(1); //Process is the reference to process on which the application is working
    }
}

export default connectDB