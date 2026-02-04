import { Router } from "express";
import { body } from "express-validator";
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  getMyComplaints,
  deleteComplaint,
} from "../controllers/complaintController.js";
import { authMiddleware, adminOrWarden } from "../middleware/auth.js";

const router = Router();

router.get("/my", authMiddleware, getMyComplaints);
router.post(
  "/",
  authMiddleware,
  [
    body("category", "Valid category is required").isIn([
      "maintenance",
      "electrical",
      "plumbing",
      "cleanliness",
      "other",
    ]),
    body("subject", "Subject is required").notEmpty(),
    body("description", "Description is required").notEmpty(),
  ],
  createComplaint,
);

// Admin/Warden routes
router.get("/", authMiddleware, adminOrWarden, getAllComplaints);
router.get("/:id", authMiddleware, getComplaintById);
router.put("/:id", authMiddleware, adminOrWarden, updateComplaint);
router.delete("/:id", authMiddleware, adminOrWarden, deleteComplaint);

export default router;
