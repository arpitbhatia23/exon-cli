import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(process.env.DATABASE_URL as string);
  console.log("🍃 MongoDB connected");
}
