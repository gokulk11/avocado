import { useNavigate } from "react-router-dom";

export default function ExtraQuest({
  sideQuest,
  progress,
}) {
  const navigate = useNavigate();

  // Data is loaded by Home.jsx.
  // This component does NOT fetch anything.

  if (!sideQuest) {
    return null;
  }

  const completedSideQuests =
    progress?.completedSideQuests || [];

  const completed =
    completedSideQuests.some(
      (quest) =>
        String(quest.questId) ===
        String(sideQuest._id)
    );

  const openQuest = () => {
    navigate("/extra-quest");
  };

  return (
    <section>
      <div
        onClick={openQuest}
        className={`border-3 rounded-sm mt-6 opacity-90 h-[100px] cursor-pointer ${
          completed
            ? "bg-green-200"
            : "bg-green-200"
        }`}
      >
        <div className="flex border h-full p-3 overflow-hidden">

          <img
            className="w-[70px] my-auto h-max"
            src="/Book2.png"
            alt="Extra Quest"
          />

          <div className="leading-4 w-[200px] overflow-hidden mx-3 my-auto">

            <div className="flex items-center justify-between">

              <h3 className="font-bold">
                Extra Quest
              </h3>

              {completed && (
                <span className="text-green-700 font-bold">
                  ✓
                </span>
              )}

            </div>

            <h6 className="font-bold">
              {sideQuest.topic}
            </h6>

            <span>
              {sideQuest.description}
            </span>

            {completed && (
              <div className="text-green-700 font-bold mt-1">
                ✅ Completed
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
