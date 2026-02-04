import { Response } from "express";
import AttendanceRecord from "../models/AttendanceRecord.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Student from "../models/Student.js";
import {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
} from "../utils/response.js";
import { AuthRequest } from "../middleware/auth.js";

// Attendance Controllers
export const getAllAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const attendance = await AttendanceRecord.find()
      .populate("studentId", "name email")
      .skip(skip)
      .limit(limit);

    const total = await AttendanceRecord.countDocuments();

    return sendPaginatedResponse(
      res,
      "Attendance records retrieved",
      attendance,
      total,
      page,
      limit,
    );
  } catch (error: any) {
    console.error("Get attendance error:", error);
    return sendError(res, "Failed to get attendance", error.message, 500);
  }
};

export const recordAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, date, status, remarks } = req.body;

    const record = new AttendanceRecord({
      studentId,
      date,
      status,
      remarks,
    });

    await record.save();
    await record.populate("studentId", "name email");

    return sendSuccess(res, "Attendance recorded", record, 201);
  } catch (error: any) {
    console.error("Record attendance error:", error);
    return sendError(res, "Failed to record attendance", error.message, 500);
  }
};

export const getMyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    if (!student) {
      return sendError(res, "Student profile not found", undefined, 404);
    }

    const attendance = await AttendanceRecord.find({ studentId: student._id })
      .populate("studentId", "name email")
      .sort({ date: -1 });

    return sendSuccess(res, "Attendance retrieved", attendance);
  } catch (error: any) {
    console.error("Get my attendance error:", error);
    return sendError(res, "Failed to get attendance", error.message, 500);
  }
};

// Leave Request Controllers
export const getAllLeaveRequests = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const leaves = await LeaveRequest.find()
      .populate("studentId", "name email")
      .populate("approvedBy", "name")
      .skip(skip)
      .limit(limit);

    const total = await LeaveRequest.countDocuments();

    return sendPaginatedResponse(
      res,
      "Leave requests retrieved",
      leaves,
      total,
      page,
      limit,
    );
  } catch (error: any) {
    console.error("Get leave requests error:", error);
    return sendError(res, "Failed to get leave requests", error.message, 500);
  }
};

export const submitLeaveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    if (!student) {
      return sendError(res, "Student profile not found", undefined, 404);
    }

    const { fromDate, toDate, reason } = req.body;

    const leaveReq = new LeaveRequest({
      studentId: student._id,
      studentName: student.name,
      fromDate,
      toDate,
      reason,
      status: "pending",
      appliedAt: new Date(),
    });

    await leaveReq.save();
    const populatedLeaveReq = await LeaveRequest.findById(leaveReq._id)
      .populate("studentId", "name email")
      .populate("approvedBy", "name");

    return sendSuccess(res, "Leave request submitted", populatedLeaveReq, 201);
  } catch (error: any) {
    console.error("Submit leave request error:", error);
    return sendError(res, "Failed to submit leave request", error.message, 500);
  }
};

export const updateLeaveRequestStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { status } = req.body;

    const updates: any = { status };
    if (status === "approved") {
      updates.approvedBy = req.userId;
    }

    const leaveReq = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
      },
    )
      .populate("studentId", "name email")
      .populate("approvedBy", "name");

    if (!leaveReq) {
      return sendError(res, "Leave request not found", undefined, 404);
    }

    return sendSuccess(res, "Leave request updated", leaveReq);
  } catch (error: any) {
    console.error("Update leave request error:", error);
    return sendError(res, "Failed to update leave request", error.message, 500);
  }
};

export const getMyLeaveRequests = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    if (!student) {
      return sendError(res, "Student profile not found", undefined, 404);
    }

    const leaves = await LeaveRequest.find({ studentId: student._id })
      .populate("studentId", "name email")
      .populate("approvedBy", "name")
      .sort({ appliedAt: -1 });

    return sendSuccess(res, "Leave requests retrieved", leaves);
  } catch (error: any) {
    console.error("Get my leave requests error:", error);
    return sendError(res, "Failed to get leave requests", error.message, 500);
  }
};
