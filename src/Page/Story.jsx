import { useParams } from "react-router-dom";
import stories from "../data/story.json";

export default function Story() {
  const { day } = useParams();

  const currentDay = stories.days.find((story) => story.day === Number(day));

  if (!currentDay) {
    return <h1>Story not found</h1>;
  }

  return (
    <div>
      <h1>Day {currentDay.day}</h1>

      <h2>{currentDay.title}</h2>

      {currentDay.dialogues.map((dialogue, index) => (
        <p key={index}>
          {dialogue.character}: {dialogue.text}
        </p>
      ))}
    </div>
  );
}
