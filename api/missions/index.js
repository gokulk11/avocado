import { connectDB } from "../db.js";
import Mission from "../models/Mission.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const missions = await Mission.find({
      type: "main",
      active: true,
    })
      .sort({ day: 1, session: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      missions,
    });
  } catch (error) {
    console.error("Get all missions error:", error);

    return res.status(500).json({
      error: "Failed to get missions",
    });
  }
}