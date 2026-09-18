import { useNavigate, useParams } from "react-router-dom";
import missionsData from "../data/mission.json";
import { getGameDay } from "../utils/gameDay";

export default function Mission() {
  const navigate = useNavigate();
  const { type } = useParams();

  const gameDay = getGameDay();

  // Find current day's data
  const dayData = missionsData.mainMissions.find(
    (item) => item.id === `Day${gameDay}`,
  );

  // If no mission exists
  if (!dayData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h2>No mission available for Day {gameDay}</h2>
      </main>
    );
  }

  // Select Day or Night mission
  const mission = type === "day" ? dayData.DayMission : dayData.NightMission;

  return (
    <main className="min-h-screen bg-amber-100 p-5">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="border-2 border-black px-4 py-2 rounded-sm font-bold"
      >
        ← Back
      </button>

      {/* Mission content */}
      <div className="max-w-xl mx-auto mt-10">
        <p className="text-sm font-bold">DAY {gameDay}</p>

        <h1 className="text-3xl font-bold mt-2">
          {type === "day" ? "Day Mission" : "Night Mission"}
        </h1>

        <h2 className="text-2xl font-bold mt-8">{mission.topic}</h2>

        <p className="mt-4 text-lg leading-7">{mission.description}</p>

        {/* Start Mission */}
        <button className="mt-10 w-full border-3 border-black bg-amber-300 py-4 rounded-sm font-bold text-xl">
          Start Mission
        </button>
      </div>
    </main>
  );
}
