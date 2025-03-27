import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

// POST /signup
router.post("/signup", async (req, res): Promise<any> => {
    const { firstName, lastName, email, password } = req.body;

    // 1. Password validation
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    try {
        // 2. Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with that email." });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Save new user
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();

        // 5. Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "2h" }
        );

        // 6. Send back token + user info
        res.status(201).json({
            message: "Signup successful",
            token,
            user: {
                firstName: user.name,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error: any) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error during signup" });
    }
});

export default router;
