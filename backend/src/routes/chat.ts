import express from "express";
import { handleChat } from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Allow authenticated users to use the chatbot
router.post("/", authMiddleware, handleChat);

export default router;
