import { Response } from "express";
import Room from "../models/Room.js";
import {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
} from "../utils/response.js";
import { AuthRequest } from "../middleware/auth.js";

export const getAllRooms = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const hostelId = req.query.hostelId as string;

    const filter = hostelId ? { hostelId } : {};
    const rooms = await Room.find(filter)
      .populate("hostelId", "name type")
      .populate("students", "name email")
      .skip(skip)
      .limit(limit);

    const total = await Room.countDocuments(filter);

    return sendPaginatedResponse(
      res,
      "Rooms retrieved",
      rooms,
      total,
      page,
      limit,
    );
  } catch (error: any) {
    console.error("Get rooms error:", error);
    return sendError(res, "Failed to get rooms", error.message, 500);
  }
};

export const getRoomById = async (req: AuthRequest, res: Response) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("hostelId", "name type")
      .populate("students", "name email");

    if (!room) {
      return sendError(res, "Room not found", undefined, 404);
    }

    return sendSuccess(res, "Room retrieved", room);
  } catch (error: any) {
    console.error("Get room error:", error);
    return sendError(res, "Failed to get room", error.message, 500);
  }
};

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { hostelId, roomNumber, floor, capacity, type } = req.body;

    const room = new Room({
      hostelId,
      roomNumber,
      floor,
      capacity,
      type,
      occupied: 0,
      status: "available",
      students: [],
    });

    await room.save();
    await room.populate("hostelId", "name type");

    return sendSuccess(res, "Room created", room, 201);
  } catch (error: any) {
    console.error("Create room error:", error);
    return sendError(res, "Failed to create room", error.message, 500);
  }
};

export const updateRoom = async (req: AuthRequest, res: Response) => {
  try {
    const allowedUpdates = [
      "roomNumber",
      "floor",
      "capacity",
      "type",
      "status",
    ];
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const room = await Room.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    })
      .populate("hostelId", "name type")
      .populate("students", "name email");

    if (!room) {
      return sendError(res, "Room not found", undefined, 404);
    }

    return sendSuccess(res, "Room updated", room);
  } catch (error: any) {
    console.error("Update room error:", error);
    return sendError(res, "Failed to update room", error.message, 500);
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return sendError(res, "Room not found", undefined, 404);
    }

    return sendSuccess(res, "Room deleted");
  } catch (error: any) {
    console.error("Delete room error:", error);
    return sendError(res, "Failed to delete room", error.message, 500);
  }
};
