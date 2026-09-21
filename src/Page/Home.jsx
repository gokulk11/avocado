import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../Components/Header";
import Day from "../Components/Day";
import ProgressBar from "../Components/ProgressBar";
import Task from "../Components/Task";
import ExtraQuest from "../Components/ExtraQuest";

import { getGameDay } from "../utils/gameDay";

export default function Home() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [sideQuest, setSideQuest] = useState(null);

  // --------------------------------------------------
  // Current logged-in user
  // --------------------------------------------------

  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );

  const walkCompleted =
    localStorage.getItem("walkCompleted") === "true";

  const letterCompleted =
    localStorage.getItem("letterCompleted") === "true";

  const gameDay = Math.min(getGameDay(), 30);

  // --------------------------------------------------
  // Load today's progress and extra quest
  // --------------------------------------------------

  useEffect(() => {
    const loadHomeData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setLoadingProgress(false);
        return;
      }

      try {
        setLoadingProgress(true);

        const [progressResponse, questResponse] =
          await Promise.all([
            fetch(`/api/progress/${userId}`),
            fetch(`/api/side-quests/day?day=${gameDay}`),
          ]);

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();

          setProgress(progressData.progress || null);
        }

        if (questResponse.ok) {
          const questData = await questResponse.json();

          setSideQuest(
            questData.sideQuests?.[0] || null
          );
        }
      } catch (error) {
        console.error(
          "❌ Failed to load Home data:",
          error
        );
      } finally {
        setLoadingProgress(false);
      }
    };

    loadHomeData();
  }, [gameDay]);

  // --------------------------------------------------
  // Keep username in sync with localStorage
  // --------------------------------------------------

  useEffect(() => {
    const updateUserName = () => {
      setUserName(
        localStorage.getItem("userName") || ""
      );
    };

    updateUserName();

    window.addEventListener(
      "storage",
      updateUserName
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateUserName
      );
    };
  }, []);

  // --------------------------------------------------
  // Completion state
  // --------------------------------------------------

  const completedMissions =
    progress?.completedMissions || [];

  const completedSideQuests =
    progress?.completedSideQuests || [];

  const dayCompleted = completedMissions.some(
    (mission) =>
      mission.day === Number(gameDay) &&
      mission.session === "day"
  );

  const nightCompleted = completedMissions.some(
    (mission) =>
      mission.day === Number(gameDay) &&
      mission.session === "night"
  );

  const extraQuestCompleted =
    Boolean(sideQuest) &&
    completedSideQuests.some(
      (quest) =>
        String(quest.questId) ===
        String(sideQuest._id)
    );

  const allTodayCompleted =
    dayCompleted &&
    nightCompleted &&
    extraQuestCompleted;

  // --------------------------------------------------
  // First visit
  // --------------------------------------------------

  if (!walkCompleted) {
    return (
      <div className="p-2">
        <Header />

        <div className="min-h-[80vh] flex items-center justify-center">
          <button
            onClick={() => navigate("/walk")}
            className="px-6 py-3"
          >
            Go for a Walk
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Walk finished, but Letter not finished
  // --------------------------------------------------

  if (!letterCompleted) {
    return (
      <div className="p-2">
        <Header />

        <div className="min-h-[80vh] flex items-center justify-center">
          <button
            onClick={() => navigate("/letter")}
            className="px-6 py-3"
          >
            Start the Journey
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Trail button text
  // --------------------------------------------------

  const trailLabel = userName
    ? `🥑 ${userName}'s Trail`
    : "🥑 My Trail";

  // --------------------------------------------------
  // Normal game Home
  // --------------------------------------------------

  return (
    <div className="p-2">
      <Header />

      <Day />

      <ProgressBar />

      {/* --------------------------------------------- */}
      {/* User Trail */}
      {/* --------------------------------------------- */}

      <div className="mt-4">
        <button
          onClick={() => navigate("/trail")}
          className="w-full border-3 rounded-sm bg-yellow-200 px-4 py-3 font-bold cursor-pointer"
        >
          {trailLabel}
        </button>
      </div>

      {/* --------------------------------------------- */}
      {/* All today's missions completed */}
      {/* --------------------------------------------- */}

      {!loadingProgress && allTodayCompleted && (
        <div className="mt-5 mb-5 border-4 border-green-700 bg-green-200 rounded-lg p-5 text-center">
          <div className="text-4xl mb-2">
            🎉
          </div>

          <h2 className="text-xl font-bold">
            Hooray!
          </h2>

          <p className="font-bold mt-2">
            You've completed all today's missions!
          </p>

          <p className="text-sm mt-2">
            Great job! 🥑
          </p>

          <p className="text-sm mt-1">
            Come back tomorrow for a new adventure.
          </p>
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* Main Missions */}
      {/* --------------------------------------------- */}

      <Task
        progress={progress}
        gameDay={gameDay}
      />

      {/* --------------------------------------------- */}
      {/* Extra Quest */}
      {/* --------------------------------------------- */}

      <ExtraQuest
        progress={progress}
        gameDay={gameDay}
        sideQuest={sideQuest}
      />
    </div>
  );
}
