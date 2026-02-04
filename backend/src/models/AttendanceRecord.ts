import mongoose, { Schema, Document } from "mongoose";

export interface IAttendanceRecord extends Document {
  studentId: mongoose.Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "leave";
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      required: true,
    },
    remarks: String,
  },
  { timestamps: true },
);

export default mongoose.model<IAttendanceRecord>(
  "AttendanceRecord",
  attendanceRecordSchema,
);
