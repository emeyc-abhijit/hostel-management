import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  rollNumber: string;
  roomId?: mongoose.Types.ObjectId;
  hostelId?: mongoose.Types.ObjectId;
  admissionDate?: Date;
  status: "pending" | "approved" | "rejected" | "allocated";
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    rollNumber: { type: String, required: true, unique: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room" },
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel" },
    admissionDate: Date,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "allocated"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model<IStudent>("Student", studentSchema);
