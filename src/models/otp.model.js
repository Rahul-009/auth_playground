import {Schema,model} from "mongoose"

const otpSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    optHash: {
        type: String,
        required: [true, "OTP is required"]
    }
},{
    timestamps: true
})

const otpModel = model("otps", otpSchema)
export default otpModel;