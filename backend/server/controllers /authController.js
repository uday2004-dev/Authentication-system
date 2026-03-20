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
                expiresIn:"7d"
            }
        )

        res.cookie


    }
    catch (err) {
        res.json({
            success: false,
            message: err.message,

        })
    }

}