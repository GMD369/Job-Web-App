import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js"
import profileRoutes from "./routes/profileRoutes.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js"

dotenv.config()

const app=express()

app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Your React app's origin
    credentials: true,               // ✅ Allow token/cookies
  })
);

mongoose.connect(process.env.MONGO_URI,{
    // useNewUrlParser:true,
    // useUnifiedTopology:true
    }).then(() =>{
        console.log("Connected to MongoDB")
    }
).catch((err)=>{
    console.log(err)
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:`+ PORT)
})

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);


app.use("/api/profile", profileRoutes); // Serve uploaded files



app.use("/api/admin", adminRoutes);

app.use("/api/user",userRoutes)