import { Router } from "express";
import { body } from "express-validator";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  allocateRoom,
  getMyProfile,
} from "../controllers/studentController.js";
import { authMiddleware, adminOrWarden } from "../middleware/auth.js";

const router = Router();

// Public routes (require auth)
router.get("/me", authMiddleware, getMyProfile);

// Admin/Warden routes
router.get("/", authMiddleware, adminOrWarden, getAllStudents);
router.post(
  "/",
  authMiddleware,
  adminOrWarden,
  [
    body("userId", "User ID is required").notEmpty(),
    body("name", "Name is required").notEmpty(),
    body("email", "Valid email is required").isEmail(),
    body("phone", "Phone is required").notEmpty(),
    body("course", "Course is required").notEmpty(),
    body("year", "Year is required").isInt({ min: 1, max: 4 }),
    body("rollNumber", "Roll number is required").notEmpty(),
  ],
  createStudent,
);
router.get("/:id", authMiddleware, getStudentById);
router.put("/:id", authMiddleware, adminOrWarden, updateStudent);
router.delete("/:id", authMiddleware, adminOrWarden, deleteStudent);
router.post("/:id/allocate-room", authMiddleware, adminOrWarden, allocateRoom);

export default router;
