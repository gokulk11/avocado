import { useEffect, useState } from "react";
import { getGameDay } from "../utils/gameDay";

function Header() {
  const [avocadoState, setAvocadoState] = useState("young");

  async function loadAvocadoState() {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setAvocadoState("young");
        return;
      }

      const gameDay = Math.min(getGameDay(), 30);

      const response = await fetch(`/api/progress/${userId}`);

      if (!response.ok) {
        console.log("Progress not found");
        setAvocadoState("young");
        return;
      }

      const data = await response.json();

      const completedMissions =
        data.progress?.completedMissions || [];

      let missedDays = 0;

      // Check previous days only.
      // Today's missions do NOT affect today's avocado.
      for (let day = gameDay - 1; day >= 1; day--) {
        const dayCompleted = completedMissions.some(
          (mission) =>
            Number(mission.day) === day &&
            mission.session === "day"
        );

        const nightCompleted = completedMissions.some(
          (mission) =>
            Number(mission.day) === day &&
            mission.session === "night"
        );

        // A day is completed ONLY when
        // both day and night missions are completed.
        if (dayCompleted && nightCompleted) {
          break;
        }

        missedDays++;
      }

      if (missedDays === 0) {
        setAvocadoState("young");
      } else if (missedDays === 1) {
        setAvocadoState("50");
      } else if (missedDays === 2) {
        setAvocadoState("70");
      } else {
        setAvocadoState("100");
      }
    } catch (error) {
      console.error("Failed to load avocado state:", error);
      setAvocadoState("young");
    }
  }

  useEffect(() => {
    // Load when Header first appears
    loadAvocadoState();

    // Listen for the new game day
    const handleGameDayChanged = () => {
      loadAvocadoState();
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

  const avocadoImages = {
    young: "/young8bit.png",
    50: "../50.png",
    70: "../75.png",
    100: "../100.png",
  };

  const avocadoLabels = {
    young: "Young",
    50: "50%",
    70: "70%",
    100: "100%",
  };

  return (
    <div className="flex justify-between p-2">

      {/* Logo */}
      <div className="flex">
        <img
          className="w-[50px]"
          src="/flaggerman.svg"
          alt=""
        />

        <div className="flex flex-col justify-center leading-[18px] ml-3">
          <span className="font-extrabold text-white text-[20px]">
            Avocado
          </span>

          <span className="font-extrabold text-white text-[20px]">
            Deutsch
          </span>
        </div>
      </div>

      {/* Avocado */}
      <div className="flex flex-col justify-center items-center">
        <img
          className="w-[30px]"
          src={avocadoImages[avocadoState]}
          alt="Avocado"
        />

        <span className="text-[10px] font-bold text-gray-700">
          {avocadoLabels[avocadoState]}
        </span>
      </div>

    </div>
  );
}

export default Header;