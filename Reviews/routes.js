import * as dao from "./dao.js";

export default function ReviewRoutes(app) {
  const createReview = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { book, rating, title, content } = req.body;

      // Check if user has already reviewed this book
      const existingReview = await dao.findUserReviewForBook(
        currentUser._id,
        book
      );
      if (existingReview) {
        return res
          .status(400)
          .json({ message: "You have already reviewed this book" });
      }

      const reviewData = {
        book,
        user: currentUser._id,
        rating,
        title,
        content,
      };

      const newReview = await dao.createReview(reviewData);
      const populatedReview = await dao.findReviewById(newReview._id);

      res.status(201).json(populatedReview);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating review", error: error.message });
    }
  };

  const getReviewsForBook = async (req, res) => {
    try {
      const { bookId } = req.params;
      const reviews = await dao.findReviewsByBook(bookId);
      res.json(reviews);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching reviews", error: error.message });
    }
  };

  const updateReview = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { reviewId } = req.params;
      const review = await dao.findReviewById(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check if user owns the review
      if (review.user._id.toString() !== currentUser._id) {
        return res
          .status(403)
          .json({ message: "You can only update your own reviews" });
      }

      await dao.updateReview(reviewId, req.body);
      const updatedReview = await dao.findReviewById(reviewId);

      res.json(updatedReview);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating review", error: error.message });
    }
  };

  const deleteReview = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { reviewId } = req.params;
      const review = await dao.findReviewById(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check if user owns the review 
      if (
        review.user._id.toString() !== currentUser._id &&
        (currentUser.role == "reader" || currentUser.role === "admin")
      ) {
        return res
          .status(403)
          .json({ message: "You can only delete your own reviews" });
      }

      await dao.deleteReview(reviewId);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting review", error: error.message });
    }
  };

  // Get all reviews (admin only)
  const getAllReviews = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const reviews = await dao.findAllReviews();
      res.json(reviews);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching all reviews", error: error.message });
    }
  };

  // Get reviews by user (for profile pages)
  const getReviewsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const reviews = await dao.findReviewsByUser(userId);
      res.json(reviews);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching user reviews", error: error.message });
    }
  };

  // Get 3 random reviews (public)
  const getRandomReviews = async (req, res) => {
    try {
      // Use MongoDB aggregation for random sampling
      const model = (await import("./model.js")).default;
      const randomReviews = await model.aggregate([
        { $sample: { size: 3 } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $project: { "user.password": 0 } },
      ]);
      res.json(randomReviews);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error fetching random reviews",
          error: error.message,
        });
    }
  };

  // Routes
  app.post("/api/reviews", createReview);
  app.get("/api/reviews/book/:bookId", getReviewsForBook);
  app.get("/api/reviews/user/:userId", getReviewsByUser);
  app.get("/api/reviews/random", getRandomReviews);
  app.put("/api/reviews/:reviewId", updateReview);
  app.delete("/api/reviews/:reviewId", deleteReview);

  // Admin routes
  app.get("/api/admin/reviews", getAllReviews);
}
