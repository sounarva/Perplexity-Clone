import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User"
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decodedToken.id).select("-password")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}