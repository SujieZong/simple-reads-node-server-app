import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    _id: String,
    follower: { type: String, required: true, ref: "UserModel" },
    following: { type: String, required: true, ref: "UserModel" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "follows" }
);

// Ensure a user can only follow another user once
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Indexes for efficient querying
followSchema.index({ follower: 1 });
followSchema.index({ following: 1 });

export default followSchema;
