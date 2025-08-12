import * as dao from "./dao.js";
import * as followDao from "../Follows/dao.js";
import * as reviewDao from "../Reviews/dao.js";

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
    console.log("📧 Signin attempt received:", req.body);
    try {
      const { username, password } = req.body;
      console.log("🔍 Looking for user:", username, "with password:", password);

      const currentUser = await dao.findUserByCredentials(username, password);
      console.log("🔎 Database query result:", currentUser);

      if (currentUser) {
        console.log("✅ User found:", currentUser.username);
        // Update last login time
        await dao.updateUser(currentUser._id, { lastLoginAt: new Date() });
        req.session["currentUser"] = currentUser;

        // Remove password from response
        const { password: userPassword, ...userResponse } = currentUser.toObject();
        res.json(userResponse);
      } else {
        console.log("❌ Invalid credentials for:", username);
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("💥 Signin error:", error);
      res.status(500).json({ message: "Error signing in", error: error.message });
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

  // NEW PROFILE-SPECIFIC ENDPOINTS
  const getUserStats = async (req, res) => {
    try {
      const { userId } = req.params;

      const followersCount = await followDao.getFollowersCount(userId);
      const followingCount = await followDao.getFollowingCount(userId);

      res.json({
        followersCount,
        followingCount
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user stats", error: error.message });
    }
  };

  const getUserFollowers = async (req, res) => {
    try {
      const { userId } = req.params;

      const followers = await followDao.getFollowers(userId);
      const followerUsers = followers.map(follow => follow.follower);

      res.json(followerUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching followers", error: error.message });
    }
  };

  const getUserFollowing = async (req, res) => {
    try {
      const { userId } = req.params;

      const following = await followDao.getFollowing(userId);
      const followingUsers = following.map(follow => follow.following);

      res.json(followingUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching following", error: error.message });
    }
  };

  const getUserReviews = async (req, res) => {
    try {
      const { userId } = req.params;

      const reviews = await reviewDao.findReviewsByUser(userId);

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user reviews", error: error.message });
    }
  };

  // AUTHENTICATION ROUTES
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.get("/api/profile", profile);
  app.put("/api/profile", updateProfile);
  app.get("/api/profile/:userId", getUserProfile);
  app.get("/api/users", getAllUsers);

  // PROFILE-SPECIFIC ROUTES
  app.get("/api/users/:userId/stats", getUserStats);
  app.get("/api/users/:userId/followers", getUserFollowers);
  app.get("/api/users/:userId/following", getUserFollowing);
  app.get("/api/users/:userId/reviews", getUserReviews);
}