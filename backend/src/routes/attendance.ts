import { Router } from "express";
import { body } from "express-validator";
import {
  getAllAttendance,
  recordAttendance,
  getMyAttendance,
  getAllLeaveRequests,
  submitLeaveRequest,
  updateLeaveRequestStatus,
  getMyLeaveRequests,
} from "../controllers/attendanceController.js";
import { authMiddleware, adminOrWarden } from "../middleware/auth.js";

const router = Router();

// Attendance routes
router.get("/attendance/my", authMiddleware, getMyAttendance);
router.get("/attendance", authMiddleware, adminOrWarden, getAllAttendance);
router.post(
  "/attendance",
  authMiddleware,
  adminOrWarden,
  [
    body("studentId", "Student ID is required").notEmpty(),
    body("date", "Date is required").notEmpty(),
    body("status", "Valid status is required").isIn([
      "present",
      "absent",
      "leave",
    ]),
  ],
  recordAttendance,
);

// Leave request routes
router.get("/leaves/my", authMiddleware, getMyLeaveRequests);
router.post(
  "/leaves",
  authMiddleware,
  [
    body("fromDate", "From date is required").notEmpty(),
    body("toDate", "To date is required").notEmpty(),
    body("reason", "Reason is required").notEmpty(),
  ],
  submitLeaveRequest,
);
router.get("/leaves", authMiddleware, adminOrWarden, getAllLeaveRequests);
router.put(
  "/leaves/:id",
  authMiddleware,
  adminOrWarden,
  [
    body("status", "Valid status is required").isIn([
      "pending",
      "approved",
      "rejected",
    ]),
  ],
  updateLeaveRequestStatus,
);

export default router;
