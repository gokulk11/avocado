import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Walk() {
  const navigate = useNavigate();

  const slides = [
    {
      image: "/walk-1.png",
      text: "Sometimes, the best journeys begin with a simple walk.",
    },
    {
      image: "/walk-2.png",
      text: "Take a little time for yourself.",
    },
    {
      image: "/walk-3.png",
      text: "Look around. Enjoy the little things.",
    },
    {
      image: "/walk-4.png",
      text: "Every journey starts with one small step.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const [showNameInput, setShowNameInput] = useState(false);

  const [name, setName] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const isLastSlide = currentSlide === slides.length - 1;

  function nextSlide() {
    if (isLastSlide) {
      setShowNameInput(true);
      return;
    }

    setCurrentSlide((prev) => prev + 1);
  }

  async function saveName() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // --------------------------------
      // 1. Create user
      // --------------------------------

      const userResponse = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const userData = await userResponse.json();
      console.log("USER DATA:", userData);

      if (!userResponse.ok) {
        throw new Error(
          userData.error || "Failed to create user"
        );
      }

      const userId = userData.user.id;

      // --------------------------------
      // 2. Create user progress
      // --------------------------------

      const progressResponse = await fetch(
        "/api/progress/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        }
      );

      const progressData = await progressResponse.json();

      if (!progressResponse.ok) {
        throw new Error(
          progressData.error || "Failed to create progress"
        );
      }

      // --------------------------------
      // 3. Save user information locally
      // --------------------------------

      localStorage.setItem("userId", userId);

      localStorage.setItem(
        "userName",
        userData.user.name
      );

      // --------------------------------
      // 4. Mark Walk as completed
      // --------------------------------

      localStorage.setItem(
        "walkCompleted",
        "true"
      );

      // --------------------------------
      // 5. Go to Home
      // --------------------------------

      navigate("/");
    } catch (error) {
      console.error("Onboarding error:", error);

      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {!showNameInput ? (
        <>
          {/* Image */}
          <div className="w-full max-w-md">
            <img
              src={slides[currentSlide].image}
              alt="Walk scene"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Text */}
          <p className="text-center mt-6 text-white text-xl max-w-md">
            {slides[currentSlide].text}
          </p>

          {/* Progress */}
          <div className="flex gap-2 mt-6">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide
                    ? "bg-white"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Button */}
          <button
            onClick={nextSlide}
            className="mt-8 px-8 py-3 bg-white text-black font-bold"
          >
            {isLastSlide ? "Continue" : "Next"}
          </button>
        </>
      ) : (
        <>
          {/* Name Screen */}

          <div className="w-full max-w-md text-center">
            <h1 className="text-white text-3xl font-bold mb-4">
              What is your name?
            </h1>

            <p className="text-white/80 mb-6">
              Tell us your name before starting your journey.
            </p>

            {/* Name Input */}
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveName();
                }
              }}
              placeholder="Enter your name"
              maxLength={50}
              autoFocus
              disabled={saving}
              className="w-full px-4 py-3 text-black bg-white rounded-sm outline-none"
            />

            {/* Error */}
            {error && (
              <p className="text-red-300 mt-3">
                {error}
              </p>
            )}

            {/* Start Button */}
            <button
              onClick={saveName}
              disabled={saving}
              className="mt-6 px-8 py-3 bg-white text-black font-bold disabled:opacity-50"
            >
              {saving ? "Starting..." : "Start Journey"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}