import express from "express";
import { getAllUsers, deleteUser } from "../controllers/userController.js";
import {authenticateToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", authenticateToken, getAllUsers);
router.delete("/:id", authenticateToken, deleteUser);

export default router;