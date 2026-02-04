import { Response } from "express";
import Notice from "../models/Notice.js";
import {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
} from "../utils/response.js";
import { AuthRequest } from "../middleware/auth.js";

export const getAllNotices = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const notices = await Notice.find()
      .populate("postedBy", "name")
      .populate("targetHostel", "name")
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notice.countDocuments();

    return sendPaginatedResponse(
      res,
      "Notices retrieved",
      notices,
      total,
      page,
      limit,
    );
  } catch (error: any) {
    console.error("Get notices error:", error);
    return sendError(res, "Failed to get notices", error.message, 500);
  }
};

export const getNoticeById = async (req: AuthRequest, res: Response) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate("postedBy", "name")
      .populate("targetHostel", "name");

    if (!notice) {
      return sendError(res, "Notice not found", undefined, 404);
    }

    return sendSuccess(res, "Notice retrieved", notice);
  } catch (error: any) {
    console.error("Get notice error:", error);
    return sendError(res, "Failed to get notice", error.message, 500);
  }
};

export const createNotice = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category, targetAudience, targetHostel } = req.body;

    const notice = new Notice({
      title,
      content,
      category,
      targetAudience: targetAudience || "all",
      targetHostel,
      postedBy: req.userId,
      postedAt: new Date(),
    });

    await notice.save();
    const populatedNotice = await Notice.findById(notice._id)
      .populate("postedBy", "name")
      .populate("targetHostel", "name");

    return sendSuccess(res, "Notice created", populatedNotice, 201);
  } catch (error: any) {
    console.error("Create notice error:", error);
    return sendError(res, "Failed to create notice", error.message, 500);
  }
};

export const updateNotice = async (req: AuthRequest, res: Response) => {
  try {
    const allowedUpdates = [
      "title",
      "content",
      "category",
      "targetAudience",
      "targetHostel",
    ];
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const notice = await Notice.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    })
      .populate("postedBy", "name")
      .populate("targetHostel", "name");

    if (!notice) {
      return sendError(res, "Notice not found", undefined, 404);
    }

    return sendSuccess(res, "Notice updated", notice);
  } catch (error: any) {
    console.error("Update notice error:", error);
    return sendError(res, "Failed to update notice", error.message, 500);
  }
};

export const deleteNotice = async (req: AuthRequest, res: Response) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return sendError(res, "Notice not found", undefined, 404);
    }

    return sendSuccess(res, "Notice deleted");
  } catch (error: any) {
    console.error("Delete notice error:", error);
    return sendError(res, "Failed to delete notice", error.message, 500);
  }
};
