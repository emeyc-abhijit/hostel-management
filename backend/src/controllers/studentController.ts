import { Response } from "express";
import Student from "../models/Student.js";
import Room from "../models/Room.js";
import {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
} from "../utils/response.js";
import { AuthRequest } from "../middleware/auth.js";

export const getAllStudents = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find()
      .populate("userId", "name email role")
      .populate("roomId")
      .populate("hostelId")
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments();

    return sendPaginatedResponse(
      res,
      "Students retrieved",
      students,
      total,
      page,
      limit,
    );
  } catch (error: any) {
    console.error("Get students error:", error);
    return sendError(res, "Failed to get students", error.message, 500);
  }
};

export const getStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("userId", "name email role")
      .populate("roomId")
      .populate("hostelId");

    if (!student) {
      return sendError(res, "Student not found", undefined, 404);
    }

    return sendSuccess(res, "Student retrieved", student);
  } catch (error: any) {
    console.error("Get student error:", error);
    return sendError(res, "Failed to get student", error.message, 500);
  }
};

export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const {
      userId,
      name,
      email,
      phone,
      course,
      year,
      rollNumber,
      admissionDate,
    } = req.body;

    const student = new Student({
      userId,
      name,
      email,
      phone,
      course,
      year,
      rollNumber,
      admissionDate,
      status: "pending",
    });

    await student.save();
    await student.populate("userId", "name email role");

    return sendSuccess(res, "Student created", student, 201);
  } catch (error: any) {
    console.error("Create student error:", error);
    return sendError(res, "Failed to create student", error.message, 500);
  }
};

export const updateStudent = async (req: AuthRequest, res: Response) => {
  try {
    const allowedUpdates = [
      "name",
      "email",
      "phone",
      "course",
      "year",
      "status",
      "admissionDate",
    ];
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    })
      .populate("userId", "name email role")
      .populate("roomId")
      .populate("hostelId");

    if (!student) {
      return sendError(res, "Student not found", undefined, 404);
    }

    return sendSuccess(res, "Student updated", student);
  } catch (error: any) {
    console.error("Update student error:", error);
    return sendError(res, "Failed to update student", error.message, 500);
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return sendError(res, "Student not found", undefined, 404);
    }

    // Remove student from room
    if (student.roomId) {
      await Room.findByIdAndUpdate(student.roomId, {
        $pull: { students: student._id },
      });
    }

    return sendSuccess(res, "Student deleted");
  } catch (error: any) {
    console.error("Delete student error:", error);
    return sendError(res, "Failed to delete student", error.message, 500);
  }
};

export const allocateRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.body;
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return sendError(res, "Student not found", undefined, 404);
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return sendError(res, "Room not found", undefined, 404);
    }

    if (room.occupied >= room.capacity) {
      return sendError(res, "Room is full", undefined, 400);
    }

    // Remove from old room if exists
    if (student.roomId) {
      await Room.findByIdAndUpdate(student.roomId, {
        $pull: { students: studentId },
      });
    }

    // Add to new room
    await Room.findByIdAndUpdate(roomId, {
      $push: { students: studentId },
      occupied: room.occupied + 1,
    });

    student.roomId = roomId;
    student.hostelId = room.hostelId;
    student.status = "allocated";
    await student.save();

    const populatedStudent = await Student.findById(student._id)
      .populate("roomId")
      .populate("hostelId");

    return sendSuccess(res, "Room allocated successfully", populatedStudent);
  } catch (error: any) {
    console.error("Allocate room error:", error);
    return sendError(res, "Failed to allocate room", error.message, 500);
  }
};

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId })
      .populate("userId", "name email role")
      .populate("roomId")
      .populate("hostelId");

    if (!student) {
      return sendError(res, "Student profile not found", undefined, 404);
    }

    return sendSuccess(res, "Profile retrieved", student);
  } catch (error: any) {
    console.error("Get profile error:", error);
    return sendError(res, "Failed to get profile", error.message, 500);
  }
};
