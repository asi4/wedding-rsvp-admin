import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import signupRoute from './routes/signup';
import loginRoute from './routes/login';

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use('/api', signupRoute);
app.use('/api', loginRoute);

const MONGO_URI: string = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("Missing Mongo URI");

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Admin connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes (to be added)
app.use("/auth", require("./routes/auth"));   // Admin signup/login
app.use("/users", require("./routes/users")); // User CRUD

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Admin Server running on ${PORT}`));