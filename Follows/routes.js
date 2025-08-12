import * as dao from "./dao.js";

export default function FollowRoutes(app) {
  const followUser = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { userId } = req.params;

      // Prevent users from following themselves
      if (currentUser._id === userId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }

      // Check if already following
      const existingFollow = await dao.checkIfFollowing(
        currentUser._id,
        userId
      );
      if (existingFollow) {
        return res
          .status(400)
          .json({ message: "You are already following this user" });
      }

      const followData = {
        follower: currentUser._id,
        following: userId,
      };

      const newFollow = await dao.followUser(followData);
      res.status(201).json(newFollow);
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "You are already following this user" });
      }
      res
        .status(500)
        .json({ message: "Error following user", error: error.message });
    }
  };

  const unfollowUser = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { userId } = req.params;

      const result = await dao.unfollowUser(currentUser._id, userId);

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "Follow relationship not found" });
      }

      res.json({ message: "Unfollowed successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error unfollowing user", error: error.message });
    }
  };

  const getFollowing = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const following = await dao.getFollowing(currentUser._id);
      res.json(following);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching following list",
        error: error.message,
      });
    }
  };

  const getFollowers = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const followers = await dao.getFollowers(currentUser._id);
      res.json(followers);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching followers list",
        error: error.message,
      });
    }
  };

  // Get any user's following list (for profile pages)
  const getPublicUserFollowing = async (req, res) => {
    try {
      const { userId } = req.params;
      const following = await dao.getFollowing(userId);
      res.json(following);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching user following",
        error: error.message,
      });
    }
  };

  // Get any user's followers list (for profile pages)
  const getPublicUserFollowers = async (req, res) => {
    try {
      const { userId } = req.params;
      const followers = await dao.getFollowers(userId);
      res.json(followers);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching user followers",
        error: error.message,
      });
    }
  };

  // Routes
  app.post("/api/follow/:userId", followUser);
  app.delete("/api/follow/:userId", unfollowUser);
  app.get("/api/following", getFollowing);
  app.get("/api/followers", getFollowers);
  app.get("/api/following/user/:userId", getPublicUserFollowing);
  app.get("/api/followers/user/:userId", getPublicUserFollowers);
}
