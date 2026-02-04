import { Response } from "express";
import Hostel from "../models/Hostel.js";
import {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
} from "../utils/response.js";
import { AuthRequest } from "../middleware/auth.js";

export const getAllHostels = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const hostels = await Hostel.find()
      .populate("wardenId", "name email phone")
      .skip(skip)
      .limit(limit);

    const total = await Hostel.countDocuments();

    return sendPaginatedResponse(
      res,
      "Hostels retrieved",
      hostels,
      total,
      page,
      limit,
    );
  } catch (error: any) {
    console.error("Get hostels error:", error);
    return sendError(res, "Failed to get hostels", error.message, 500);
  }
};

export const getHostelById = async (req: AuthRequest, res: Response) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate(
      "wardenId",
      "name email phone",
    );

    if (!hostel) {
      return sendError(res, "Hostel not found", undefined, 404);
    }

    return sendSuccess(res, "Hostel retrieved", hostel);
  } catch (error: any) {
    console.error("Get hostel error:", error);
    return sendError(res, "Failed to get hostel", error.message, 500);
  }
};

export const createHostel = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, totalRooms, capacity, wardenId, address } = req.body;

    const hostel = new Hostel({
      name,
      type,
      totalRooms,
      capacity,
      wardenId,
      address,
      occupiedRooms: 0,
      currentOccupancy: 0,
    });

    await hostel.save();
    await hostel.populate("wardenId", "name email phone");

    return sendSuccess(res, "Hostel created", hostel, 201);
  } catch (error: any) {
    console.error("Create hostel error:", error);
    return sendError(res, "Failed to create hostel", error.message, 500);
  }
};

export const updateHostel = async (req: AuthRequest, res: Response) => {
  try {
    const allowedUpdates = [
      "name",
      "type",
      "totalRooms",
      "capacity",
      "wardenId",
      "address",
    ];
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const hostel = await Hostel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate("wardenId", "name email phone");

    if (!hostel) {
      return sendError(res, "Hostel not found", undefined, 404);
    }

    return sendSuccess(res, "Hostel updated", hostel);
  } catch (error: any) {
    console.error("Update hostel error:", error);
    return sendError(res, "Failed to update hostel", error.message, 500);
  }
};

export const deleteHostel = async (req: AuthRequest, res: Response) => {
  try {
    const hostel = await Hostel.findByIdAndDelete(req.params.id);

    if (!hostel) {
      return sendError(res, "Hostel not found", undefined, 404);
    }

    return sendSuccess(res, "Hostel deleted");
  } catch (error: any) {
    console.error("Delete hostel error:", error);
    return sendError(res, "Failed to delete hostel", error.message, 500);
  }
};
