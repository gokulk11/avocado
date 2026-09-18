import { useEffect, useState } from "react";
import DayTimer from "./DayTimer";
import { getGameDay } from "../utils/gameDay";

export default function Day() {
  const [gameDay, setGameDay] = useState(getGameDay());
  const [currentDate, setCurrentDate] = useState(new Date());

  const MAX_GAME_DAY = 30;

  useEffect(() => {
    const updateDay = () => {
      setGameDay(Math.min(getGameDay(), MAX_GAME_DAY));
      setCurrentDate(new Date());
    };

    // Run immediately
    updateDay();

    // Check every second
    const timer = setInterval(updateDay, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative w-full mt-4">
      {/* Wooden sign */}
      <div className="relative w-[200px]">
        <img src="/day.png" alt="" className="w-full" />

        {/* Day + Date */}
        <div className="absolute pt-6 inset-0 flex flex-col items-center justify-center">
          <span className="text-taupe-800 text-3xl font-bold leading-none">
            Day {gameDay}
          </span>

          <span className="text-black text-md font-bold mt-1 leading-none">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Countdown Timer - Hidden on Day 30 */}
      {gameDay < MAX_GAME_DAY && (
        <div className="mt-2">
          <DayTimer testMode={false} gameDayDuration={30} />
        </div>
      )}
    </div>
  );
}
