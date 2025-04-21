import express from "express";
import { getAllUsers, updateUserStatus, deleteUser } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/users", authenticateToken, getAllUsers);
router.put("/:id", authenticateToken, updateUserStatus);
router.delete("/:id", authenticateToken, deleteUser);

export default router;