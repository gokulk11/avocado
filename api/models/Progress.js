import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    missionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      required: true,
      index: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
    },

    result: {
      vocabulary: {
        type: Number,
        default: 0,
      },

      grammar: {
        type: Number,
        default: 0,
      },

      pronunciation: {
        type: Number,
        default: 0,
      },
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index(
  { userId: 1, missionId: 1 },
  { unique: true }
);

export default mongoose.models.Progress ||
  mongoose.model("Progress", progressSchema);