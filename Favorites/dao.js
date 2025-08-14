import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export const addFavorite = (favorite) => {
  const newFavorite = { ...favorite, _id: uuidv4() };
  return model.create(newFavorite);
};

export const removeFavorite = (userId, bookId) =>
  model.deleteOne({ user: userId, book: bookId });

export const findUserFavorites = (userId) =>
  model
    .find({ user: userId })
    .populate("user", "-password")
    .sort({ addedAt: -1 });

export const findFavoritesByBook = (bookId) =>
  model.find({ book: bookId }).populate("user", "-password");

export const checkIfFavorite = (userId, bookId) =>
  model.findOne({ user: userId, book: bookId });

export const getFavoriteCount = (bookId) =>
  model.countDocuments({ book: bookId });

export const deleteUserFavorites = (userId) =>
  model.deleteMany({ user: userId });
