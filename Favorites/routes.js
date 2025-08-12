import * as dao from "./dao.js";

export default function FavoriteRoutes(app) {
  const addToFavorites = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { bookId } = req.params;

      // Check if already in favorites
      const existingFavorite = await dao.checkIfFavorite(
        currentUser._id,
        bookId
      );
      if (existingFavorite) {
        return res
          .status(400)
          .json({ message: "Book is already in favorites" });
      }

      const favoriteData = {
        user: currentUser._id,
        book: bookId,
      };

      const newFavorite = await dao.addFavorite(favoriteData);
      res.status(201).json(newFavorite);
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Book is already in favorites" });
      }
      res
        .status(500)
        .json({ message: "Error adding to favorites", error: error.message });
    }
  };

  const removeFromFavorites = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { bookId } = req.params;

      const result = await dao.removeFavorite(currentUser._id, bookId);

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      res.json({ message: "Removed from favorites successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error removing from favorites",
        error: error.message,
      });
    }
  };

  const getUserFavorites = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const favorites = await dao.findUserFavorites(currentUser._id);
      res.json(favorites);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching favorites", error: error.message });
    }
  };

  // Get any user's favorites (for profile pages)
  const getPublicUserFavorites = async (req, res) => {
    try {
      const { userId } = req.params;
      const favorites = await dao.findUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error fetching user favorites",
          error: error.message,
        });
    }
  };

  // Routes
  app.post("/api/favorites/:bookId", addToFavorites);
  app.delete("/api/favorites/:bookId", removeFromFavorites);
  app.get("/api/favorites", getUserFavorites);
  app.get("/api/favorites/user/:userId", getPublicUserFavorites);
}
