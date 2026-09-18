// import { useEffect, useState } from "react";
// import DayTimer from "./DayTimer";

// export default function Day() {
//   const [gameDay, setGameDay] = useState(1);
//   const [currentDate, setCurrentDate] = useState(new Date());

//   useEffect(() => {
//     // Get onboarding time
//     let onboardingTime = localStorage.getItem("gameOnboardingTime");

//     // First time opening the game
//     if (!onboardingTime) {
//       onboardingTime = new Date().toISOString();

//       localStorage.setItem("gameOnboardingTime", onboardingTime);
//     }

//     const calculateGameDay = () => {
//       const now = new Date();
//       const onboarding = new Date(onboardingTime);

//       // Find the first 7:00 AM after onboarding
//       const first7AM = new Date(onboarding);
//       first7AM.setHours(7, 0, 0, 0);

//       // If onboarding happened after 7 AM,
//       // first 7 AM is tomorrow
//       if (onboarding >= first7AM) {
//         first7AM.setDate(first7AM.getDate() + 1);
//       }

//       // Before first 7 AM → Day 1
//       if (now < first7AM) {
//         setGameDay(1);
//       } else {
//         // Calculate how many 7 AM boundaries have passed
//         const millisecondsPerDay = 24 * 60 * 60 * 1000;

//         const daysPassed = Math.floor((now - first7AM) / millisecondsPerDay);

//         setGameDay(daysPassed + 2);
//       }

//       setCurrentDate(now);
//     };

//     // Run immediately
//     calculateGameDay();

//     // Check every minute
//     const timer = setInterval(calculateGameDay, 60 * 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const formattedDate = currentDate.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   return (
//     <div className="relative w-full mt-4">
//       {/* Wooden sign */}
//       <div className="relative w-[200px]">
//         <img src="/day.png" alt="" className="w-full" />

//         {/* Day + Date */}
//         <div className="absolute pt-6 inset-0 flex flex-col items-center justify-center">
//           <span className="text-taupe-800 text-3xl font-bold leading-none">
//             Day {gameDay}
//           </span>

//           <span className="text-black text-md font-bold mt-1 leading-none">
//             {formattedDate}
//           </span>
//         </div>
//       </div>

//       {/* Countdown Timer */}
//       <div className="mt-2">
//         <DayTimer />
//       </div>
//     </div>
//   );
// }

//Test

// import { useEffect, useState } from "react";
// import DayTimer from "./DayTimer";

// export default function Day() {
//   const [gameDay, setGameDay] = useState(1);
//   const [currentDate, setCurrentDate] = useState(new Date());

//   useEffect(() => {
//     // =========================
//     // TEST MODE
//     // =========================
//     const TEST_MODE = true;

//     // 30 seconds = 1 game day
//     const GAME_DAY_DURATION = 30 * 1000;

//     // =========================

//     let onboardingTime = localStorage.getItem(
//       "gameOnboardingTime"
//     );

//     // First time opening the game
//     if (!onboardingTime) {
//       onboardingTime = new Date().toISOString();

//       localStorage.setItem(
//         "gameOnboardingTime",
//         onboardingTime
//       );
//     }

//     const calculateGameDay = () => {
//       const now = new Date();
//       const onboarding = new Date(onboardingTime);

//       if (TEST_MODE) {
//         // Calculate test days
//         const timePassed = now - onboarding;

//         const daysPassed = Math.floor(
//           timePassed / GAME_DAY_DURATION
//         );

//         setGameDay(daysPassed + 1);
//       } else {
//         // =========================
//         // NORMAL 7 AM GAME DAY
//         // =========================

//         const first7AM = new Date(onboarding);

//         first7AM.setHours(7, 0, 0, 0);

//         if (onboarding >= first7AM) {
//           first7AM.setDate(
//             first7AM.getDate() + 1
//           );
//         }

//         if (now < first7AM) {
//           setGameDay(1);
//         } else {
//           const millisecondsPerDay =
//             24 * 60 * 60 * 1000;

//           const daysPassed = Math.floor(
//             (now - first7AM) /
//               millisecondsPerDay
//           );

//           setGameDay(daysPassed + 2);
//         }
//       }

//       setCurrentDate(now);
//     };

//     calculateGameDay();

//     // Update every second
//     const timer = setInterval(
//       calculateGameDay,
//       1000
//     );

//     return () => clearInterval(timer);
//   }, []);

//   const formattedDate =
//     currentDate.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });

//   return (
//     <div className="relative w-full mt-4">

//       {/* Wooden sign */}
//       <div className="relative w-[200px]">
//         <img
//           src="/day.png"
//           alt=""
//           className="w-full"
//         />

//         {/* Day + Date */}
//         <div className="absolute pt-6 inset-0 flex flex-col items-center justify-center">

//           <span className="text-taupe-800 text-3xl font-bold leading-none">
//             Day {gameDay}
//           </span>

//           <span className="text-black text-md font-bold mt-1 leading-none">
//             {formattedDate}
//           </span>

//         </div>
//       </div>

//       {/* Timer */}
//       <div className="mt-2">
//         <DayTimer
//           testMode={true}
//           gameDayDuration={30}
//         />
//       </div>

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import DayTimer from "./DayTimer";
import { getGameDay } from "../utils/gameDay";

export default function Day() {
  const [gameDay, setGameDay] = useState(getGameDay());
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const updateDay = () => {
      setGameDay(getGameDay());
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

      {/* Countdown Timer */}
      <div className="mt-2">
        <DayTimer testMode={false} gameDayDuration={30} />
      </div>
    </div>
  );
}
