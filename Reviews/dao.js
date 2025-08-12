import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export const createReview = (review) => {
  const newReview = { ...review, _id: uuidv4() };
  return model.create(newReview);
};

export const findAllReviews = () => model.find().populate("user", "-password");

export const findReviewById = (reviewId) =>
  model.findById(reviewId).populate("user", "-password");

export const findReviewsByBook = (bookId) =>
  model
    .find({ book: bookId })
    .populate("user", "-password")
    .sort({ createdAt: -1 });

export const findReviewsByUser = (userId) =>
  model
    .find({ user: userId })
    .populate("user", "-password")
    .sort({ createdAt: -1 });

export const updateReview = (reviewId, review) =>
  model.updateOne(
    { _id: reviewId },
    { $set: { ...review, updatedAt: new Date() } }
  );

export const deleteReview = (reviewId) => model.deleteOne({ _id: reviewId });

export const findUserReviewForBook = (userId, bookId) =>
  model.findOne({ user: userId, book: bookId });
