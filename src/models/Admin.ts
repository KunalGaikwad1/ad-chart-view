import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Admin as mongoose.Model<IAdmin>) ||
  mongoose.model<IAdmin>("Admin", AdminSchema);
