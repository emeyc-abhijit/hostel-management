import mongoose, { Schema, Document } from "mongoose";

export interface IComplaint extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  roomNumber: string;
  category: "maintenance" | "electrical" | "plumbing" | "cleanliness" | "other";
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  assignedTo?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  resolvedAt?: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    category: {
      type: String,
      enum: ["maintenance", "electrical", "plumbing", "cleanliness", "other"],
      required: true,
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    notes: String,
    resolvedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model<IComplaint>("Complaint", complaintSchema);
