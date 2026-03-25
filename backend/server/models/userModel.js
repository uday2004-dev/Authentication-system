// import { verify } from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        unique: true,
    },
    verifyOTP: {
        type: String,
        default: "",
    },
    verifyOTPExpireAt: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetOTP: {
        type: String,
        default: "",
    },
    resetOTPExpireAt: {
        type: String,
        default: 0,
    }
})

const userModel=mongoose.models.user||   mongoose.model("user",userSchema )


export default userModel;