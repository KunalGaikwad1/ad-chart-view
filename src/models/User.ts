import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    photoURL: String,
    phoneNumber: String,
    role: { type: String, default: "user" },
    sessionToken: String, // 🔹 store active session ID
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
