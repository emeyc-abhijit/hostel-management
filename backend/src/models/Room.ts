import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  hostelId: mongoose.Types.ObjectId;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupied: number;
  type: "single" | "double" | "triple";
  status: "available" | "full" | "maintenance";
  students: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    roomNumber: { type: String, required: true },
    floor: { type: Number, required: true },
    capacity: { type: Number, required: true },
    occupied: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ["single", "double", "triple"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "full", "maintenance"],
      default: "available",
    },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true },
);

export default mongoose.model<IRoom>("Room", roomSchema);
