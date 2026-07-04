import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}

const config = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
}

export default config