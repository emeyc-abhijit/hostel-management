import { Response } from "express";
import FeeRecord from "../models/FeeRecord.js";
import Student from "../models/Student.js";
import {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
} from "../utils/response.js";
import { AuthRequest } from "../middleware/auth.js";

export const getAllFees = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const fees = await FeeRecord.find()
      .populate("studentId", "name email")
      .skip(skip)
      .limit(limit);

    const total = await FeeRecord.countDocuments();

    return sendPaginatedResponse(
      res,
      "Fees retrieved",
      fees,
      total,
      page,
      limit,
    );
  } catch (error: any) {
    console.error("Get fees error:", error);
    return sendError(res, "Failed to get fees", error.message, 500);
  }
};

export const getFeeById = async (req: AuthRequest, res: Response) => {
  try {
    const fee = await FeeRecord.findById(req.params.id).populate(
      "studentId",
      "name email",
    );

    if (!fee) {
      return sendError(res, "Fee record not found", undefined, 404);
    }

    return sendSuccess(res, "Fee record retrieved", fee);
  } catch (error: any) {
    console.error("Get fee error:", error);
    return sendError(res, "Failed to get fee", error.message, 500);
  }
};

export const createFeeRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, semester, amount, dueDate } = req.body;

    const fee = new FeeRecord({
      studentId,
      semester,
      amount,
      dueDate,
      status: "pending",
    });

    await fee.save();
    await fee.populate("studentId", "name email");

    return sendSuccess(res, "Fee record created", fee, 201);
  } catch (error: any) {
    console.error("Create fee error:", error);
    return sendError(res, "Failed to create fee", error.message, 500);
  }
};

export const updateFeeStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, paymentMethod, transactionId } = req.body;
    const updates: any = { status };

    if (status === "paid") {
      updates.paidDate = new Date();
      updates.paymentMethod = paymentMethod;
      updates.transactionId = transactionId;
    }

    const fee = await FeeRecord.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate("studentId", "name email");

    if (!fee) {
      return sendError(res, "Fee record not found", undefined, 404);
    }

    return sendSuccess(res, "Fee record updated", fee);
  } catch (error: any) {
    console.error("Update fee error:", error);
    return sendError(res, "Failed to update fee", error.message, 500);
  }
};

export const getMyFees = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    if (!student) {
      return sendError(res, "Student profile not found", undefined, 404);
    }

    const fees = await FeeRecord.find({ studentId: student._id }).populate(
      "studentId",
      "name email",
    );

    return sendSuccess(res, "Fees retrieved", fees);
  } catch (error: any) {
    console.error("Get my fees error:", error);
    return sendError(res, "Failed to get fees", error.message, 500);
  }
};

export const deleteFeeRecord = async (req: AuthRequest, res: Response) => {
  try {
    const fee = await FeeRecord.findByIdAndDelete(req.params.id);

    if (!fee) {
      return sendError(res, "Fee record not found", undefined, 404);
    }

    return sendSuccess(res, "Fee record deleted");
  } catch (error: any) {
    console.error("Delete fee error:", error);
    return sendError(res, "Failed to delete fee", error.message, 500);
  }
};
