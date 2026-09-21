import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    currentDay: {
      type: Number,
      default: 1,
      min: 1,
      max: 30,
    },

    completedMissions: [
      {
        day: {
          type: Number,
          required: true,
          min: 1,
          max: 30,
        },

        session: {
          type: String,
          enum: ["day", "night"],
          required: true,
        },

        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    completedSideQuests: [
      {
        questId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SideQuest",
          required: true,
        },

        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    totalRewards: {
      type: Number,
      default: 0,
      min: 0,
    },

    streak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastActiveDate: {
      type: Date,
      default: null,
    },

    gameStartedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Progress ||
  mongoose.model("Progress", progressSchema);