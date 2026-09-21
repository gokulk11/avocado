import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGameDay } from "../utils/gameDay";

export default function ExtraQuest() {
  const [gameDay, setGameDay] = useState(getGameDay());
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Update game day
  useEffect(() => {
    const updateDay = () => {
      setGameDay(getGameDay());
    };

    updateDay();

    const timer = setInterval(updateDay, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch extra quest from MongoDB
  useEffect(() => {
    const fetchQuest = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/side-quests/day?day=${gameDay}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch extra quest");
        }

        const data = await response.json();

        // API returns sideQuests
        setQuest(data.sideQuests?.[0] || null);
      } catch (error) {
        console.error("Error fetching extra quest:", error);
        setQuest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuest();
  }, [gameDay]);

  // While loading
  if (loading) {
    return null;
  }

  // No quest available
  if (!quest) {
    return null;
  }

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

            <h6 className="font-bold">{quest.topic}</h6>

            <span>{quest.description}</span>
          </div>
        </div>
      </div>
    </section>
  );
}