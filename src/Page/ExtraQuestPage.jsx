import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import extraQuestData from "../data/extraQuests.json";
import { getGameDay } from "../utils/gameDay";

export default function ExtraQuestPage() {
  const navigate = useNavigate();

  const [gameDay, setGameDay] = useState(getGameDay());

  useEffect(() => {
    const updateDay = () => {
      setGameDay(getGameDay());
    };

    updateDay();

    const timer = setInterval(updateDay, 1000);

    return () => clearInterval(timer);
  }, []);

  // Find current day's Extra Quest
  const dayData = extraQuestData.extraQuests.find(
    (item) => item.id === `Day${gameDay}`,
  );

  // No quest available
  if (!dayData || !dayData.quests.length) {
    return (
      <main className="min-h-screen bg-green-100 p-5">
        <button
          onClick={() => navigate("/")}
          className="border-2 border-black px-4 py-2 rounded-sm font-bold"
        >
          ← Home
        </button>

        <div className="min-h-[70vh] flex items-center justify-center">
          <h2 className="font-bold text-xl">
            No Extra Quest available for Day {gameDay}
          </h2>
        </div>
      </main>
    );
  }

  const quest = dayData.quests[0];

  return (
    <main className="min-h-screen bg-green-100 p-5">
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="border-2 border-black px-4 py-2 rounded-sm font-bold"
      >
        ← Home
      </button>

      <div className="max-w-xl mx-auto mt-10">
        {/* Day */}
        <p className="text-sm font-bold">DAY {gameDay}</p>

        {/* Page Title */}
        <h1 className="text-3xl font-bold mt-2">Extra Quest</h1>

        {/* Quest Card */}
        <div className="border-3 border-black bg-green-200 rounded-sm mt-8 p-5">
          <img
            src="/Book2.png"
            alt="Extra Quest"
            className="w-[100px] mx-auto"
          />

          <h2 className="text-2xl font-bold text-center mt-4">{quest.title}</h2>

          <p className="text-center mt-4">{quest.description}</p>
        </div>

        {/* Reward */}
        <div className="border-2 border-black bg-yellow-200 p-4 mt-6 text-center">
          <p className="font-bold">🥑 Reward</p>

          <p className="text-2xl font-bold">+{quest.reward} XP</p>
        </div>

        {/* Start Quest */}
        <button className="mt-8 w-full border-3 border-black bg-green-300 py-4 font-bold text-xl rounded-sm">
          Start Quest
        </button>
      </div>
    </main>
  );
}
