import { connectDB } from "../../src/lib/db.js";
import User from "../../src/models/User.js";
import Progress from "../../src/models/Progress.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    await connectDB();

    // Make sure the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Check if progress already exists
    let progress = await Progress.findOne({ userId });

    if (progress) {
      return res.status(200).json({
        success: true,
        message: "Progress already exists",
        progress,
      });
    }

    // Create new progress
    progress = await Progress.create({
      userId,
      currentDay: 1,
      completedMissions: [],
      completedSideQuests: [],
      totalRewards: 0,
      streak: 0,
      lastActiveDate: null,
    });

    return res.status(201).json({
      success: true,
      message: "Progress created",
      progress,
    });
  } catch (error) {
    console.error("Create progress error:", error);

    return res.status(500).json({
      error: "Failed to create progress",
    });
  }
}