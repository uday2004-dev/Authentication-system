import express from "express"
import { login, logOut, register, sendVerifyOtp } from "../controllers /authController.js"
import userAuth from "../middleware/userAuth.js"
const authRouter=express.Router()

authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.post("/logout",logOut)
authRouter.post("/sendverifyOTP",userAuth,sendVerifyOtp)

export default authRouter