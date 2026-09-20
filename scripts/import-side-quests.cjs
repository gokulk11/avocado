const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: ".env",
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing.");
  process.exit(1);
}

const questPath = path.join(
  process.cwd(),
  "src",
  "data",
  "extraQuests.json"
);

if (!fs.existsSync(questPath)) {
  console.error("❌ extraQuests.json not found:");
  console.error(questPath);
  process.exit(1);
}

const questData = JSON.parse(
  fs.readFileSync(questPath, "utf-8")
);

const sideQuestSchema = new mongoose.Schema(
  {
    day: Number,
    type: {
      type: String,
      default: "side",
    },
    topic: String,
    description: String,
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

const SideQuest =
  mongoose.models.SideQuest ||
  mongoose.model("SideQuest", sideQuestSchema);

async function importSideQuests() {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected.");

    const sideQuests = [];

    /*
     * Handles:
     *
     * extraQuests: [...]
     *
     * or
     *
     * sideQuests: [...]
     */
    const quests =
      questData.extraQuests ||
      questData.sideQuests ||
      [];

    for (const quest of quests) {
      let dayNumber;

      if (typeof quest.day === "number") {
        dayNumber = quest.day;
      } else if (typeof quest.day === "string") {
        dayNumber = Number(
          quest.day.replace("Day", "")
        );
      } else if (quest.id) {
        dayNumber = Number(
          String(quest.id).replace("Day", "")
        );
      }

      if (!dayNumber || Number.isNaN(dayNumber)) {
        console.warn(
          "⚠️ Could not determine day for quest:",
          quest
        );

        continue;
      }

      sideQuests.push({
        day: dayNumber,

        type: "side",

        topic:
          quest.topic ||
          quest.title ||
          "Side Quest",

        description:
          quest.description || "",

        reward: quest.reward || 20,

        active: true,
      });
    }

    console.log(
      `📦 Found ${sideQuests.length} side quests.`
    );

    /*
     * Clear previously imported side quests
     * so running the script again doesn't
     * create duplicates.
     */
    await SideQuest.deleteMany({
      type: "side",
    });

    const inserted =
      await SideQuest.insertMany(sideQuests);

    console.log(
      `✅ Imported ${inserted.length} side quests.`
    );

    console.log(
      "🎉 Side quest migration completed!"
    );
  } catch (error) {
    console.error(
      "❌ Side quest migration failed:",
      error
    );
  } finally {
    await mongoose.disconnect();

    console.log(
      "🔌 MongoDB connection closed."
    );
  }
}

importSideQuests();