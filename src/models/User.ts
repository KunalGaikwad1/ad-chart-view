import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  uid: string; // firebase uid
  email: string;
  name?: string;
  phone?: string;
  currentSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, index: true },
    name: { type: String },
    phone: { type: String },
    currentSessionId: { type: String },
  },
  { timestamps: true }
);

export default (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
