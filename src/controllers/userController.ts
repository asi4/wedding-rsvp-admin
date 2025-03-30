import {RequestHandler} from "express";
import User from "../models/User.js";

// Get all users
export const getAllUsers: RequestHandler = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Don't return password
        res.json(users); // ✅ No `return` needed
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve users." });
    }
};

// Delete a user by ID
export const deleteUser: RequestHandler = async (req, res) => {
    try {
        const userId: string = req.params.id;
        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user." });
    }
};