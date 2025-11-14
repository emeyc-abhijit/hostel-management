import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  phone?: string;
  roomNumber?: string;
  enrollmentNumber?: string;
  course?: string;
  year?: number;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  avatar?: string;
}

const StudentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    roomNumber: { type: String },
    enrollmentNumber: { type: String },
    course: { type: String },
    year: { type: Number },
    guardianName: { type: String },
    guardianPhone: { type: String },
    address: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>('Student', StudentSchema);
