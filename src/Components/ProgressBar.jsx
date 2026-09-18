export default function ProgressBar() {
  const progress = "Police";
  return (
    <div className="flex flex-col items-end">
      <span className="text-white text-xs font-bold mb-1">🥑XP</span>

      <div className="flex gap-[2px]">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 border-2 border-black ${
              index < 7 ? "bg-green-400" : "bg-gray-500"
            }`}
          />
        ))}
      </div>

      {/* <span className="text-white text-xs font-bold mt-1">70%</span> */}
    </div>
  );
}
