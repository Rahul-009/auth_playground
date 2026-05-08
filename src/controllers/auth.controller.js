import jwt from "jsonwebtoken";
import config from "../config/config.js";
import bcrypt from "bcrypt"

import userModel from "../models/user.model.js"
// import sessionModel from "../models/session.model.js";
import otpModel from "../models/otp.model.js";



export async function register(req, res){
    const {username, email, password} = req.body

    // is already registered ?
    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username }, 
            { email }
        ]
    })

    if (isAlreadyRegistered) {
        res.status(409).json({
            message: "Username or email already exists"
        })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    // implement OTP here

    res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        },
    })
}

export async function refreshToken(req, res){
    
}

export async function login(req, res){
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    // const refreshToken = jwt.sign({
    //     id: user._id
    // }, config.JWT_SECRET,
    //     {
    //         expiresIn: "7d"
    //     }
    // )

    // const refreshToken = bcrypt.hash(refreshToken, )

    const accessToken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )

    // res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict",
    //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // })

    res.status(200).json({
        message: "Logged in successfully",
        user: {
            username: user.username,
            email: user.email,
        },
        accessToken,
    })


}

export async function logout(req, res){

}

export async function logoutAll(req, res){

}

export async function getMe(req, res){
    const token = req.headers.authorization?.split(" ")[1];

    if(!token) {
        return res.status(401).json({
            message: "token not found"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)

    const user = await userModel.findById(decoded.id)

    res.status(200).json({
        message: "user fetched successfully",
        user: {
            username: user.username,
            email: user.email
        }
    })
}

export async function verifyEmail(req, res){

}
