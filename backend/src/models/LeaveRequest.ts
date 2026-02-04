import mongoose, { Schema, Document } from "mongoose";

export interface ILeaveRequest extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: Date;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leaveRequestSchema = new Schema<ILeaveRequest>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    appliedAt: { type: Date, default: Date.now },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model<ILeaveRequest>(
  "LeaveRequest",
  leaveRequestSchema,
);
