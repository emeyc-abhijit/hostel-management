import { Router } from "express";
import { body } from "express-validator";
import {
  getAllHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
} from "../controllers/hostelController.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, getAllHostels);
router.post(
  "/",
  authMiddleware,
  adminOnly,
  [
    body("name", "Name is required").notEmpty(),
    body("type", "Type must be boys or girls").isIn(["boys", "girls"]),
    body("totalRooms", "Total rooms is required").isInt(),
    body("capacity", "Capacity is required").isInt(),
    body("address", "Address is required").notEmpty(),
  ],
  createHostel,
);
router.get("/:id", authMiddleware, getHostelById);
router.put("/:id", authMiddleware, adminOnly, updateHostel);
router.delete("/:id", authMiddleware, adminOnly, deleteHostel);

export default router;
