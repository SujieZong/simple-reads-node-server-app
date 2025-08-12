import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
};

export const findAllUsers = () => model.find().select("-password");

export const findUserById = (userId) =>
  model.findById(userId).select("-password");

export const findUserByUsername = (username) =>
  model.findOne({ username: username });

export const findUserByEmail = (email) => model.findOne({ email: email });

export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password });

export const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });

export const deleteUser = (userId) => model.deleteOne({ _id: userId });

export const findUsersByRole = (role) =>
  model.find({ role: role }).select("-password");

export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i");
  return model
    .find({
      $or: [{ username: { $regex: regex } }, { bio: { $regex: regex } }],
    })
    .select("-password");
};
