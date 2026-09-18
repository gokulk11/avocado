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

  const isLastSlide = currentSlide === slides.length - 1;

  function nextSlide() {
    if (isLastSlide) {
      // Save that the Walk has been completed
      localStorage.setItem("walkCompleted", "true");

      // Go back to Home
      navigate("/");
      return;
    }

    setCurrentSlide((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
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
              index === currentSlide ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Button */}
      <button
        onClick={nextSlide}
        className="mt-8 px-8 py-3 bg-white text-black font-bold"
      >
        {isLastSlide ? "Go to Home" : "Next"}
      </button>
    </div>
  );
}
