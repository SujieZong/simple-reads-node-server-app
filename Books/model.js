import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("BookModel", schema);
export default model;
