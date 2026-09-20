import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import missionsData from "../data/mission.json";
import { getGameDay } from "../utils/gameDay";
import VoiceTutor from "../Components/VoiceTutor";

export default function Mission() {
  const navigate = useNavigate();
  const { type } = useParams();

  const [message, setMessage] = useState("");
  const [showResultPopup, setShowResultPopup] = useState(false);

  const [vocabulary, setVocabulary] = useState("");
  const [grammar, setGrammar] = useState("");
  const [pronunciation, setPronunciation] = useState("");

  const [savedResult, setSavedResult] = useState(null);

  const gameDay = getGameDay();

  // Unique ID for this mission
  const missionId = `Day${gameDay}-${type}`;

  // Find current day's data
  const dayData = missionsData.mainMissions.find(
    (item) => item.id === `Day${gameDay}`
  );

  // Load previously saved result
  useEffect(() => {
    const savedResults = JSON.parse(
      localStorage.getItem("missionResults") || "{}"
    );

    if (savedResults[missionId]) {
      setSavedResult(savedResults[missionId]);
    }
  }, [missionId]);

  // If no mission exists
  if (!dayData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h2>No mission available for Day {gameDay}</h2>
      </main>
    );
  }

  // Select Day or Night mission
  const mission =
    type === "day"
      ? dayData.DayMission
      : dayData.NightMission;

  // Open result popup
  const openResultPopup = () => {
    // If a result already exists, load it into the inputs
    if (savedResult) {
      setVocabulary(savedResult.Vocabulary);
      setGrammar(savedResult.Grammar);
      setPronunciation(savedResult.Pronunciation);
    }

    setShowResultPopup(true);
    setMessage("");
  };

  // Submit result
  const submitResult = () => {
    const vocab = Number(vocabulary);
    const gram = Number(grammar);
    const pron = Number(pronunciation);

    // Validate
    if (
      !Number.isInteger(vocab) ||
      vocab < 1 ||
      vocab > 10 ||
      !Number.isInteger(gram) ||
      gram < 1 ||
      gram > 10 ||
      !Number.isInteger(pron) ||
      pron < 1 ||
      pron > 10
    ) {
      setMessage(
        "⚠️ Please enter a score from 1 to 10 for all categories."
      );

      return;
    }

    const result = {
      Vocabulary: vocab,
      Grammar: gram,
      Pronunciation: pron,
    };

    // Get existing results
    const savedResults = JSON.parse(
      localStorage.getItem("missionResults") || "{}"
    );

    // Save result
    savedResults[missionId] = result;

    localStorage.setItem(
      "missionResults",
      JSON.stringify(savedResults)
    );

    // Update state immediately
    setSavedResult(result);

    // Save mission completion
    const completedMissions = JSON.parse(
      localStorage.getItem("completedMissions") || "[]"
    );

    if (!completedMissions.includes(missionId)) {
      completedMissions.push(missionId);

      localStorage.setItem(
        "completedMissions",
        JSON.stringify(completedMissions)
      );
    }

    // Close popup
    setShowResultPopup(false);

    // Clear inputs
    setVocabulary("");
    setGrammar("");
    setPronunciation("");

    setMessage(
      "🥑 Mission result submitted successfully!"
    );
  };

  // Calculate total
  const totalScore = savedResult
    ? savedResult.Vocabulary +
      savedResult.Grammar +
      savedResult.Pronunciation
    : 0;

  return (
    <main className="min-h-screen bg-amber-100 p-5">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="border-2 border-black px-4 py-2 rounded-sm font-bold"
      >
        ← Back
      </button>

      {/* Mission content */}
      <div className="max-w-xl mx-auto mt-10">

        {/* Day */}
        <p className="text-sm font-bold">
          DAY {gameDay}
        </p>

        {/* Mission type */}
        <h1 className="text-3xl font-bold mt-2">
          {type === "day"
            ? "Day Mission"
            : "Night Mission"}
        </h1>

        {/* Mission topic */}
        <h2 className="text-2xl font-bold mt-8">
          {mission.topic}
        </h2>

        {/* Mission description */}
        <p className="mt-4 text-lg leading-7">
          {mission.description}
        </p>

        {/* ================================= */}
        {/* VOICE TUTOR */}
        {/* ================================= */}

        <VoiceTutor
          mission={mission}
          gameDay={gameDay}
          missionId={missionId}
        />

        {/* Status message */}
        {message && (
          <div className="mt-4 border-2 border-black bg-white p-3 text-center font-bold">
            {message}
          </div>
        )}

        {/* ================================= */}
        {/* SUBMIT RESULT */}
        {/* ================================= */}

        <button
          onClick={openResultPopup}
          className="mt-6 w-full border-3 border-black bg-yellow-300 py-4 rounded-sm font-bold text-xl hover:bg-yellow-400 active:translate-y-1 transition"
        >
          📤 Submit Result
        </button>

        {/* ================================= */}
        {/* SAVED RESULT */}
        {/* ================================= */}

        {savedResult && (
          <div className="mt-8 border-4 border-black bg-green-100 p-5 rounded-sm">

            <h2 className="text-2xl font-bold text-center">
              🥑 Mission Result
            </h2>

            <p className="text-center font-bold mt-1">
              {mission.topic}
            </p>

            {/* Scores */}
            <div className="mt-6 space-y-3">

              {/* Vocabulary */}
              <div className="flex items-center justify-between border-2 border-black bg-white p-3">
                <span className="font-bold">
                  📚 Vocabulary
                </span>

                <span className="text-xl font-bold">
                  {savedResult.Vocabulary}/10
                </span>
              </div>

              {/* Grammar */}
              <div className="flex items-center justify-between border-2 border-black bg-white p-3">
                <span className="font-bold">
                  📝 Grammar
                </span>

                <span className="text-xl font-bold">
                  {savedResult.Grammar}/10
                </span>
              </div>

              {/* Pronunciation */}
              <div className="flex items-center justify-between border-2 border-black bg-white p-3">
                <span className="font-bold">
                  🗣️ Pronunciation
                </span>

                <span className="text-xl font-bold">
                  {savedResult.Pronunciation}/10
                </span>
              </div>

            </div>

            {/* Total */}
            <div className="mt-5 border-3 border-black bg-yellow-300 p-4 text-center">

              <p className="font-bold">
                ⭐ Total Score
              </p>

              <p className="text-3xl font-bold">
                {totalScore}/30
              </p>

            </div>

            {/* Completed */}
            <div className="mt-4 text-center font-bold">
              ✅ Mission Completed
            </div>

          </div>
        )}

      </div>

      {/* ================================= */}
      {/* RESULT POPUP */}
      {/* ================================= */}

      {showResultPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

          <div className="w-full max-w-sm bg-amber-100 border-4 border-black p-5 rounded-sm shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                🥑 Submit Result
              </h2>

              <button
                onClick={() =>
                  setShowResultPopup(false)
                }
                className="border-2 border-black px-2 py-1 font-bold bg-white"
              >
                ✕
              </button>

            </div>

            {/* Mission information */}
            <p className="mt-2 text-sm font-bold">
              Day {gameDay} •{" "}
              {type === "day"
                ? "Day Mission"
                : "Night Mission"}
            </p>

            {/* Vocabulary */}
            <div className="mt-6">

              <label className="block font-bold mb-2">
                📚 Vocabulary
              </label>

              <div className="flex items-center gap-2">

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={vocabulary}
                  onChange={(e) =>
                    setVocabulary(e.target.value)
                  }
                  placeholder="1 - 10"
                  className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
                />

                <span className="font-bold">
                  /10
                </span>

              </div>

            </div>

            {/* Grammar */}
            <div className="mt-4">

              <label className="block font-bold mb-2">
                📝 Grammar
              </label>

              <div className="flex items-center gap-2">

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={grammar}
                  onChange={(e) =>
                    setGrammar(e.target.value)
                  }
                  placeholder="1 - 10"
                  className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
                />

                <span className="font-bold">
                  /10
                </span>

              </div>

            </div>

            {/* Pronunciation */}
            <div className="mt-4">

              <label className="block font-bold mb-2">
                🗣️ Pronunciation
              </label>

              <div className="flex items-center gap-2">

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={pronunciation}
                  onChange={(e) =>
                    setPronunciation(e.target.value)
                  }
                  placeholder="1 - 10"
                  className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
                />

                <span className="font-bold">
                  /10
                </span>

              </div>

            </div>

            {/* Submit */}
            <button
              onClick={submitResult}
              className="mt-6 w-full border-3 border-black bg-green-300 py-4 rounded-sm font-bold text-xl hover:bg-green-400 active:translate-y-1 transition"
            >
              ✅ Submit Result
            </button>

            {/* Cancel */}
            <button
              onClick={() =>
                setShowResultPopup(false)
              }
              className="mt-3 w-full border-2 border-black bg-white py-3 rounded-sm font-bold"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </main>
  );
}