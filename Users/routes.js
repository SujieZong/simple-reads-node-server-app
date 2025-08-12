// Get following count for a user
const getFollowingCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const FollowDAO = await import("../Follows/dao.js");
    const count = await FollowDAO.getFollowingCount(userId);
    res.json({ followingCount: count });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching following count",
        error: error.message,
      });
  }
};

// Get follower count for a user
const getFollowerCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const FollowDAO = await import("../Follows/dao.js");
    const count = await FollowDAO.getFollowersCount(userId);
    res.json({ followerCount: count });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching follower count", error: error.message });
  }
};
import * as dao from "./dao.js";

export default function UserRoutes(app) {
  const signup = async (req, res) => {
    try {
      const { username, email } = req.body;

      // Check if username already exists
      const existingUserByUsername = await dao.findUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Check if email already exists
      const existingUserByEmail = await dao.findUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const currentUser = await dao.createUser(req.body);
      req.session["currentUser"] = currentUser;

      // Remove password from response
      const { password, ...userResponse } = currentUser.toObject();
      res.json(userResponse);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  };

  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const currentUser = await dao.findUserByCredentials(username, password);

      if (currentUser) {
        // Update last login time
        await dao.updateUser(currentUser._id, { lastLoginAt: new Date() });
        req.session["currentUser"] = currentUser;

        // Remove password from response
        const { password: userPassword, ...userResponse } =
          currentUser.toObject();
        res.json(userResponse);
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error signing in", error: error.message });
    }
  };

  const signout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error signing out" });
      }
      res.sendStatus(200);
    });
  };

  const profile = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Get fresh user data from database
      const user = await dao.findUserById(currentUser._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching profile", error: error.message });
    }
  };

  const updateProfile = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { password, ...updateData } = req.body;

      // If password is being updated, include it
      if (password) {
        updateData.password = password;
      }

      await dao.updateUser(currentUser._id, updateData);

      // Update session with new data
      const updatedUser = await dao.findUserById(currentUser._id);
      req.session["currentUser"] = updatedUser;

      res.json(updatedUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating profile", error: error.message });
    }
  };

  const getUserProfile = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await dao.findUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching user profile", error: error.message });
    }
  };

  const getAllUsers = async (req, res) => {
    try {
      const { role, search } = req.query;

      let users;
      if (role) {
        users = await dao.findUsersByRole(role);
      } else if (search) {
        users = await dao.findUsersByPartialName(search);
      } else {
        users = await dao.findAllUsers();
      }

      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  };

  // Get user's reviews
  const getUserReviews = async (req, res) => {
    try {
      const { userId } = req.params;
      const ReviewDAO = await import("../Reviews/dao.js");
      const reviews = await ReviewDAO.findReviewsByUser(userId);
      res.json(reviews);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching user reviews", error: error.message });
    }
  };

  // Get reviews from all users that the given user is following
  const getFollowingReviews = async (req, res) => {
    try {
      const { userId } = req.params;
      const FollowDAO = await import("../Follows/dao.js");
      const ReviewDAO = await import("../Reviews/dao.js");
      // Get the list of users this user is following
      const following = await FollowDAO.getFollowing(userId);
      // following is an array of follow objects with .following populated
      const followingUserIds = following.map(
        (f) => f.following._id || f.following
      );
      // Fetch all reviews for all followed users
      const allReviews = await Promise.all(
        followingUserIds.map((uid) => ReviewDAO.findReviewsByUser(uid))
      );
      // Flatten the array of arrays
      let reviews = allReviews.flat();
      // Global sort by createdAt descending
      reviews = reviews.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      res.json(reviews);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching following reviews",
        error: error.message,
      });
    }
  };

  // Get user's favorites
  const getUserFavorites = async (req, res) => {
    try {
      const { userId } = req.params;
      const FavoriteDAO = await import("../Favorites/dao.js");
      const favorites = await FavoriteDAO.findUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching user favorites",
        error: error.message,
      });
    }
  };

  // Get user's following list
  const getUserFollowing = async (req, res) => {
    try {
      const { userId } = req.params;
      const FollowDAO = await import("../Follows/dao.js");
      const following = await FollowDAO.getFollowing(userId);
      res.json(following);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching user following",
        error: error.message,
      });
    }
  };

  // Get user's followers list
  const getUserFollowers = async (req, res) => {
    try {
      const { userId } = req.params;
      const FollowDAO = await import("../Follows/dao.js");
      const followers = await FollowDAO.getFollowers(userId);
      res.json(followers);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching user followers",
        error: error.message,
      });
    }
  };

  // Check follow status
  const checkFollowStatus = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.json({ isFollowing: false });
      }

      const { userId } = req.params;
      const FollowDAO = await import("../Follows/dao.js");
      const isFollowing = await FollowDAO.checkIfFollowing(
        currentUser._id,
        userId
      );

      res.json({ isFollowing: !!isFollowing });
    } catch (error) {
      res.status(500).json({
        message: "Error checking follow status",
        error: error.message,
      });
    }
  };

  // Check favorite status
  const checkFavoriteStatus = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.json({ isFavorite: false });
      }

      const { bookId } = req.params;
      const FavoriteDAO = await import("../Favorites/dao.js");
      const isFavorite = await FavoriteDAO.checkIfFavorite(
        currentUser._id,
        bookId
      );

      res.json({ isFavorite: !!isFavorite });
    } catch (error) {
      res.status(500).json({
        message: "Error checking favorite status",
        error: error.message,
      });
    }
  };

  // Admin: Delete user (admin only)
  const deleteUser = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { userId } = req.params;

      // Prevent admin from deleting themselves
      if (currentUser._id === userId) {
        return res
          .status(400)
          .json({ message: "Cannot delete your own account" });
      }

      await dao.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  };

  // Admin: Update any user's profile (admin only)
  const adminUpdateUser = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { userId } = req.params;
      const { password, ...updateData } = req.body;

      if (password) {
        updateData.password = password;
      }

      await dao.updateUser(userId, updateData);
      const updatedUser = await dao.findUserById(userId);

      res.json(updatedUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  };

  // Authentication routes
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.get("/api/profile", profile);
  app.put("/api/profile", updateProfile);
  app.get("/api/profile/:userId", getUserProfile);
  app.get("/api/users", getAllUsers);

  // Profile data routes
  app.get("/api/profile/:userId/reviews", getUserReviews);
  app.get("/api/profile/:userId/following/reviews", getFollowingReviews);
  app.get("/api/profile/:userId/favorites", getUserFavorites);
  app.get("/api/profile/:userId/following", getUserFollowing);
  app.get("/api/profile/:userId/followers", getUserFollowers);
  app.get("/api/profile/:userId/following/count", getFollowingCount);
  app.get("/api/profile/:userId/followers/count", getFollowerCount);

  // Status check routes
  app.get("/api/follow/status/:userId", checkFollowStatus);
  app.get("/api/favorite/status/:bookId", checkFavoriteStatus);

  // Admin routes
  app.delete("/api/admin/users/:userId", deleteUser);
  app.put("/api/admin/users/:userId", adminUpdateUser);
}
