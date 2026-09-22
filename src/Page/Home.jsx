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

  const walkCompleted =
    localStorage.getItem("walkCompleted") === "true";

  const letterCompleted =
    localStorage.getItem("letterCompleted") === "true";

  const userName =
    localStorage.getItem("userName") || "";

  const gameDay = Math.min(getGameDay(), 30);

  const cacheKey = `homeData_day_${gameDay}`;

  const [progress, setProgress] = useState(null);
  const [missions, setMissions] = useState([]);
  const [sideQuest, setSideQuest] = useState(null);

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [error, setError] = useState("");

  // Used to force Home to refresh when
  // the game day changes.
  const [dayRefresh, setDayRefresh] = useState(0);

  // --------------------------------------------------
  // Listen for game day change
  // --------------------------------------------------

  useEffect(() => {
    const handleGameDayChanged = () => {
      console.log("⏰ Game day changed!");

      // Clear old day's data
      setProgress(null);
      setMissions([]);
      setSideQuest(null);

      setError("");
      setInitialLoading(true);

      // Force this component to render again.
      // getGameDay() will now return the new day.
      setDayRefresh((prev) => prev + 1);
    };

    window.addEventListener(
      "gameDayChanged",
      handleGameDayChanged
    );

    return () => {
      window.removeEventListener(
        "gameDayChanged",
        handleGameDayChanged
      );
    };
  }, []);

  // --------------------------------------------------
  // Load cached data immediately
  // --------------------------------------------------

  useEffect(() => {
    try {
      const cached =
        sessionStorage.getItem(cacheKey);

      if (cached) {
        const data = JSON.parse(cached);

        setProgress(data.progress || null);
        setMissions(data.missions || []);
        setSideQuest(data.sideQuest || null);

        setInitialLoading(false);
      }
    } catch (error) {
      console.error(
        "Failed to read Home cache:",
        error
      );
    }
  }, [cacheKey]);

  // --------------------------------------------------
  // Fetch fresh Home data
  // --------------------------------------------------

  useEffect(() => {
    if (!walkCompleted || !letterCompleted) {
      setInitialLoading(false);
      return;
    }

    const loadHomeData = async () => {
      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        setError("User not found.");
        setInitialLoading(false);
        return;
      }

      try {
        setError("");

        const [
          progressResponse,
          missionsResponse,
          questResponse,
        ] = await Promise.all([
          fetch(`/api/progress/${userId}`),

          fetch(
            `/api/missions?day=${gameDay}`
          ),

          fetch(
            `/api/side-quests?day=${gameDay}`
          ),
        ]);

        if (!progressResponse.ok) {
          throw new Error(
            "Failed to load progress."
          );
        }

        if (!missionsResponse.ok) {
          throw new Error(
            "Failed to load missions."
          );
        }

        const progressData =
          await progressResponse.json();

        const missionsData =
          await missionsResponse.json();

        let questData = {
          sideQuests: [],
        };

        if (questResponse.ok) {
          questData =
            await questResponse.json();
        }

        const freshData = {
          progress:
            progressData.progress || null,

          missions:
            missionsData.missions || [],

          sideQuest:
            questData.sideQuests?.[0] || null,
        };

        // Update UI
        setProgress(freshData.progress);
        setMissions(freshData.missions);
        setSideQuest(freshData.sideQuest);

        // Save today's data in cache
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify(freshData)
        );
      } catch (error) {
        console.error(
          "❌ Failed to load Home data:",
          error
        );

        // Only show error if there is
        // no useful cached data.
        if (
          !sessionStorage.getItem(cacheKey)
        ) {
          setError(
            error.message ||
              "Unable to load today's missions."
          );
        }
      } finally {
        setInitialLoading(false);
      }
    };

    loadHomeData();
  }, [
    cacheKey,
    gameDay,
    walkCompleted,
    letterCompleted,
    dayRefresh,
  ]);

  // --------------------------------------------------
  // First visit
  // --------------------------------------------------

  if (!walkCompleted) {
    return (
      <div className="p-2">
        <Header />

        <div className="min-h-[80vh] flex items-center justify-center">
          <button
            onClick={() =>
              navigate("/walk")
            }
            className="px-6 py-3"
          >
            Go for a Walk
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Letter not completed
  // --------------------------------------------------

  if (!letterCompleted) {
    return (
      <div className="p-2">
        <Header />

        <div className="min-h-[80vh] flex items-center justify-center">
          <button
            onClick={() =>
              navigate("/letter")
            }
            className="px-6 py-3"
          >
            Start the Journey
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Completion state
  // --------------------------------------------------

  const completedMissions =
    progress?.completedMissions || [];

  const completedSideQuests =
    progress?.completedSideQuests || [];

  // Day mission completed?
  const dayCompleted =
    completedMissions.some(
      (mission) =>
        Number(mission.day) ===
          Number(gameDay) &&
        mission.session === "day"
    );

  // Night mission completed?
  const nightCompleted =
    completedMissions.some(
      (mission) =>
        Number(mission.day) ===
          Number(gameDay) &&
        mission.session === "night"
    );

  // Extra quest completed?
  const extraQuestCompleted =
    Boolean(sideQuest) &&
    completedSideQuests.some(
      (quest) =>
        String(quest.questId) ===
        String(sideQuest._id)
    );

  // Everything completed
  const allTodayCompleted =
    dayCompleted &&
    nightCompleted &&
    extraQuestCompleted;

  const trailLabel = userName
    ? `🥑 ${userName}'s Trail`
    : "🥑 My Trail";

  // --------------------------------------------------
  // Home
  // --------------------------------------------------

  return (
    <div className="p-2">

      <Header />

      <Day />

      <ProgressBar />

      {/* Trail */}
      <div className="mt-4">
        <button
          onClick={() =>
            navigate("/trail")
          }
          className="w-full border-3 rounded-sm bg-yellow-200 px-4 py-3 font-bold cursor-pointer"
        >
          {trailLabel}
        </button>
      </div>

      {/* Loading */}
      {initialLoading && (
        <div className="mt-8 text-center font-bold">
          Loading today's adventure... 🥑
        </div>
      )}

      {/* Error */}
      {!initialLoading &&
        error &&
        missions.length === 0 && (
          <div className="mt-8 border-3 rounded-sm bg-red-100 p-4 text-center">
            {error}
          </div>
        )}

      {/* Content */}
      {!initialLoading && (
        <>
          {/* All today's missions completed */}
          {allTodayCompleted && (
            <div className="mt-5 mb-5 border-4 border-green-700 bg-green-200 rounded-lg p-5 text-center">
              <div className="text-4xl mb-2">
                🎉
              </div>

              <h2 className="text-xl font-bold">
                Hooray!
              </h2>

              <p className="font-bold mt-2">
                You've completed all today's
                missions!
              </p>

              <p className="text-sm mt-2">
                Great job! 🥑
              </p>

              <p className="text-sm mt-1">
                Come back tomorrow for a new
                adventure.
              </p>
            </div>
          )}

          <Task
            missions={missions}
            progress={progress}
            gameDay={gameDay}
          />

          <ExtraQuest
            sideQuest={sideQuest}
            progress={progress}
          />
        </>
      )}
    </div>
  );
}