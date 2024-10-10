import mongoose from "mongoose";
import { MONGO_URL } from "./env";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`Mongo Connect Successfully`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
