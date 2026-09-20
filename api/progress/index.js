import connectDB from "../lib/mongodb";
import Progress from "../models/Progress";

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === "GET") {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "userId is required",
        });
      }

      const progress = await Progress.find({
        userId,
      })
        .populate("missionId")
        .sort({ createdAt: 1 })
        .lean();

      return res.status(200).json({
        success: true,
        progress,
      });
    }

    if (req.method === "POST") {
      const {
        userId,
        missionId,
        completed,
        score,
        result,
      } = req.body;

      if (!userId || !missionId) {
        return res.status(400).json({
          success: false,
          message: "userId and missionId are required",
        });
      }

      const progress = await Progress.findOneAndUpdate(
        {
          userId,
          missionId,
        },
        {
          userId,
          missionId,
          completed: completed ?? false,
          score: score ?? 0,
          result: result ?? {},
          completedAt: completed ? new Date() : undefined,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      return res.status(200).json({
        success: true,
        progress,
      });
    }

    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}