import express from "express";
import { signup } from "../controllers/authController.js";

const router = express.Router();

// Route for signup
router.post("/signup", signup);

export default router;