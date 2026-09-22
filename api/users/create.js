import { connectDB } from "../../src/lib/db.js";
import User from "../../src/models/User.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    const user = await User.create({
      name: name.trim(),
    });

    return res.status(201).json({
      success: true,
      userId: user._id.toString(),
      user: {
        id: user._id.toString(),
        name: user.name,
        gameStartedAt: user.gameStartedAt,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      error: "Failed to create user",
    });
  }
}