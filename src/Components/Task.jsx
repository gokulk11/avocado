import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import missionsData from "../data/mission.json";
import { getGameDay } from "../utils/gameDay";

export default function Task() {
  const navigate = useNavigate();

  const [gameDay, setGameDay] = useState(Math.min(getGameDay(), 30));

  useEffect(() => {
    const updateDay = () => {
      const day = Math.min(getGameDay(), 30);
      setGameDay(day);
    };

    updateDay();

    const timer = setInterval(updateDay, 1000);

    return () => clearInterval(timer);
  }, []);

  // Find current day's data
  const dayData = missionsData.mainMissions.find(
    (item) => item.id === `Day${gameDay}`,
  );

  // No mission
  if (!dayData) {
    console.log("Missing mission for:", `Day${gameDay}`);
    console.log(
      "Available days:",
      missionsData.mainMissions.map((item) => item.id),
    );

    return (
      <section>
        <div className="mt-[80px]">No missions available for Day {gameDay}</div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* DAY MISSION */}
      <div
        onClick={() => navigate("/mission/day")}
        className="border-3 rounded-sm mt-[80px] opacity-90 bg-amber-200 h-[100px] cursor-pointer"
      >
        <div className="flex border h-full p-3">
          <img className="w-[70px] my-auto h-max" src="/Book2.png" alt="" />

          <div className="leading-4 w-[200px] overflow-hidden mx-3">
            <h3 className=" font-bold">Day Mission</h3>

            <h6>{dayData.DayMission.topic}</h6>

            <span>{dayData.DayMission.description}</span>
          </div>
        </div>
      </div>

      {/* NIGHT MISSION */}
      <div
        onClick={() => navigate("/mission/night")}
        className="border-3 rounded-sm opacity-90 bg-indigo-200 h-[100px] cursor-pointer"
      >
        <div className="flex border h-full p-3">
          <img className="w-[70px] my-auto h-max" src="/Book2.png" alt="" />

          <div className="leading-4 w-[200px] overflow-hidden mx-3">
            <h3 className=" font-bold">Night Mission</h3>

            <h6>{dayData.NightMission.topic}</h6>

            <span>{dayData.NightMission.description}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
