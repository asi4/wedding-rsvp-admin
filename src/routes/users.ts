import express from "express";
import { getAllUsers, updateUserStatus, deleteUser } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/verifyToken.js";
import {uploadFromGoogleSheet, uploadSpreadsheet} from "../controllers/csvController.js";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.get("/", authenticateToken, getAllUsers);
router.put("/:id", authenticateToken, updateUserStatus);
router.delete("/:id", authenticateToken, deleteUser);
router.post("/:id/upload", authenticateToken, upload.single("csv"), uploadSpreadsheet);
router.post("/:id/sheet", authenticateToken, uploadFromGoogleSheet);


export default router;