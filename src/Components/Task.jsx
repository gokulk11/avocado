import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getGameDay } from "../utils/gameDay";

export default function Task({ progress }) {
  const navigate = useNavigate();

  const [gameDay, setGameDay] = useState(
    Math.min(getGameDay(), 30)
  );

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Update game day
  useEffect(() => {
    const updateDay = () => {
      const day = Math.min(getGameDay(), 30);
      setGameDay(day);
    };

    updateDay();

    const timer = setInterval(updateDay, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch missions from MongoDB API
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/missions/day?day=${gameDay}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch missions");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.error || "Failed to load missions"
          );
        }

        setMissions(data.missions || []);
      } catch (error) {
        console.error("Mission fetch error:", error);
        setError("Unable to load missions.");
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [gameDay]);

  const dayMission = missions.find(
    (mission) => mission.session === "day"
  );

  const nightMission = missions.find(
    (mission) => mission.session === "night"
  );

  const completedMissions =
    progress?.completedMissions || [];

  const isCompleted = (session) =>
    completedMissions.some(
      (mission) =>
        mission.day === Number(gameDay) &&
        mission.session === session
    );

  const dayCompleted = isCompleted("day");
  const nightCompleted = isCompleted("night");

  if (loading) {
    return (
      <section>
        <div className="mt-[80px]">
          Loading missions...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="mt-[80px]">
          {error}
        </div>
      </section>
    );
  }

  if (!dayMission && !nightMission) {
    return (
      <section>
        <div className="mt-[80px]">
          No missions available for Day {gameDay}
        </div>
      </section>
    );
  }

  const openMission = (session, completed) => {
    navigate(`/mission/${session}`, {
      state: {
        completed,
      },
    });
  };

  return (
    <section className="space-y-4">

      {/* DAY MISSION */}
      {dayMission && (
        <div
          onClick={() =>
            openMission("day", dayCompleted)
          }
          className={`border-3 rounded-sm mt-[80px] opacity-90 h-[100px] cursor-pointer ${
            dayCompleted
              ? "bg-green-200"
              : "bg-amber-200"
          }`}
        >
          <div className="flex border h-full p-3">

            <img
              className="w-[70px] my-auto h-max"
              src="/Book2.png"
              alt=""
            />

            <div className="leading-4 w-[200px] overflow-hidden mx-3">

              <div className="flex items-center justify-between">
                <h3 className="font-bold">
                  Day Mission
                </h3>

                {dayCompleted && (
                  <span className="text-green-700 font-bold">
                    ✓
                  </span>
                )}
              </div>

              <h6>{dayMission.topic}</h6>

              <span>{dayMission.description}</span>

              {dayCompleted && (
                <div className="text-green-700 font-bold mt-1">
                  ✅ Completed
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NIGHT MISSION */}
      {nightMission && (
        <div
          onClick={() =>
            openMission("night", nightCompleted)
          }
          className={`border-3 rounded-sm opacity-90 h-[100px] cursor-pointer ${
            nightCompleted
              ? "bg-green-200"
              : "bg-indigo-200"
          }`}
        >
          <div className="flex border h-full p-3">

            <img
              className="w-[70px] my-auto h-max"
              src="/Book2.png"
              alt=""
            />

            <div className="leading-4 w-[200px] overflow-hidden mx-3">

              <div className="flex items-center justify-between">
                <h3 className="font-bold">
                  Night Mission
                </h3>

                {nightCompleted && (
                  <span className="text-green-700 font-bold">
                    ✓
                  </span>
                )}
              </div>

              <h6>{nightMission.topic}</h6>

              <span>{nightMission.description}</span>

              {nightCompleted && (
                <div className="text-green-700 font-bold mt-1">
                  ✅ Completed
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
