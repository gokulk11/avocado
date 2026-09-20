import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import extraQuestData from "../data/extraQuests.json";
import { getGameDay } from "../utils/gameDay";

export default function ExtraQuest() {
  const [gameDay, setGameDay] = useState(getGameDay());
  const navigate = useNavigate();
  useEffect(() => {
    const updateDay = () => {
      setGameDay(getGameDay());
    };

    updateDay();

    const timer = setInterval(updateDay, 1000);

    return () => clearInterval(timer);
  }, []);

  // Find the current day's extra quest
  const dayData = extraQuestData.extraQuests.find(
    (item) => item.id === `Day${gameDay}`,
  );

  // No quest available for this day
  if (!dayData || !dayData.quests.length) {
    return null;
  }

  // For now, show the first extra quest
  const quest = dayData.quests[0];

  return (
    <section>
      <div
        onClick={() => navigate("/extra-quest")}
        className="border-3 rounded-sm mt-6 opacity-90 bg-green-200 h-[100px]"
      >
        <div className="flex border h-full p-3 overflow-hidden">
          <img
            className="w-[70px] my-auto h-max"
            src="/Book2.png"
            alt="Extra Quest"
          />

          <div className="leading-4 w-[200px] overflow-hidden mx-3 my-auto">
            <h3 className="font-bold">Extra Quest</h3>

            <h6 className="font-bold">{quest.title}</h6>

            <span className="">{quest.description}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
