import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbconnect.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
dotenv.config();

dbConnect();

//middleware
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

//routes

//server
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
