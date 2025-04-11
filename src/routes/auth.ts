import express from "express";
import signupRoute from "./signup.js";
import loginRoute from "./login.js";

const router = express.Router();

// Combine signup and login under /api/auth
router.use("/", signupRoute);
router.use("/", loginRoute);

export default router;