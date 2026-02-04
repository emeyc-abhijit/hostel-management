import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Register route
router.post(
  "/register",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    body("role", "Invalid role").isIn(["admin", "warden", "student"]),
  ],
  register,
);

// Login route
router.post(
  "/login",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password is required").notEmpty(),
    body("role", "Invalid role").isIn(["admin", "warden", "student"]),
  ],
  login,
);

// Protected routes
router.get("/me", authMiddleware, getCurrentUser);
router.put(
  "/profile",
  authMiddleware,
  [
    body("name").optional().notEmpty(),
    body("phone").optional().isMobilePhone("any"),
  ],
  updateProfile,
);
router.post(
  "/change-password",
  authMiddleware,
  [
    body("currentPassword", "Current password is required").notEmpty(),
    body("newPassword", "New password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  changePassword,
);

export default router;
