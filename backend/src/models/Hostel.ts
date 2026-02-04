import mongoose, { Schema, Document } from "mongoose";

export interface IHostel extends Document {
  name: string;
  type: "boys" | "girls";
  totalRooms: number;
  occupiedRooms: number;
  capacity: number;
  currentOccupancy: number;
  wardenId?: mongoose.Types.ObjectId;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const hostelSchema = new Schema<IHostel>(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ["boys", "girls"], required: true },
    totalRooms: { type: Number, required: true },
    occupiedRooms: { type: Number, default: 0 },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    wardenId: { type: Schema.Types.ObjectId, ref: "User" },
    address: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IHostel>("Hostel", hostelSchema);
