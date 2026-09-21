import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getGameDay } from "../utils/gameDay";

export default function Task() {
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

  // Find day and night missions
  const dayMission = missions.find(
    (mission) => mission.session === "day"
  );

  const nightMission = missions.find(
    (mission) => mission.session === "night"
  );

  // Loading
  if (loading) {
    return (
      <section>
        <div className="mt-[80px]">
          Loading missions...
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section>
        <div className="mt-[80px]">
          {error}
        </div>
      </section>
    );
  }

  // No missions
  if (!dayMission && !nightMission) {
    console.log("No missions found for:", gameDay);

    return (
      <section>
        <div className="mt-[80px]">
          No missions available for Day {gameDay}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">

      {/* DAY MISSION */}
      {dayMission && (
        <div
          onClick={() => navigate("/mission/day")}
          className="border-3 rounded-sm mt-[80px] opacity-90 bg-amber-200 h-[100px] cursor-pointer"
        >
          <div className="flex border h-full p-3">

            <img
              className="w-[70px] my-auto h-max"
              src="/Book2.png"
              alt=""
            />

            <div className="leading-4 w-[200px] overflow-hidden mx-3">
              <h3 className="font-bold">
                Day Mission
              </h3>

              <h6>
                {dayMission.topic}
              </h6>

              <span>
                {dayMission.description}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* NIGHT MISSION */}
      {nightMission && (
        <div
          onClick={() => navigate("/mission/night")}
          className="border-3 rounded-sm opacity-90 bg-indigo-200 h-[100px] cursor-pointer"
        >
          <div className="flex border h-full p-3">

            <img
              className="w-[70px] my-auto h-max"
              src="/Book2.png"
              alt=""
            />

            <div className="leading-4 w-[200px] overflow-hidden mx-3">
              <h3 className="font-bold">
                Night Mission
              </h3>

              <h6>
                {nightMission.topic}
              </h6>

              <span>
                {nightMission.description}
              </span>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}