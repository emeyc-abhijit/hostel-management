import mongoose, { Schema, Document } from "mongoose";

export interface IFeeRecord extends Document {
  studentId: mongoose.Types.ObjectId;
  semester: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: "pending" | "paid" | "overdue";
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const feeRecordSchema = new Schema<IFeeRecord>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    semester: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paidDate: Date,
    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    paymentMethod: String,
    transactionId: String,
  },
  { timestamps: true },
);

export default mongoose.model<IFeeRecord>("FeeRecord", feeRecordSchema);
