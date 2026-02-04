import { Router } from "express";
import { body } from "express-validator";
import {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController.js";
import { authMiddleware, adminOrWarden } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, getAllNotices);
router.post(
  "/",
  authMiddleware,
  adminOrWarden,
  [
    body("title", "Title is required").notEmpty(),
    body("content", "Content is required").notEmpty(),
    body("category", "Valid category is required").isIn([
      "general",
      "urgent",
      "event",
      "maintenance",
    ]),
    body("targetAudience", "Valid audience is required").isIn([
      "all",
      "boys",
      "girls",
      "specific",
    ]),
  ],
  createNotice,
);
router.get("/:id", authMiddleware, getNoticeById);
router.put("/:id", authMiddleware, adminOrWarden, updateNotice);
router.delete("/:id", authMiddleware, adminOrWarden, deleteNotice);

export default router;
