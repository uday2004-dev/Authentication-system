import jwt from "jsonwebtoken"

const userAuth = async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return res.json({ success: false, message: "Not Authorized" })
    }
    try {
        const decoded=jwt.verify(token,process.env.WT_SEC)
        if(decoded.id){
             req.body.userId=tokenDecoded.id
        }else{
            return res.json({success:false,message:"Not Authorized, Login Again"})
        }
        next()
    } catch (err) {
        res.json({ success: false, message: err.message })
    }
}

export default userAuth;