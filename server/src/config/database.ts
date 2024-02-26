import mongoose from "mongoose";

const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/social_media_db";

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
