import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    _id: String, // Use googleId as the primary key
    googleId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    authors: [String],
    thumbnail: String,
    description: String,
    publishedDate: String,
    categories: [String],
    pageCount: Number,
    language: { type: String, default: "en" },
    publisher: String,
    isbn: String,

    // Google Books data
    googleRating: Number,
    googleRatingsCount: Number,
    previewLink: String,
    infoLink: String,

    // Internal data
    internalRating: { type: Number, default: 0 }, // Average from your users
    internalRatingsCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },

    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastSyncedAt: { type: Date, default: Date.now }, // Last sync with Google Books
  },
  { collection: "books" }
);

// Indexes for efficient querying
bookSchema.index({ googleId: 1 }, { unique: true });
bookSchema.index({ title: "text", authors: "text", description: "text" });
bookSchema.index({ categories: 1 });
bookSchema.index({ authors: 1 });
bookSchema.index({ internalRating: -1 });
bookSchema.index({ viewCount: -1 });
bookSchema.index({ favoriteCount: -1 });

export default bookSchema;
