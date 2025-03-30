import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./routes/auth.js";
import users from "./routes/users.js";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use("/auth", auth);   // Admin login/signup
app.use("/users", users);  // Admin sees & deletes users

const MONGO_URI: string = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("Missing Mongo URI");

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Admin connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Admin Server running on ${PORT}`));