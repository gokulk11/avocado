// import { useEffect, useState } from "react";

// export default function DayTimer() {
//   const [timeLeft, setTimeLeft] = useState("00:00:00");

//   useEffect(() => {
//     const updateTimer = () => {
//       const now = new Date();

//       // Find today's 7:00 AM
//       const next7AM = new Date(now);
//       next7AM.setHours(7, 0, 0, 0);

//       // If 7 AM has already passed,
//       // countdown to tomorrow's 7 AM
//       if (now >= next7AM) {
//         next7AM.setDate(next7AM.getDate() + 1);
//       }

//       const difference = next7AM - now;

//       const totalSeconds = Math.floor(difference / 1000);

//       const hours = Math.floor(totalSeconds / 3600);
//       const minutes = Math.floor((totalSeconds % 3600) / 60);
//       const seconds = totalSeconds % 60;

//       setTimeLeft(
//         `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//           2,
//           "0",
//         )}:${String(seconds).padStart(2, "0")}`,
//       );
//     };

//     updateTimer();

//     // Update every second
//     const timer = setInterval(updateTimer, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="text-center">
//       <div className="text-xs font-bold">NEXT DAY</div>

//       <div className="text-xl font-bold tracking-wider">{timeLeft}</div>
//     </div>
//   );
// }



//Test

import { useEffect, useState } from "react";

export default function DayTimer({
  testMode = false,
  gameDayDuration = 30,
}) {
  const [timeLeft, setTimeLeft] = useState(
    "00:00:00"
  );

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();

      let difference;

      if (testMode) {
        // Get onboarding time
        const onboardingTime =
          localStorage.getItem(
            "gameOnboardingTime"
          );

        if (!onboardingTime) return;

        const onboarding = new Date(
          onboardingTime
        );

        // Time passed since game started
        const timePassed =
          now - onboarding;

        // Find position inside current
        // 30-second game day
        const elapsed =
          timePassed % (gameDayDuration * 1000);

        difference =
          gameDayDuration * 1000 - elapsed;
      } else {
        // =========================
        // NORMAL MODE
        // Countdown to 7 AM
        // =========================

        const next7AM = new Date(now);

        next7AM.setHours(7, 0, 0, 0);

        if (now >= next7AM) {
          next7AM.setDate(
            next7AM.getDate() + 1
          );
        }

        difference =
          next7AM.getTime() - now.getTime();
      }

      const totalSeconds = Math.floor(
        difference / 1000
      );

      const hours = Math.floor(
        totalSeconds / 3600
      );

      const minutes = Math.floor(
        (totalSeconds % 3600) / 60
      );

      const seconds =
        totalSeconds % 60;

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`
      );
    };

    updateTimer();

    const timer = setInterval(
      updateTimer,
      1000
    );

    return () => clearInterval(timer);
  }, [testMode, gameDayDuration]);

  return (
    <div className="text-center">

      <div className="text-xs font-bold">
        NEXT DAY
      </div>

      <div className="text-xl font-bold tracking-wider">
        {timeLeft}
      </div>

    </div>
  );
}
