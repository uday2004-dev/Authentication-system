import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import transporter from "../config/nodeMailer.js"
// import userId from "../middleware/userAuth.js"

export const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {

        return res.json({
            success: false,
            message: "Missing Details"
        })
    }
    try {


        const existingUser = await userModel.findOne({
            email
        })

        if (existingUser) {
            return res.json({ success: false, message: "User alredy exits" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)


        const user = new userModel({
            name, email, password: hashedPassword
        })

        await user.save()

        const token = jwt.sign({
            id: user._id
        },
            process.env.JWT_SEC,
            {
                expiresIn: "7d"
            }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000

        })

        // Welcome Mail
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Site",
            text: `Welcome to our Site Your are account has been successfully created with the email id ${email}`
        }

        await transporter.sendMail(mailOption)
        return res.json({
            success: true,
            message: "Register successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })



    }
    catch (err) {
        res.json({
            success: false,
            message: err.message,

        })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.json({ success: false, message: "email and password are required" })
    }


    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "please enter email or valid email" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "please enter valid password" })


        }

        const token = jwt.sign({
            id: user._id
        },
            process.env.JWT_SEC,
            {
                expiresIn: "7d"
            }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000

        })
        return res.json(
            {
                success: true,
                message: "login successfully"


            })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

export const logOut = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',

        })
        return res.json({ success: true, message: "logout successfully " })
    } catch (err) {
        return register.json({ success: false, message: err.message })
    }

}


export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.isVerified) {
            return res.json({ success: false, message: "Account already verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOTP = otp
        user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account verification OTP",
            text: `Your OTP is ${otp}`
        }

        await transporter.sendMail(mailOption)

        res.json({ success: true, message: "OTP sent" })

    } catch (err) {
        res.json({ success: false, message: err.message })
    }
}

export const verifyEmail = async (req, res) => {
    // const { userId, otp } = req.userId
    const userId = req.userId
    const { otp } = req.body
    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing Detailss" })
    }
    try {

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }
        if (user.verifyOTP === '' || user.verifyOTP !== otp) {
            return res.json({ success: false, message: "Invalid otp" })

        }

        if (user.verifyOTPExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" })
        }

        user.isVerified = true;
        await user.save()

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }



}


export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true })

    } catch (err) {
        return res.json({ message: false, message: err.message })

    }

}


export const sendResetOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: "Provide email first" })
    }
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOTP = otp
        user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}`
        }

        await transporter.sendMail(mailOption)

        res.json({ success: true, message: "OTP sent" })

    } catch (err) {
        return res.json({ success: false, message: err.message })

    }

}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email OTP and new password are required" })
    }

    try {

        const user = await userModel.findOne({ email })
        if (!user) {
            res.json({ success: false, message: "User not found" })
        }
        if (user.resetOTP === "" || user.resetOTP) {
            res.json({ success: false, message: "Invalid OTP" })
        }

        if (user.resetOTPExpireAt < Date.now()) {
            res.json({ success: false, message: "OTP is Expired" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        user.resetOTP = ""
        user.resetOTPExpireAt = 0

        await user.save()

        res.json({success:true,message:"New password has been changed successfully"})
    } catch (err) {
        res.json({ success: false, message: err.message })
    }

}