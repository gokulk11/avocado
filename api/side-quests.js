import { connectDB } from "../src/lib/db.js";
import SideQuest from "./models/SideQuest.js";

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    // GET /api/side-quests?day=1
    // GET /api/side-quests

    const { day } = req.query;

    if (day) {
      const dayNumber = Number(day);

      if (!Number.isInteger(dayNumber) || dayNumber < 1) {
        return res.status(400).json({
          success: false,
          error: "Invalid day",
        });
      }

      const sideQuests = await SideQuest.find({
        day: dayNumber,
        active: true,
      }).sort({ createdAt: 1 });

      return res.status(200).json({
        success: true,
        day: dayNumber,
        sideQuests,
      });
    }

    const sideQuests = await SideQuest.find({
      active: true,
    }).sort({
      day: 1,
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      sideQuests,
    });
  } catch (error) {
    console.error("❌ Side Quest API error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to load side quests",
    });
  }
}