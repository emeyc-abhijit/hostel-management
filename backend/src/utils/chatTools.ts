import Room from "../models/Room.js";
import Student from "../models/Student.js";
import FeeRecord from "../models/FeeRecord.js";
import Hostel from "../models/Hostel.js";
import mongoose from "mongoose";

export const getAvailableRooms = async (args: any) => {
  const { type, hostelName } = args;
  
  const query: any = { status: "available" };
  if (type) {
    query.type = type.toLowerCase();
  }
  
  if (hostelName) {
    const hostel = await Hostel.findOne({ name: { $regex: new RegExp(hostelName, "i") } });
    if (hostel) {
      query.hostelId = hostel._id;
    } else {
      return { message: `No hostel found with name matching '${hostelName}'` };
    }
  }

  const rooms = await Room.find(query).populate("hostelId", "name").lean();
  
  if (rooms.length === 0) {
    return { availableRooms: 0, details: "No available rooms match the criteria." };
  }

  // Summarize the results
  const summary = rooms.reduce((acc: any, room: any) => {
    const key = `${room.hostelId?.name} - ${room.type}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    totalAvailable: rooms.length,
    breakdown: summary
  };
};

export const getMyProfile = async (args: any) => {
  const { userId } = args;
  if (!userId) return { error: "User ID not provided" };

  const student = await Student.findOne({ userId })
    .populate("roomId", "roomNumber type")
    .populate("hostelId", "name")
    .lean();

  if (!student) {
    return { error: "Student profile not found for this user." };
  }

  return {
    name: student.name,
    rollNumber: student.rollNumber,
    course: student.course,
    year: student.year,
    status: student.status,
    room: (student.roomId as any)?.roomNumber || "Not allocated",
    hostel: (student.hostelId as any)?.name || "Not allocated"
  };
};

export const getMyFees = async (args: any) => {
  const { userId } = args;
  if (!userId) return { error: "User ID not provided" };

  const student = await Student.findOne({ userId });
  if (!student) {
    return { error: "Student profile not found." };
  }

  const fees = await FeeRecord.find({ studentId: student._id }).lean();
  
  if (fees.length === 0) {
    return { message: "No fee records found." };
  }

  const pendingFees = fees.filter(f => f.status !== "paid");
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  return {
    totalPendingAmount: totalPending,
    pendingRecords: pendingFees.map(f => ({
      semester: f.semester,
      amount: f.amount,
      dueDate: f.dueDate,
      status: f.status
    }))
  };
};

export const getHostelInfo = async (args: any) => {
  const hostels = await Hostel.find().lean();
  return {
    hostels: hostels.map(h => ({
      name: h.name,
      type: h.type,
      capacity: h.capacity,
      currentOccupancy: h.currentOccupancy,
      totalRooms: h.totalRooms,
      occupiedRooms: h.occupiedRooms
    }))
  };
};
