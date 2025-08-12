import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    _id: String,
    user: { type: String, required: true, ref: "UserModel" },
    book: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { collection: "favorites" }
);

// Ensure a user can only favorite a book once
favoriteSchema.index({ user: 1, book: 1 }, { unique: true });

export default favoriteSchema;
