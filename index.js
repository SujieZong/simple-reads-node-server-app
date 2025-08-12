import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";

// Import route modules
import UserRoutes from "./Users/routes.js";
import ReviewRoutes from "./Reviews/routes.js";
import FavoriteRoutes from "./Favorites/routes.js";
import FollowRoutes from "./Follows/routes.js";

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/simplereads";
mongoose.connect(CONNECTION_STRING);

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:5173",
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "simplereads",
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

// Initialize routes
UserRoutes(app);
ReviewRoutes(app);
FavoriteRoutes(app);
FollowRoutes(app);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "SimpleReads API is running" });
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`SimpleReads API server running on port ${process.env.PORT || 4000}`);
});