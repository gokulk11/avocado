import { connectDB } from "../db.js";
import Mission from "../models/Mission.js";

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

    const missions = await Mission.find({
      day,
      type: "main",
      active: true,
    })
      .sort({ session: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      day,
      missions,
    });
  } catch (error) {
    console.error(
      "Get missions error:",
      error
    );

    return res.status(500).json({
      error: "Failed to get missions",
    });
  }
}