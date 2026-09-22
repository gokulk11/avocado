import { connectDB } from "../../src/lib/db.js";
import Progress from "../../src/models/Progress.js";

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

    const progress = await Progress.findOne({
      userId,
    }).lean();

    if (!progress) {
      return res.status(404).json({
        error: "Progress not found",
      });
    }

    return res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Get progress error:", error);

    return res.status(500).json({
      error: "Failed to get progress",
    });
  }
}