import { Router } from "express";
import { body } from "express-validator";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { authMiddleware, adminOrWarden } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, getAllRooms);
router.post(
  "/",
  authMiddleware,
  adminOrWarden,
  [
    body("hostelId", "Hostel ID is required").notEmpty(),
    body("roomNumber", "Room number is required").notEmpty(),
    body("floor", "Floor is required").isInt(),
    body("capacity", "Capacity is required").isInt(),
    body("type", "Type is required").isIn(["single", "double", "triple"]),
  ],
  createRoom,
);
router.get("/:id", authMiddleware, getRoomById);
router.put("/:id", authMiddleware, adminOrWarden, updateRoom);
router.delete("/:id", authMiddleware, adminOrWarden, deleteRoom);

export default router;
