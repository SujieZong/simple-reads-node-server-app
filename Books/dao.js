import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

// Create or update a book
export const createOrUpdateBook = async (bookData) => {
  const { googleId } = bookData;

  // Use googleId as the _id for consistency
  const bookWithId = {
    ...bookData,
    _id: googleId,
    updatedAt: new Date(),
    lastSyncedAt: new Date(),
  };

  // Use upsert to create if doesn't exist, update if exists
  return model.findOneAndUpdate(
    { googleId },
    { $set: bookWithId },
    { upsert: true, new: true }
  );
};

export const findBookByGoogleId = (googleId) => model.findOne({ googleId });

export const findBookById = (bookId) => model.findById(bookId);

export const findAllBooks = () => model.find().sort({ createdAt: -1 });

export const searchBooksInDB = (searchTerm) => {
  const regex = new RegExp(searchTerm, "i");
  return model.find({
    $or: [
      { title: { $regex: regex } },
      { authors: { $regex: regex } },
      { description: { $regex: regex } },
      { categories: { $regex: regex } },
    ],
  });
};

export const findBooksByCategory = (category) =>
  model.find({ categories: { $regex: new RegExp(category, "i") } });

export const findBooksByAuthor = (author) =>
  model.find({ authors: { $regex: new RegExp(author, "i") } });

export const updateBookStats = async (googleId, updates) =>
  model.updateOne(
    { googleId },
    { $set: { ...updates, updatedAt: new Date() } }
  );

export const incrementViewCount = (googleId) =>
  model.updateOne({ googleId }, { $inc: { viewCount: 1 } });

export const incrementFavoriteCount = (googleId) =>
  model.updateOne({ googleId }, { $inc: { favoriteCount: 1 } });

export const decrementFavoriteCount = (googleId) =>
  model.updateOne({ googleId }, { $inc: { favoriteCount: -1 } });

// Update internal rating based on reviews
export const updateInternalRating = async (googleId) => {
  const ReviewModel = await import("../Reviews/model.js");

  const stats = await ReviewModel.default.aggregate([
    { $match: { book: googleId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    const { avgRating, count } = stats[0];
    await model.updateOne(
      { googleId },
      {
        $set: {
          internalRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
          internalRatingsCount: count,
          updatedAt: new Date(),
        },
      }
    );
  }
};

export const getPopularBooks = (limit = 10) =>
  model.find().sort({ favoriteCount: -1, viewCount: -1 }).limit(limit);

export const getTopRatedBooks = (limit = 10) =>
  model
    .find({ internalRatingsCount: { $gte: 1 } })
    .sort({ internalRating: -1, internalRatingsCount: -1 })
    .limit(limit);

export const getRecentlyAddedBooks = (limit = 10) =>
  model.find().sort({ createdAt: -1 }).limit(limit);

