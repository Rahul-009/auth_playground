import jwt from "jsonwebtoken";
import config from "../config/config.js";
import bcrypt from "bcrypt"
import crypto from "crypto";

import userModel from "../models/user.model.js"


export async function register(req, res){
    const {username, email, password} = req.body

    // Input validation
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Username, email, and password are required"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });
    }

    // is already registered ?
    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username }, 
            { email }
        ]
    })

    if (isAlreadyRegistered) {
        return res.status(409).json({
            message: "Username or email already exists"
        })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        },
    })
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate tokens
        const refreshToken = jwt.sign(
            { id: user._id },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const accessToken = jwt.sign(
            { id: user._id },
            config.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Set cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "Logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            accessToken,
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: "Internal server error during login"
        });
    }
}

export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
        
        const accessToken = jwt.sign(
            {id: decoded.id}, 
            config.JWT_SECRET,
            {expiresIn: "15m"}
        )

        const newRefreshToken = jwt.sign(
            {id: decoded.id}, 
            config.JWT_SECRET,
            {expiresIn: "7d"}
        )

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        })
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired refresh token"
        })
    }
}

export async function getMe(req, res){
    const token = req.headers.authorization?.split(" ")[1]

    if(!token) {
        return res.status(401).json({
            message: "token not found"
        })
    }

    // Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired access token"
        });
    }
    const user = await userModel.findById(decoded.id)

    res.status(200).json({
        message: "user fetched successfully",
        user: {
            username: user.username,
            email: user.email
        }
    })
}