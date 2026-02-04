import mongoose, { Schema, Document } from "mongoose";

export interface INotice extends Document {
  title: string;
  content: string;
  category: "general" | "urgent" | "event" | "maintenance";
  postedBy: mongoose.Types.ObjectId;
  targetAudience: "all" | "boys" | "girls" | "specific";
  targetHostel?: mongoose.Types.ObjectId;
  postedAt: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["general", "urgent", "event", "maintenance"],
      required: true,
    },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetAudience: {
      type: String,
      enum: ["all", "boys", "girls", "specific"],
      default: "all",
    },
    targetHostel: { type: Schema.Types.ObjectId, ref: "Hostel" },
    postedAt: { type: Date, default: Date.now },
    expiresAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model<INotice>("Notice", noticeSchema);
