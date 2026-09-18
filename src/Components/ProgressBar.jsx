import { useEffect, useState } from "react";
import { getGameDay } from "../utils/gameDay";

export default function ProgressBar() {
  const [gameDay, setGameDay] = useState(getGameDay());

  const TOTAL_DAYS = 20;
  const TOTAL_BLOCKS = 10;

  useEffect(() => {
    const updateDay = () => {
      setGameDay(getGameDay());
    };

    updateDay();

    const timer = setInterval(updateDay, 1000);

    return () => clearInterval(timer);
  }, []);

  // 20 days = 10 blocks
  const filledBlocks = Math.min(
    Math.ceil(gameDay / 2),
    TOTAL_BLOCKS
  );

  return (
    <div className="flex flex-col items-end">
      <span className="text-white text-xs font-bold mb-1">
        🥑 XP
      </span>

      <div className="flex gap-[2px]">
        {[...Array(TOTAL_BLOCKS)].map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 border-2 border-black ${
              index < filledBlocks
                ? "bg-green-400"
                : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}