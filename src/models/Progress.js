import mongoose from "mongoose";

const missionProgressSchema = new mongoose.Schema(
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

    result: {
      Vocabulary: {
        type: Number,
        default: null,
      },

      Grammar: {
        type: Number,
        default: null,
      },

      Pronunciation: {
        type: Number,
        default: null,
      },
    },

    reward: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const sideQuestProgressSchema = new mongoose.Schema(
  {
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SideQuest",
      required: true,
    },

    reward: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

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

    completedMissions: {
      type: [missionProgressSchema],
      default: [],
    },

    completedSideQuests: {
      type: [sideQuestProgressSchema],
      default: [],
    },

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