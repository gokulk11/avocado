const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env.local");
  process.exit(1);
}

const missionSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1,
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

const Mission =
  mongoose.models.Mission ||
  mongoose.model("Mission", missionSchema);

const missions = [
  {
    day: 1,
    dayTopic: "Greetings & Goodbyes",
    dayDescription:
      "Learn basic German greetings, goodbyes, and polite expressions.",
    nightTopic: "Introducing Yourself",
    nightDescription:
      "Practice saying your name, where you are from, and asking someone's name.",
  },
  {
    day: 2,
    dayTopic: "Numbers & Age",
    dayDescription:
      "Learn German numbers and practice talking about your age.",
    nightTopic: "Personal Information",
    nightDescription:
      "Practice sharing basic personal information in German.",
  },
  {
    day: 3,
    dayTopic: "Family",
    dayDescription:
      "Learn German words for family members and relationships.",
    nightTopic: "My Family",
    nightDescription:
      "Describe your family using simple German sentences.",
  },
  {
    day: 4,
    dayTopic: "Food & Drinks",
    dayDescription:
      "Learn common German vocabulary for food and drinks.",
    nightTopic: "Ordering Food",
    nightDescription:
      "Practice ordering food and drinks at a German restaurant.",
  },
  {
    day: 5,
    dayTopic: "Daily Routine",
    dayDescription:
      "Learn vocabulary for everyday activities and routines.",
    nightTopic: "My Day",
    nightDescription:
      "Describe your typical day using German sentences.",
  },
  {
    day: 6,
    dayTopic: "Time & Days",
    dayDescription:
      "Learn how to talk about time, days, and schedules.",
    nightTopic: "Making Plans",
    nightDescription:
      "Practice making simple plans with another person.",
  },
  {
    day: 7,
    dayTopic: "Places & Directions",
    dayDescription:
      "Learn vocabulary for common places and directions.",
    nightTopic: "Finding a Place",
    nightDescription:
      "Practice asking for and giving directions in German.",
  },
  {
    day: 8,
    dayTopic: "Shopping",
    dayDescription:
      "Learn useful German expressions for shopping.",
    nightTopic: "At the Store",
    nightDescription:
      "Practice asking about prices, sizes, and products.",
  },
  {
    day: 9,
    dayTopic: "German Sentence Building",
    dayDescription:
      "Learn the basic structure of German sentences.",
    nightTopic: "Questions & Answers",
    nightDescription:
      "Practice asking and answering simple questions in German.",
  },
  {
    day: 10,
    dayTopic: "Review & Conversation",
    dayDescription:
      "Review important German vocabulary from the first nine days.",
    nightTopic: "First German Conversation",
    nightDescription:
      "Have a short conversation using the German skills learned so far.",
  },
  {
    day: 11,
    dayTopic: "Home & Rooms",
    dayDescription:
      "Learn vocabulary for rooms and objects inside a home.",
    nightTopic: "Describing Your Home",
    nightDescription:
      "Describe your home and favorite room in German.",
  },
  {
    day: 12,
    dayTopic: "Hobbies & Free Time",
    dayDescription:
      "Learn vocabulary for hobbies and leisure activities.",
    nightTopic: "Talking About Hobbies",
    nightDescription:
      "Talk about what you like doing in your free time.",
  },
  {
    day: 13,
    dayTopic: "Weather",
    dayDescription:
      "Learn German expressions for different weather conditions.",
    nightTopic: "Talking About Weather",
    nightDescription:
      "Have a conversation about today's and tomorrow's weather.",
  },
  {
    day: 14,
    dayTopic: "Work & Jobs",
    dayDescription:
      "Learn vocabulary related to jobs and workplaces.",
    nightTopic: "Talking About Work",
    nightDescription:
      "Practice describing your job and workplace.",
  },
  {
    day: 15,
    dayTopic: "German Articles",
    dayDescription:
      "Learn how German articles der, die, and das are used.",
    nightTopic: "Articles in Sentences",
    nightDescription:
      "Practice choosing the correct German article in sentences.",
  },
  {
    day: 16,
    dayTopic: "Accusative Case",
    dayDescription:
      "Learn the basic use of the German accusative case.",
    nightTopic: "Accusative Practice",
    nightDescription:
      "Practice using accusative objects in everyday sentences.",
  },
  {
    day: 17,
    dayTopic: "Modal Verbs",
    dayDescription:
      "Learn common German modal verbs such as können, müssen, and wollen.",
    nightTopic: "Ability & Necessity",
    nightDescription:
      "Practice expressing what you can, must, and want to do.",
  },
  {
    day: 18,
    dayTopic: "Separable Verbs",
    dayDescription:
      "Learn how German separable verbs work.",
    nightTopic: "Separable Verb Practice",
    nightDescription:
      "Practice using common separable verbs in conversations.",
  },
  {
    day: 19,
    dayTopic: "Dative Case",
    dayDescription:
      "Learn the basic use of the German dative case.",
    nightTopic: "Dative Practice",
    nightDescription:
      "Practice using dative objects in everyday German.",
  },
  {
    day: 20,
    dayTopic: "Reflexive Verbs",
    dayDescription:
      "Learn common German reflexive verbs.",
    nightTopic: "Daily Life With Reflexive Verbs",
    nightDescription:
      "Describe your daily routine using reflexive verbs.",
  },
  {
    day: 21,
    dayTopic: "Past Tense",
    dayDescription:
      "Learn how to talk about completed actions in the past.",
    nightTopic: "Talking About Yesterday",
    nightDescription:
      "Describe what you did yesterday in German.",
  },
  {
    day: 22,
    dayTopic: "Travel & Transport",
    dayDescription:
      "Learn German vocabulary for travel and transportation.",
    nightTopic: "Travel Conversation",
    nightDescription:
      "Practice a conversation about planning and taking a trip.",
  },
  {
    day: 23,
    dayTopic: "Health & Body",
    dayDescription:
      "Learn vocabulary for body parts and common health problems.",
    nightTopic: "At the Doctor",
    nightDescription:
      "Practice explaining simple health problems to a doctor.",
  },
  {
    day: 24,
    dayTopic: "Comparisons",
    dayDescription:
      "Learn how to compare people, objects, and situations in German.",
    nightTopic: "Making Comparisons",
    nightDescription:
      "Practice making comparisons using German adjectives.",
  },
  {
    day: 25,
    dayTopic: "Future Plans",
    dayDescription:
      "Learn how to talk about future plans and intentions.",
    nightTopic: "My Future",
    nightDescription:
      "Talk about your plans for the coming weeks and months.",
  },
  {
    day: 26,
    dayTopic: "Opinions",
    dayDescription:
      "Learn German expressions for giving and explaining opinions.",
    nightTopic: "Agreeing & Disagreeing",
    nightDescription:
      "Practice agreeing and disagreeing politely in German.",
  },
  {
    day: 27,
    dayTopic: "Environment",
    dayDescription:
      "Learn German vocabulary related to nature and the environment.",
    nightTopic: "Environmental Problems",
    nightDescription:
      "Discuss simple environmental problems and possible solutions.",
  },
  {
    day: 28,
    dayTopic: "Technology",
    dayDescription:
      "Learn German vocabulary related to computers, phones, and technology.",
    nightTopic: "Technology Conversation",
    nightDescription:
      "Discuss how technology is used in everyday life.",
  },
  {
    day: 29,
    dayTopic: "Storytelling",
    dayDescription:
      "Learn useful expressions for telling stories in German.",
    nightTopic: "Tell a Story",
    nightDescription:
      "Tell a short personal story using German sentences.",
  },
  {
    day: 30,
    dayTopic: "Final Review",
    dayDescription:
      "Review the most important German vocabulary and grammar learned during the journey.",
    nightTopic: "Final German Conversation",
    nightDescription:
      "Complete a final German conversation using skills learned throughout the 30-day journey.",
  },
];

const demoMissions = [];

for (const item of missions) {
  demoMissions.push({
    day: item.day,
    type: "main",
    session: "day",
    topic: item.dayTopic,
    description: item.dayDescription,
    reward: 50,
    active: true,
  });

  demoMissions.push({
    day: item.day,
    type: "main",
    session: "night",
    topic: item.nightTopic,
    description: item.nightDescription,
    reward: 50,
    active: true,
  });
}

async function seedMissions() {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected.");

    await Mission.deleteMany({});

    console.log("🗑️ Existing missions removed.");

    const inserted = await Mission.insertMany(demoMissions);

    console.log(`✅ ${inserted.length} missions inserted.`);

    console.log("🎉 Demo mission seeding completed!");
  } catch (error) {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed.");
  }
}

seedMissions();