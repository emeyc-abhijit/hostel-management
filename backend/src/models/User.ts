import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "warden" | "student";
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "warden", "student"],
      required: true,
    },
    avatar: String,
    phone: String,
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
