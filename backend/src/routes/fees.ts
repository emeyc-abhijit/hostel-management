import { Router } from "express";
import { body } from "express-validator";
import {
  getAllFees,
  getFeeById,
  createFeeRecord,
  updateFeeStatus,
  getMyFees,
  deleteFeeRecord,
} from "../controllers/feeController.js";
import { authMiddleware, adminOrWarden } from "../middleware/auth.js";

const router = Router();

router.get("/my", authMiddleware, getMyFees);
router.get("/", authMiddleware, adminOrWarden, getAllFees);
router.post(
  "/",
  authMiddleware,
  adminOrWarden,
  [
    body("studentId", "Student ID is required").notEmpty(),
    body("semester", "Semester is required").notEmpty(),
    body("amount", "Amount is required").isFloat({ min: 0 }),
    body("dueDate", "Due date is required").notEmpty(),
  ],
  createFeeRecord,
);
router.get("/:id", authMiddleware, getFeeById);
router.put(
  "/:id",
  authMiddleware,
  [
    body("status", "Valid status is required").isIn([
      "pending",
      "paid",
      "overdue",
    ]),
  ],
  updateFeeStatus,
);
router.delete("/:id", authMiddleware, adminOrWarden, deleteFeeRecord);

export default router;
