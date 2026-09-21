import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Trail() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [missions, setMissions] = useState([]);
  const [sideQuests, setSideQuests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------
  // Get logged-in user
  // --------------------------------

  const userId = localStorage.getItem("userId");

  // --------------------------------
  // Fetch player data
  // --------------------------------

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError("No logged-in user found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Get user
        const userResponse = await fetch(
          `/api/users/${userId}`
        );

        if (!userResponse.ok) {
          throw new Error("Failed to load user");
        }

        const userData = await userResponse.json();

        // Get progress
        const progressResponse = await fetch(
          `/api/progress/${userId}`
        );

        if (!progressResponse.ok) {
          throw new Error("Failed to load progress");
        }

        const progressData = await progressResponse.json();

        // Get missions
        const missionsResponse = await fetch(
          `/api/missions`
        );

        if (!missionsResponse.ok) {
          throw new Error("Failed to load missions");
        }

        const missionsData = await missionsResponse.json();

        // Get side quests
        const sideQuestResponse = await fetch(
          `/api/side-quests`
        );

        if (!sideQuestResponse.ok) {
          throw new Error("Failed to load side quests");
        }

        const sideQuestData =
          await sideQuestResponse.json();

        setUser(userData.user);
        setProgress(progressData.progress);
        setMissions(missionsData.missions || []);
        setSideQuests(
          sideQuestData.sideQuests || []
        );
      } catch (error) {
        console.error(
          "Trail loading error:",
          error
        );

        setError(
          error.message ||
            "Failed to load learning trail."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // --------------------------------
  // Main mission completion check
  // --------------------------------

  const isMissionCompleted = (day, session) => {
    if (!progress?.completedMissions) {
      return false;
    }

    return progress.completedMissions.some(
      (mission) =>
        mission.day === day &&
        mission.session === session
    );
  };

  // --------------------------------
  // Side quest completion check
  // --------------------------------

  const isSideQuestCompleted = (questId) => {
    if (!progress?.completedSideQuests) {
      return false;
    }

    return progress.completedSideQuests.some(
      (quest) =>
        String(quest.questId) === String(questId)
    );
  };

  // --------------------------------
  // Group missions by day
  // --------------------------------

  const missionsByDay = useMemo(() => {
    const days = {};

    missions.forEach((mission) => {
      if (!days[mission.day]) {
        days[mission.day] = {
          day: mission.day,
          dayMission: null,
          nightMission: null,
        };
      }

      if (mission.session === "day") {
        days[mission.day].dayMission =
          mission;
      }

      if (mission.session === "night") {
        days[mission.day].nightMission =
          mission;
      }
    });

    return Object.values(days).sort(
      (a, b) => a.day - b.day
    );
  }, [missions]);

  // --------------------------------
  // Statistics
  // --------------------------------

  const completedMainMissions =
    progress?.completedMissions?.length || 0;

  const completedSideQuests =
    progress?.completedSideQuests?.length || 0;

  const totalMissions =
    missions.length;

  const totalSideQuests =
    sideQuests.length;

  const totalCompleted =
    completedMainMissions +
    completedSideQuests;

  const totalAvailable =
    totalMissions +
    totalSideQuests;

  const progressPercentage =
    totalAvailable > 0
      ? Math.round(
          (totalCompleted /
            totalAvailable) *
            100
        )
      : 0;

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#123f35] text-white flex items-center justify-center">
        <p className="font-bold">
          Loading your learning trail...
        </p>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-[#123f35] text-white flex flex-col items-center justify-center px-4">
        <p className="text-red-300 font-bold mb-4">
          {error}
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-[#d59b54] border-4 border-black px-4 py-2 text-black font-bold shadow-[4px_4px_0px_#000]"
        >
          ← Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#123f35] text-white px-4 py-5 pb-24">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

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

      {/* -------------------------------- */}
      {/* Player */}
      {/* -------------------------------- */}

      <div
        className="
          bg-[#075044]
          border-4 border-black
          p-4
          shadow-[5px_5px_0px_#000]
          mb-5
        "
      >
        <p className="text-xs text-green-200">
          PLAYER
        </p>

        <h2 className="text-2xl font-bold">
          👋 {user?.name || "Player"}
        </h2>

        <p className="text-sm text-green-100 mt-1">
          Your German learning journey
        </p>
      </div>

      {/* -------------------------------- */}
      {/* Statistics */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-2 gap-2 mb-4">

        <StatCard
          icon="📚"
          value={completedMainMissions}
          label="Main Completed"
        />

        <StatCard
          icon="⭐"
          value={completedSideQuests}
          label="Side Completed"
        />

        <StatCard
          icon="✓"
          value={totalCompleted}
          label="Total Completed"
        />

        <StatCard
          icon="🥑"
          value={`${progressPercentage}%`}
          label="Overall Progress"
        />

      </div>

      {/* -------------------------------- */}
      {/* Progress Bar */}
      {/* -------------------------------- */}

      <div
        className="
          bg-[#f5e7c8]
          border-4 border-black
          p-3
          shadow-[4px_4px_0px_#000]
          mb-6
        "
      >
        <div className="flex justify-between text-black text-xs font-bold mb-2">
          <span>JOURNEY PROGRESS</span>

          <span>
            {totalCompleted}/{totalAvailable}
          </span>
        </div>

        <div className="h-5 bg-gray-300 border-2 border-black">
          <div
            className="h-full bg-green-500"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* -------------------------------- */}
      {/* Journey */}
      {/* -------------------------------- */}

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">
          Mission Trail
        </h2>

        <span className="text-xs text-green-200">
          {completedMainMissions}/{totalMissions}
        </span>
      </div>

      {/* -------------------------------- */}
      {/* Days */}
      {/* -------------------------------- */}

      <div className="space-y-4">

        {missionsByDay.map((day) => {

          const dayCompleted =
            day.dayMission &&
            isMissionCompleted(
              day.day,
              "day"
            );

          const nightCompleted =
            day.nightMission &&
            isMissionCompleted(
              day.day,
              "night"
            );

          const daySideQuests =
            sideQuests.filter(
              (quest) =>
                quest.day === day.day
            );

          return (
            <div
              key={day.day}
              className="
                bg-[#075044]
                border-4 border-black
                p-3
                shadow-[4px_4px_0px_#000]
              "
            >

              {/* Day header */}

              <div className="flex items-center gap-3 mb-3">

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
                    {day.day}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Day {day.day}
                  </h3>

                  <p className="text-xs text-green-200">
                    Your progress
                  </p>
                </div>

              </div>

              {/* Day Mission */}

              {day.dayMission && (
                <ProgressItem
                  title={day.dayMission.topic}
                  type="Day Mission"
                  completed={dayCompleted}
                  onClick={() => {
                    if (dayCompleted) {
                      navigate("/mission/day");
                    }
                  }}
                />
              )}

              {/* Night Mission */}

              {day.nightMission && (
                <ProgressItem
                  title={day.nightMission.topic}
                  type="Night Mission"
                  completed={nightCompleted}
                  onClick={() => {
                    if (nightCompleted) {
                      navigate("/mission/night");
                    }
                  }}
                />
              )}

              {/* Side Quests */}

              {daySideQuests.map((quest) => {
                const completed =
                  isSideQuestCompleted(
                    quest._id
                  );

                return (
                  <ProgressItem
                    key={quest._id}
                    title={
                      quest.topic ||
                      "Side Quest"
                    }
                    type="Side Quest"
                    completed={completed}
                    onClick={() => {
                      if (completed) {
                        navigate(
                          "/extra-quest"
                        );
                      }
                    }}
                  />
                );
              })}

              {/* If nothing completed */}

              {!dayCompleted &&
                !nightCompleted &&
                daySideQuests.every(
                  (quest) =>
                    !isSideQuestCompleted(
                      quest._id
                    )
                ) && (
                  <div className="mt-3 bg-red-200 text-black border-2 border-black p-2 text-xs font-bold">
                    No missions completed yet.
                  </div>
                )}

            </div>
          );
        })}

      </div>
    </div>
  );
}


/* -------------------------------- */
/* STAT CARD */
/* -------------------------------- */

function StatCard({
  icon,
  value,
  label,
}) {
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
      <div className="text-xl">
        {icon}
      </div>

      <div className="text-xl font-bold">
        {value}
      </div>

      <div className="text-xs font-bold">
        {label}
      </div>
    </div>
  );
}


/* -------------------------------- */
/* PROGRESS ITEM */
/* -------------------------------- */

function ProgressItem({
  title,
  type,
  completed,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        border-2
        border-black
        p-3
        mb-2
        flex
        items-center
        gap-3
        ${
          completed
            ? "bg-[#f5e7c8] text-black cursor-pointer"
            : "bg-gray-300 text-gray-700"
        }
      `}
    >

      {/* Status */}

      <div
        className={`
          w-8
          h-8
          shrink-0
          border-2
          border-black
          flex
          items-center
          justify-center
          font-bold
          ${
            completed
              ? "bg-green-500 text-black"
              : "bg-gray-400 text-black"
          }
        `}
      >
        {completed ? "✓" : "!"}
      </div>

      {/* Content */}

      <div className="flex-1 min-w-0">

        <p className="text-[10px] font-bold uppercase opacity-60">
          {type}
        </p>

        <h4 className="font-bold text-sm">
          {title}
        </h4>

      </div>

      {/* Status text */}

      <span
        className={`
          text-[9px]
          font-bold
          px-2
          py-1
          border-2
          border-black
          whitespace-nowrap
          ${
            completed
              ? "bg-green-500 text-black"
              : "bg-red-300 text-black"
          }
        `}
      >
        {completed
          ? "COMPLETED"
          : "NOT COMPLETED"}
      </span>

    </div>
  );
}