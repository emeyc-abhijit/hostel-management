import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRoom extends Document {
  number: string;
  floor?: number;
  capacity: number;
  occupied: number;
  type: 'single' | 'double' | 'triple' | 'quad';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  hostel?: string;
  students?: Types.ObjectId[];
}

const RoomSchema: Schema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    floor: { type: Number },
    capacity: { type: Number, required: true, default: 1 },
    occupied: { type: Number, required: true, default: 0 },
    type: { type: String, enum: ['single', 'double', 'triple', 'quad'], default: 'double' },
    status: { type: String, enum: ['available', 'occupied', 'maintenance', 'reserved'], default: 'available' },
    hostel: { type: String },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>('Room', RoomSchema);
