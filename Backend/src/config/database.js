import mongoose from "mongoose"

export default async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB ✅")
    } catch (error) {
        console.error("Failed to connect to MongoDB ❌", error)
    }
}