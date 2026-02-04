import { Response } from "express";
import Complaint from "../models/Complaint.js";
import Student from "../models/Student.js";
import {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
} from "../utils/response.js";
import { AuthRequest } from "../middleware/auth.js";

export const getAllComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find()
      .populate("studentId", "name email")
      .populate("assignedTo", "name email")
      .skip(skip)
      .limit(limit);

    const total = await Complaint.countDocuments();

    return sendPaginatedResponse(
      res,
      "Complaints retrieved",
      complaints,
      total,
      page,
      limit,
    );
  } catch (error: any) {
    console.error("Get complaints error:", error);
    return sendError(res, "Failed to get complaints", error.message, 500);
  }
};

export const getComplaintById = async (req: AuthRequest, res: Response) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("studentId", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return sendError(res, "Complaint not found", undefined, 404);
    }

    return sendSuccess(res, "Complaint retrieved", complaint);
  } catch (error: any) {
    console.error("Get complaint error:", error);
    return sendError(res, "Failed to get complaint", error.message, 500);
  }
};

export const createComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    if (!student) {
      return sendError(res, "Student profile not found", undefined, 404);
    }

    const { category, subject, description, priority } = req.body;

    const complaint = new Complaint({
      studentId: student._id,
      studentName: student.name,
      roomNumber: student.roomId ? `Room ${student.roomId}` : "N/A",
      category,
      subject,
      description,
      priority: priority || "medium",
      status: "open",
    });

    await complaint.save();
    await complaint.populate("studentId", "name email");

    return sendSuccess(res, "Complaint created", complaint, 201);
  } catch (error: any) {
    console.error("Create complaint error:", error);
    return sendError(res, "Failed to create complaint", error.message, 500);
  }
};

export const updateComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const allowedUpdates = ["status", "priority", "assignedTo", "notes"];
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    if (updates.status === "resolved" || updates.status === "closed") {
      updates.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
      },
    )
      .populate("studentId", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return sendError(res, "Complaint not found", undefined, 404);
    }

    return sendSuccess(res, "Complaint updated", complaint);
  } catch (error: any) {
    console.error("Update complaint error:", error);
    return sendError(res, "Failed to update complaint", error.message, 500);
  }
};

export const getMyComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    if (!student) {
      return sendError(res, "Student profile not found", undefined, 404);
    }

    const complaints = await Complaint.find({ studentId: student._id })
      .populate("studentId", "name email")
      .populate("assignedTo", "name email");

    return sendSuccess(res, "Complaints retrieved", complaints);
  } catch (error: any) {
    console.error("Get my complaints error:", error);
    return sendError(res, "Failed to get complaints", error.message, 500);
  }
};

export const deleteComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return sendError(res, "Complaint not found", undefined, 404);
    }

    return sendSuccess(res, "Complaint deleted");
  } catch (error: any) {
    console.error("Delete complaint error:", error);
    return sendError(res, "Failed to delete complaint", error.message, 500);
  }
};
