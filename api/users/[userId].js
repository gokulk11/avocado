import { connectDB } from "../../src/lib/db.js";
import User from "../models/User.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    await connectDB();

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      error: "Failed to get user",
    });
  }
}