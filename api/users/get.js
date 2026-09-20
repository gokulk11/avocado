import { connectDB } from "../db.js";
import User from "../models/User.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      error: "Failed to fetch users",
    });
  }
}