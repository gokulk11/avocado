import { connectDB } from "../../src/lib/db.js";
import Progress from "../../src/models/Progress.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      userId,
      day,
      session,
      result,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    if (!day || !["day", "night"].includes(session)) {
      return res.status(400).json({
        error: "Valid day and session are required",
      });
    }

    await connectDB();

    const progress = await Progress.findOne({
      userId,
    });

    if (!progress) {
      return res.status(404).json({
        error: "Progress not found",
      });
    }

    const existingMission =
      progress.completedMissions.find(
        (mission) =>
          mission.day === Number(day) &&
          mission.session === session
      );

    // Don't reward the same mission twice
    if (existingMission) {
      return res.status(200).json({
        success: true,
        message: "Mission already completed",
        progress,
      });
    }

    const reward = 50;

    progress.completedMissions.push({
      day: Number(day),
      session,
      result: {
        Vocabulary:
          typeof result?.Vocabulary === "number"
            ? result.Vocabulary
            : null,

        Grammar:
          typeof result?.Grammar === "number"
            ? result.Grammar
            : null,

        Pronunciation:
          typeof result?.Pronunciation === "number"
            ? result.Pronunciation
            : null,
      },
      reward,
      completedAt: new Date(),
    });

    progress.totalRewards += reward;

    progress.lastActiveDate = new Date();

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Mission completed",
      progress,
    });
  } catch (error) {
    console.error(
      "Complete mission error:",
      error
    );

    return res.status(500).json({
      error: "Failed to complete mission",
    });
  }
}