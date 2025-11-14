import mongoose, { Document, Schema } from 'mongoose';

export interface IFee extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue';
  type: 'hostel' | 'mess' | 'security' | 'other';
  description?: string;
}

const FeeSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    studentName: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
    type: { type: String, enum: ['hostel', 'mess', 'security', 'other'], default: 'hostel' },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IFee>('Fee', FeeSchema);
