import { connectDB } from "../db.js";
import SideQuest from "../models/SideQuest.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const sideQuests = await SideQuest.find({
      active: true,
    })
      .sort({ day: 1, createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      sideQuests,
    });
  } catch (error) {
    console.error("Get all side quests error:", error);

    return res.status(500).json({
      error: "Failed to get side quests",
    });
  }
}