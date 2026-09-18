import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Letter() {
  const [currentScene, setCurrentScene] = useState(1);
  const navigate = useNavigate();

  // Disable scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      document.body.style.overflow = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  const nextScene = () => {
    if (currentScene < 10) {
      setCurrentScene(currentScene + 1);
    }
  };

  const goHome = () => {
    // Letter onboarding completed
    localStorage.setItem("letterCompleted", "true");

    // Go back to Home
    navigate("/");
  };

  return (
    <div className="w-screen h-screen m-0 p-0 relative bg-black overflow-hidden">
      {/* Scene image */}
      <img
        src={`/letter/scn${currentScene}.png`}
        alt={`Scene ${currentScene}`}
        onClick={nextScene}
        draggable="false"
        className="block w-full h-screen object-contain cursor-pointer select-none"
      />

      {/* Top vignette */}
      <div
        className="
          absolute top-0 left-0 w-full h-40
          bg-gradient-to-b from-black/100 to-transparent
          pointer-events-none
        "
      />

      <div
        className="
          absolute top-0 left-0 w-full h-56
          pointer-events-none
          bg-gradient-to-b from-black via-black/30 to-transparent
        "
      />

      {/* GOTO HOME after last scene */}
      {currentScene === 10 && (
        <button
          onClick={goHome}
          className="
            absolute bottom-16 left-1/2 -translate-x-1/2
            px-6 py-3
            bg-black text-white
            border-2 border-white
            font-bold
            cursor-pointer
          "
        >
          GOTO HOME
        </button>
      )}
    </div>
  );
}
