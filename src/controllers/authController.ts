import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { Request, Response } from "express";
import {nanoid} from "nanoid";

const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key";

export const signup = async (req: Request, res: Response): Promise<any> => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with that email." });
        }

        // Hash the password
        const hashedPassword: string = await bcrypt.hash(password, 10);

        // Save user
        const user = new User({ firstName, lastName, email, password: hashedPassword, isActive: false, role: "user" });
        await user.save();

        // Create token
        const token: string = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "2h" }
        );

        return res.status(201).json({
            message: "Signup successful",
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: "user"
            }
        });
    } catch (error: any) {
        console.error("Signup error:", error);
        console.error("Signup full:", error.error);
        return res.status(500).json({ message: "Server error during signup" });
    }
};


export async function login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email doesn't exist" });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ message: "You are not approved yet." });
        }

        const isMatch: boolean = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token: string = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}