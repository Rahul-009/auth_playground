import { Schema, model } from "mongoose"

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"]
    },
    email: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String,
        required: [true, "password must be unique"]
    },
    verified: {
        type: Boolean,
        default: false
    }
}) 

const userModel = model("user", userSchema)
export default userModel;