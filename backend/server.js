import express from "express"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"
import { connect } from "mongoose"
import connectDB from "./server/config/mongoDB.js"
import authRouter from "./server/routes/authRoutes.js"


const app = express()


const port = process.env.PORT || 4000
connectDB()

app.use(express.json())

app.use(cookieParser())
app.use(cors({ credentials: true }))

// //API endpoints
app.get("/", (req, res) => {
    res.send("You are on Home page")
})
app.use('/api/auth', authRouter)





app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

