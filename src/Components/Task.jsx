import { useNavigate } from "react-router-dom";

export default function Task({
  missions = [],
  progress,
  gameDay,
}) {
  const navigate = useNavigate();

  // Data is loaded by Home.jsx.
  // This component does NOT fetch anything.

  const dayMission = missions.find(
    (mission) =>
      mission.session === "day"
  );

  const nightMission = missions.find(
    (mission) =>
      mission.session === "night"
  );

  const completedMissions =
    progress?.completedMissions || [];

  const isCompleted = (session) =>
    completedMissions.some(
      (mission) =>
        Number(mission.day) === Number(gameDay) &&
        mission.session === session
    );

  const dayCompleted =
    isCompleted("day");

  const nightCompleted =
    isCompleted("night");

  const openMission = (session) => {
    navigate(`/mission/${session}`);
  };

  // Do not show "No missions" while data is
  // still being supplied by Home.
  if (!dayMission && !nightMission) {
    return null;
  }

  return (
    <section className="space-y-4">

      {/* DAY MISSION */}
      {dayMission && (
        <div
          onClick={() =>
            openMission("day")
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
              alt="Day Mission"
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

              <h6>
                {dayMission.topic}
              </h6>

              <span>
                {dayMission.description}
              </span>

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
            openMission("night")
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
              alt="Night Mission"
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

              <h6>
                {nightMission.topic}
              </h6>

              <span>
                {nightMission.description}
              </span>

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
