import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export const followUser = (follow) => {
  const newFollow = { ...follow, _id: uuidv4() };
  return model.create(newFollow);
};

export const unfollowUser = (followerId, followingId) =>
  model.deleteOne({ follower: followerId, following: followingId });

export const getFollowing = (userId) =>
  model
    .find({ follower: userId })
    .populate("following", "-password")
    .sort({ createdAt: -1 });

export const getFollowers = (userId) =>
  model
    .find({ following: userId })
    .populate("follower", "-password")
    .sort({ createdAt: -1 });

export const checkIfFollowing = (followerId, followingId) =>
  model.findOne({ follower: followerId, following: followingId });

export const getFollowingCount = (userId) =>
  model.countDocuments({ follower: userId });

export const getFollowersCount = (userId) =>
  model.countDocuments({ following: userId });

export const deleteUserFollows = (userId) =>
  model.deleteMany({
    $or: [{ follower: userId }, { following: userId }]
  });