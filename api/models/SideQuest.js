import mongoose from "mongoose";

const sideQuestSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["side"],
      default: "side",
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
      default: 20,
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

sideQuestSchema.index({
  day: 1,
});

export default mongoose.models.SideQuest ||
  mongoose.model("SideQuest", sideQuestSchema);