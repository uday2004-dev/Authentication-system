import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

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

        return res.json({ success: true, message: "Register successfully" })



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
        return res.json({ success: true, message: "login successfully" })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

export const logOut = async (res, req) => {
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