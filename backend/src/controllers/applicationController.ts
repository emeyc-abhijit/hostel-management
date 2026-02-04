import { Response } from "express";
import Application from "../models/Application.js";
import Student from "../models/Student.js";
import {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
} from "../utils/response.js";
import { AuthRequest } from "../middleware/auth.js";

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const applications = await Application.find()
      .populate("studentId", "name email")
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments();

    return sendPaginatedResponse(
      res,
      "Applications retrieved",
      applications,
      total,
      page,
      limit,
    );
  } catch (error: any) {
    console.error("Get applications error:", error);
    return sendError(res, "Failed to get applications", error.message, 500);
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "studentId",
      "name email",
    );

    if (!application) {
      return sendError(res, "Application not found", undefined, 404);
    }

    return sendSuccess(res, "Application retrieved", application);
  } catch (error: any) {
    console.error("Get application error:", error);
    return sendError(res, "Failed to get application", error.message, 500);
  }
};

export const submitApplication = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    if (!student) {
      return sendError(res, "Student profile not found", undefined, 404);
    }

    const { preferredHostel } = req.body;

    const application = new Application({
      studentId: student._id,
      studentName: student.name,
      course: student.course,
      year: student.year,
      preferredHostel,
      status: "pending",
      appliedDate: new Date(),
    });

    await application.save();

    // Update student status
    student.status = "pending";
    await student.save();

    await application.populate("studentId", "name email");

    return sendSuccess(
      res,
      "Application submitted successfully",
      application,
      201,
    );
  } catch (error: any) {
    console.error("Submit application error:", error);
    return sendError(res, "Failed to submit application", error.message, 500);
  }
};

export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true },
    ).populate("studentId", "name email");

    if (!application) {
      return sendError(res, "Application not found", undefined, 404);
    }

    // Update student status
    if (application.studentId) {
      await Student.findByIdAndUpdate(application.studentId._id, { status });
    }

    return sendSuccess(res, "Application updated", application);
  } catch (error: any) {
    console.error("Update application error:", error);
    return sendError(res, "Failed to update application", error.message, 500);
  }
};

export const getMyApplication = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    if (!student) {
      return sendError(res, "Student profile not found", undefined, 404);
    }

    const application = await Application.findOne({
      studentId: student._id,
    }).populate("studentId", "name email");

    if (!application) {
      return sendError(res, "No application found", undefined, 404);
    }

    return sendSuccess(res, "Application retrieved", application);
  } catch (error: any) {
    console.error("Get my application error:", error);
    return sendError(res, "Failed to get application", error.message, 500);
  }
};
