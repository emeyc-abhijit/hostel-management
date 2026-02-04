import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  course: string;
  year: number;
  preferredHostel?: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    preferredHostel: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    appliedDate: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true },
);

export default mongoose.model<IApplication>("Application", applicationSchema);
