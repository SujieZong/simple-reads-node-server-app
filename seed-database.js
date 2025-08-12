import mongoose from "mongoose";
import users from "./Database/users.js";
import reviews from "./Database/reviews.js";
import favorites from "./Database/favorites.js";
import follows from "./Database/follows.js";

// Import models
import UserModel from "./Users/model.js";
import ReviewModel from "./Reviews/model.js";
import FavoriteModel from "./Favorites/model.js";
import FollowModel from "./Follows/model.js";

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/simplereads";

async function seedDatabase() {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to MongoDB");

    // Clear existing data
    await UserModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await FavoriteModel.deleteMany({});
    await FollowModel.deleteMany({});
    console.log("Cleared existing data");

    // Seed users
    await UserModel.insertMany(users);
    console.log(`Seeded ${users.length} users`);

    // Seed reviews
    await ReviewModel.insertMany(reviews);
    console.log(`Seeded ${reviews.length} reviews`);

    // Seed favorites
    await FavoriteModel.insertMany(favorites);
    console.log(`Seeded ${favorites.length} favorites`);

    // Seed follows
    await FollowModel.insertMany(follows);
    console.log(`Seeded ${follows.length} follows`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
