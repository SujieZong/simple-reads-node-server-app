import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    _id: String,
    book: { type: String, required: true },
    user: { type: String, required: true, ref: "UserModel" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "reviews" }
);

// Index for efficient querying
reviewSchema.index({ book: 1 });
reviewSchema.index({ user: 1 });

export default reviewSchema;
