import { connectDB } from "../db.js";
import SideQuest from "../models/SideQuest.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const day = Number(req.query.day);

    if (!day || day < 1) {
      return res.status(400).json({
        error: "Valid day is required",
      });
    }

    await connectDB();

    const sideQuests = await SideQuest.find({
      day,
      type: "side",
      active: true,
    })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      day,
      sideQuests,
    });
  } catch (error) {
    console.error(
      "Get side quests error:",
      error
    );

    return res.status(500).json({
      error: "Failed to get side quests",
    });
  }
}