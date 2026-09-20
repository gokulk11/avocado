import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import missionData from "../data/mission.json";

export default function Trail() {
  const navigate = useNavigate();

  const missionResults = JSON.parse(
    localStorage.getItem("missionResults") || "{}"
  );

  const completedMissions = JSON.parse(
    localStorage.getItem("completedMissions") || "[]"
  );

  // Flatten all missions from every day
  const missions = useMemo(() => {
    const result = [];

    missionData.mainMissions.forEach((day) => {
      if (day.DayMission) {
        result.push({
          ...day.DayMission,
          day: day.id,
          type: "Day",
          missionId: `${day.id}-day`,
        });
      }

      if (day.NightMission) {
        result.push({
          ...day.NightMission,
          day: day.id,
          type: "Night",
          missionId: `${day.id}-night`,
        });
      }
    });

    return result;
  }, []);

  const getResult = (missionId) => {
    return missionResults[missionId]?.Result || null;
  };

  const isCompleted = (missionId) => {
    return completedMissions.includes(missionId);
  };

  const getAverage = (result) => {
    if (!result) return null;

    const values = [
      result.Vocabulary,
      result.Grammar,
      result.Pronunciation,
    ].filter((value) => typeof value === "number");

    if (!values.length) return null;

    return (
      values.reduce((sum, value) => sum + value, 0) / values.length
    ).toFixed(1);
  };

  const completedCount = missions.filter((mission) =>
    isCompleted(mission.missionId)
  ).length;

  const averageScore = (() => {
    const scores = missions
      .map((mission) => getAverage(getResult(mission.missionId)))
      .filter(Boolean)
      .map(Number);

    if (!scores.length) return "0.0";

    return (
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    ).toFixed(1);
  })();

  return (
    <div className="min-h-screen bg-[#123f35] text-white px-4 py-5 pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate("/")}
          className="
            bg-[#d59b54]
            border-4 border-black
            px-4 py-2
            text-black
            font-bold
            shadow-[4px_4px_0px_#000]
            active:translate-x-[2px]
            active:translate-y-[2px]
            active:shadow-none
          "
        >
          ← Back
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold">
            🥑 Avocado Deutsch
          </h1>

          <p className="text-sm text-green-200">
            MY LEARNING TRAIL
          </p>
        </div>

        <div className="w-[70px]" />
      </div>

      {/* Intro */}
      <div
        className="
          bg-[#075044]
          border-4 border-black
          p-4
          shadow-[5px_5px_0px_#000]
          mb-5
        "
      >
        <h2 className="text-xl font-bold mb-1">
          Your Journey So Far
        </h2>

        <p className="text-sm text-green-100">
          Look back at your missions, see your progress,
          and track your German journey.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2 mb-6">

        <StatCard
          icon="✓"
          value={completedCount}
          label="Completed"
        />

        <StatCard
          icon="⭐"
          value={averageScore}
          label="Average"
        />

        <StatCard
          icon="🎯"
          value={missions.length}
          label="Total Missions"
        />

        <StatCard
          icon="🥑"
          value={`${completedCount}/${missions.length}`}
          label="Progress"
        />

      </div>

      {/* Trail title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">
          Mission Trail
        </h2>

        <span className="text-xs text-green-200">
          {completedCount} completed
        </span>
      </div>

      {/* Mission list */}
      <div className="space-y-3">

        {missions.map((mission, index) => {
          const result = getResult(mission.missionId);
          const completed = isCompleted(mission.missionId);
          const average = getAverage(result);

          return (
            <MissionCard
              key={mission.missionId}
              mission={mission}
              result={result}
              completed={completed}
              average={average}
              index={index}
              onClick={() => {
                if (completed) {
                  navigate(`/mission/${mission.type.toLowerCase()}`);
                }
              }}
            />
          );
        })}

      </div>
    </div>
  );
}


/* ---------------- STAT CARD ---------------- */

function StatCard({ icon, value, label }) {
  return (
    <div
      className="
        bg-[#f5e7c8]
        text-black
        border-4 border-black
        p-3
        text-center
        shadow-[4px_4px_0px_#000]
      "
    >
      <div className="text-xl">{icon}</div>

      <div className="text-xl font-bold">
        {value}
      </div>

      <div className="text-xs font-bold">
        {label}
      </div>
    </div>
  );
}


/* ---------------- MISSION CARD ---------------- */

function MissionCard({
  mission,
  result,
  completed,
  average,
  index,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        border-4 border-black
        p-3
        flex
        gap-3
        items-center
        shadow-[4px_4px_0px_#000]
        ${
          completed
            ? "bg-[#f5e7c8] text-black cursor-pointer"
            : "bg-[#d1d5db] text-gray-700 opacity-90"
        }
      `}
    >

      {/* Day number */}
      <div
        className="
          w-12
          h-12
          shrink-0
          bg-[#176b48]
          border-2 border-black
          text-white
          flex
          flex-col
          items-center
          justify-center
          font-bold
        "
      >
        <span className="text-[10px]">
          DAY
        </span>

        <span className="text-lg">
          {mission.day.replace("Day", "")}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">

        <div className="flex justify-between items-start gap-2">

          <div>
            <h3 className="font-bold text-base">
              {mission.topic}
            </h3>

            <p className="text-xs opacity-70">
              {mission.type} Mission
            </p>
          </div>

          {/* Status */}
          <span
            className={`
              text-[10px]
              font-bold
              px-2
              py-1
              border-2 border-black
              whitespace-nowrap
              ${
                completed
                  ? "bg-green-500 text-black"
                  : "bg-gray-400 text-black"
              }
            `}
          >
            {completed ? "COMPLETED" : "LOCKED"}
          </span>

        </div>

        {/* Scores */}
        <div className="flex gap-1 mt-2 flex-wrap">

          <Score
            label="V"
            value={result?.Vocabulary}
          />

          <Score
            label="G"
            value={result?.Grammar}
          />

          <Score
            label="P"
            value={result?.Pronunciation}
          />

          {average && (
            <div
              className="
                ml-auto
                text-xs
                font-bold
                bg-yellow-300
                border-2 border-black
                px-2
                py-1
              "
            >
              ⭐ {average}
            </div>
          )}

        </div>

      </div>

      {/* Arrow */}
      {completed && (
        <div className="text-xl font-bold">
          →
        </div>
      )}

    </div>
  );
}


/* ---------------- SCORE ---------------- */

function Score({ label, value }) {
  return (
    <div
      className="
        bg-white
        border-2 border-black
        px-2
        py-1
        text-xs
        font-bold
      "
    >
      <span className="text-gray-500">
        {label}
      </span>{" "}
      {typeof value === "number" ? value : "-"}
    </div>
  );
}