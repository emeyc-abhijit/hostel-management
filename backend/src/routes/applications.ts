import { Router } from "express";
import { body } from "express-validator";
import {
  getAllApplications,
  getApplicationById,
  submitApplication,
  updateApplicationStatus,
  getMyApplication,
} from "../controllers/applicationController.js";
import { authMiddleware, adminOrWarden } from "../middleware/auth.js";

const router = Router();

router.get("/my", authMiddleware, getMyApplication);
router.post(
  "/",
  authMiddleware,
  [body("preferredHostel").optional().notEmpty()],
  submitApplication,
);

// Admin/Warden routes
router.get("/", authMiddleware, adminOrWarden, getAllApplications);
router.get("/:id", authMiddleware, adminOrWarden, getApplicationById);
router.put(
  "/:id",
  authMiddleware,
  adminOrWarden,
  [
    body("status", "Valid status is required").isIn([
      "pending",
      "approved",
      "rejected",
    ]),
  ],
  updateApplicationStatus,
);

export default router;
