import mongoose from "mongoose";
import crypto from 'crypto';

const dbConnect = async () => {    
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log(`MongoDB connected: ${connect.connection.host}, ${connect.connection.name}`)
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`)
        process.exit(1);
    }
}

export default dbConnect;
