import { connectDB } from "../src/lib/db.js";
import Mission from "../src/models/Mission.js";

export default async function handler(req, res) {
  try {
    await connectDB();

    // GET /api/missions?day=1
    // GET /api/missions
    if (req.method === "GET") {
      const { day } = req.query;

      // If day is provided, return missions for that day
      if (day) {
        const dayNumber = Number(day);

        if (!Number.isInteger(dayNumber) || dayNumber < 1) {
          return res.status(400).json({
            success: false,
            error: "Invalid day",
          });
        }

        const missions = await Mission.find({
          day: dayNumber,
          active: true,
        }).sort({ session: 1 });

        return res.status(200).json({
          success: true,
          day: dayNumber,
          missions,
        });
      }

      // Otherwise return all active missions
      const missions = await Mission.find({
        active: true,
      }).sort({
        day: 1,
        session: 1,
      });

      return res.status(200).json({
        success: true,
        missions,
      });
    }

    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  } catch (error) {
    console.error("❌ Missions API error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to load missions",
    });
  }
}