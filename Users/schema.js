import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: String,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["reader", "writer", "admin"],
      default: "reader",
    },
    avatar: String,
    bio: String,
    writerBadge: { type: Boolean, default: false },
    expertise: [String],
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: Date,
  },
  { collection: "users" }
);

export default userSchema;
