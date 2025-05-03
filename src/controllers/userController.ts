import {Request, Response} from "express";
import User from "../models/User.js";

interface AuthRequest extends Request {
    user?: { _id: string; role: string };
}

// Get all users
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { _id, role } = req.user;
        console.log("Fetched user from token:", _id, role);

        if (role === "admin") {
            const users = await User.find().select("-password -__v -createdAt -csvData"); // Don't return passwords
            res.status(200).json(users);
        } else {
            const currentUser = await User.findById(_id).select("-password -__v -createdAt -csvData");
            if (!currentUser) {
                console.warn("No user found for ID:", _id);
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json([currentUser]); // Send as array to keep frontend logic the same
            }
        }
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User status updated", user: updatedUser });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Server error" });
    }
};