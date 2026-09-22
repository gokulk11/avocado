import mongoose from "mongoose";
const missionSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },

    type: {
      type: String,
      enum: ["main"],
      default: "main",
    },

    session: {
      type: String,
      enum: ["day", "night"],
      required: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    reward: {
      type: Number,
      default: 50,
      min: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

missionSchema.index(
  { day: 1, session: 1 },
  { unique: true }
);

export default mongoose.models.Mission ||
  mongoose.model("Mission", missionSchema);