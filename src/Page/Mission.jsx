// // import { useEffect, useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";

// // import missionsData from "../data/mission.json";
// // import { getGameDay } from "../utils/gameDay";
// // import VoiceTutor from "../Components/VoiceTutor";

// // export default function Mission() {
// //   const navigate = useNavigate();
// //   const { type } = useParams();

// //   const [message, setMessage] = useState("");
// //   const [showResultPopup, setShowResultPopup] = useState(false);

// //   const [vocabulary, setVocabulary] = useState("");
// //   const [grammar, setGrammar] = useState("");
// //   const [pronunciation, setPronunciation] = useState("");

// //   const [savedResult, setSavedResult] = useState(null);

// //   const gameDay = getGameDay();

// //   // Unique ID for this mission
// //   const missionId = `Day${gameDay}-${type}`;

// //   // Find current day's data
// //   const dayData = missionsData.mainMissions.find(
// //     (item) => item.id === `Day${gameDay}`
// //   );

// //   // Load previously saved result
// //   useEffect(() => {
// //     const savedResults = JSON.parse(
// //       localStorage.getItem("missionResults") || "{}"
// //     );

// //     if (savedResults[missionId]) {
// //       setSavedResult(savedResults[missionId]);
// //     }
// //   }, [missionId]);

// //   // If no mission exists
// //   if (!dayData) {
// //     return (
// //       <main className="min-h-screen flex items-center justify-center">
// //         <h2>No mission available for Day {gameDay}</h2>
// //       </main>
// //     );
// //   }

// //   // Select Day or Night mission
// //   const mission =
// //     type === "day"
// //       ? dayData.DayMission
// //       : dayData.NightMission;

// //   // Open result popup
// //   const openResultPopup = () => {
// //     // If a result already exists, load it into the inputs
// //     if (savedResult) {
// //       setVocabulary(savedResult.Vocabulary);
// //       setGrammar(savedResult.Grammar);
// //       setPronunciation(savedResult.Pronunciation);
// //     }

// //     setShowResultPopup(true);
// //     setMessage("");
// //   };

// //   // Submit result
// //   const submitResult = () => {
// //     const vocab = Number(vocabulary);
// //     const gram = Number(grammar);
// //     const pron = Number(pronunciation);

// //     // Validate
// //     if (
// //       !Number.isInteger(vocab) ||
// //       vocab < 1 ||
// //       vocab > 10 ||
// //       !Number.isInteger(gram) ||
// //       gram < 1 ||
// //       gram > 10 ||
// //       !Number.isInteger(pron) ||
// //       pron < 1 ||
// //       pron > 10
// //     ) {
// //       setMessage(
// //         "⚠️ Please enter a score from 1 to 10 for all categories."
// //       );

// //       return;
// //     }

// //     const result = {
// //       Vocabulary: vocab,
// //       Grammar: gram,
// //       Pronunciation: pron,
// //     };

// //     // Get existing results
// //     const savedResults = JSON.parse(
// //       localStorage.getItem("missionResults") || "{}"
// //     );

// //     // Save result
// //     savedResults[missionId] = result;

// //     localStorage.setItem(
// //       "missionResults",
// //       JSON.stringify(savedResults)
// //     );

// //     // Update state immediately
// //     setSavedResult(result);

// //     // Save mission completion
// //     const completedMissions = JSON.parse(
// //       localStorage.getItem("completedMissions") || "[]"
// //     );

// //     if (!completedMissions.includes(missionId)) {
// //       completedMissions.push(missionId);

// //       localStorage.setItem(
// //         "completedMissions",
// //         JSON.stringify(completedMissions)
// //       );
// //     }

// //     // Close popup
// //     setShowResultPopup(false);

// //     // Clear inputs
// //     setVocabulary("");
// //     setGrammar("");
// //     setPronunciation("");

// //     setMessage(
// //       "🥑 Mission result submitted successfully!"
// //     );
// //   };

// //   // Calculate total
// //   const totalScore = savedResult
// //     ? savedResult.Vocabulary +
// //       savedResult.Grammar +
// //       savedResult.Pronunciation
// //     : 0;

// //   return (
// //     <main className="min-h-screen bg-amber-100 p-5">

// //       {/* Back button */}
// //       <button
// //         onClick={() => navigate(-1)}
// //         className="border-2 border-black px-4 py-2 rounded-sm font-bold"
// //       >
// //         ← Back
// //       </button>

// //       {/* Mission content */}
// //       <div className="max-w-xl mx-auto mt-10">

// //         {/* Day */}
// //         <p className="text-sm font-bold">
// //           DAY {gameDay}
// //         </p>

// //         {/* Mission type */}
// //         <h1 className="text-3xl font-bold mt-2">
// //           {type === "day"
// //             ? "Day Mission"
// //             : "Night Mission"}
// //         </h1>

// //         {/* Mission topic */}
// //         <h2 className="text-2xl font-bold mt-8">
// //           {mission.topic}
// //         </h2>

// //         {/* Mission description */}
// //         <p className="mt-4 text-lg leading-7">
// //           {mission.description}
// //         </p>

// //         {/* ================================= */}
// //         {/* VOICE TUTOR */}
// //         {/* ================================= */}

// //         <VoiceTutor
// //           mission={mission}
// //           gameDay={gameDay}
// //           missionId={missionId}
// //         />

// //         {/* Status message */}
// //         {message && (
// //           <div className="mt-4 border-2 border-black bg-white p-3 text-center font-bold">
// //             {message}
// //           </div>
// //         )}

// //         {/* ================================= */}
// //         {/* SUBMIT RESULT */}
// //         {/* ================================= */}

// //         <button
// //           onClick={openResultPopup}
// //           className="mt-6 w-full border-3 border-black bg-yellow-300 py-4 rounded-sm font-bold text-xl hover:bg-yellow-400 active:translate-y-1 transition"
// //         >
// //           📤 Submit Result
// //         </button>

// //         {/* ================================= */}
// //         {/* SAVED RESULT */}
// //         {/* ================================= */}

// //         {savedResult && (
// //           <div className="mt-8 border-4 border-black bg-green-100 p-5 rounded-sm">

// //             <h2 className="text-2xl font-bold text-center">
// //               🥑 Mission Result
// //             </h2>

// //             <p className="text-center font-bold mt-1">
// //               {mission.topic}
// //             </p>

// //             {/* Scores */}
// //             <div className="mt-6 space-y-3">

// //               {/* Vocabulary */}
// //               <div className="flex items-center justify-between border-2 border-black bg-white p-3">
// //                 <span className="font-bold">
// //                   📚 Vocabulary
// //                 </span>

// //                 <span className="text-xl font-bold">
// //                   {savedResult.Vocabulary}/10
// //                 </span>
// //               </div>

// //               {/* Grammar */}
// //               <div className="flex items-center justify-between border-2 border-black bg-white p-3">
// //                 <span className="font-bold">
// //                   📝 Grammar
// //                 </span>

// //                 <span className="text-xl font-bold">
// //                   {savedResult.Grammar}/10
// //                 </span>
// //               </div>

// //               {/* Pronunciation */}
// //               <div className="flex items-center justify-between border-2 border-black bg-white p-3">
// //                 <span className="font-bold">
// //                   🗣️ Pronunciation
// //                 </span>

// //                 <span className="text-xl font-bold">
// //                   {savedResult.Pronunciation}/10
// //                 </span>
// //               </div>

// //             </div>

// //             {/* Total */}
// //             <div className="mt-5 border-3 border-black bg-yellow-300 p-4 text-center">

// //               <p className="font-bold">
// //                 ⭐ Total Score
// //               </p>

// //               <p className="text-3xl font-bold">
// //                 {totalScore}/30
// //               </p>

// //             </div>

// //             {/* Completed */}
// //             <div className="mt-4 text-center font-bold">
// //               ✅ Mission Completed
// //             </div>

// //           </div>
// //         )}

// //       </div>

// //       {/* ================================= */}
// //       {/* RESULT POPUP */}
// //       {/* ================================= */}

// //       {showResultPopup && (
// //         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

// //           <div className="w-full max-w-sm bg-amber-100 border-4 border-black p-5 rounded-sm shadow-xl">

// //             {/* Header */}
// //             <div className="flex items-center justify-between">

// //               <h2 className="text-2xl font-bold">
// //                 🥑 Submit Result
// //               </h2>

// //               <button
// //                 onClick={() =>
// //                   setShowResultPopup(false)
// //                 }
// //                 className="border-2 border-black px-2 py-1 font-bold bg-white"
// //               >
// //                 ✕
// //               </button>

// //             </div>

// //             {/* Mission information */}
// //             <p className="mt-2 text-sm font-bold">
// //               Day {gameDay} •{" "}
// //               {type === "day"
// //                 ? "Day Mission"
// //                 : "Night Mission"}
// //             </p>

// //             {/* Vocabulary */}
// //             <div className="mt-6">

// //               <label className="block font-bold mb-2">
// //                 📚 Vocabulary
// //               </label>

// //               <div className="flex items-center gap-2">

// //                 <input
// //                   type="number"
// //                   min="1"
// //                   max="10"
// //                   value={vocabulary}
// //                   onChange={(e) =>
// //                     setVocabulary(e.target.value)
// //                   }
// //                   placeholder="1 - 10"
// //                   className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
// //                 />

// //                 <span className="font-bold">
// //                   /10
// //                 </span>

// //               </div>

// //             </div>

// //             {/* Grammar */}
// //             <div className="mt-4">

// //               <label className="block font-bold mb-2">
// //                 📝 Grammar
// //               </label>

// //               <div className="flex items-center gap-2">

// //                 <input
// //                   type="number"
// //                   min="1"
// //                   max="10"
// //                   value={grammar}
// //                   onChange={(e) =>
// //                     setGrammar(e.target.value)
// //                   }
// //                   placeholder="1 - 10"
// //                   className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
// //                 />

// //                 <span className="font-bold">
// //                   /10
// //                 </span>

// //               </div>

// //             </div>

// //             {/* Pronunciation */}
// //             <div className="mt-4">

// //               <label className="block font-bold mb-2">
// //                 🗣️ Pronunciation
// //               </label>

// //               <div className="flex items-center gap-2">

// //                 <input
// //                   type="number"
// //                   min="1"
// //                   max="10"
// //                   value={pronunciation}
// //                   onChange={(e) =>
// //                     setPronunciation(e.target.value)
// //                   }
// //                   placeholder="1 - 10"
// //                   className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
// //                 />

// //                 <span className="font-bold">
// //                   /10
// //                 </span>

// //               </div>

// //             </div>

// //             {/* Submit */}
// //             <button
// //               onClick={submitResult}
// //               className="mt-6 w-full border-3 border-black bg-green-300 py-4 rounded-sm font-bold text-xl hover:bg-green-400 active:translate-y-1 transition"
// //             >
// //               ✅ Submit Result
// //             </button>

// //             {/* Cancel */}
// //             <button
// //               onClick={() =>
// //                 setShowResultPopup(false)
// //               }
// //               className="mt-3 w-full border-2 border-black bg-white py-3 rounded-sm font-bold"
// //             >
// //               Cancel
// //             </button>

// //           </div>

// //         </div>
// //       )}

// //     </main>
// //   );
// // }

// // import { useEffect, useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { getGameDay } from "../utils/gameDay";
// // export default function Mission({ type = "day" }) {
// //   const navigate = useNavigate();
// //   const { missionType } = useParams();

// //   const gameDay = getGameDay();

// //   const session = missionType || type;

// //   const [mission, setMission] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   const [result, setResult] = useState(null);
// //   const [showResult, setShowResult] = useState(false);

// //   useEffect(() => {
// //     async function loadMission() {
// //       try {
// //         setLoading(true);
// //         setError("");

// //         const response = await fetch(
// //           `/api/missions/day?day=${gameDay}`
// //         );

// //         if (!response.ok) {
// //           throw new Error("Failed to load missions");
// //         }

// //         const data = await response.json();

// //         console.log("Mission API:", data);

// //         const selectedMission = data.missions?.find(
// //           (item) => item.session === session
// //         );

// //         if (!selectedMission) {
// //           setError(
// //             `No ${session} mission available for Day ${gameDay}`
// //           );
// //           return;
// //         }

// //         setMission(selectedMission);
// //       } catch (err) {
// //         console.error(err);
// //         setError("Unable to load mission.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     loadMission();
// //   }, [gameDay, session]);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <p>Loading mission...</p>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <p className="text-red-500">{error}</p>

// //           <button
// //             onClick={() => navigate("/")}
// //             className="mt-4 px-4 py-2 bg-black text-white rounded"
// //           >
// //             Go Home
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!mission) {
// //     return null;
// //   }

// //   return (
// //     <div className="min-h-screen">
// //       <div className="p-4">
// //         <h1 className="text-2xl font-bold">
// //           Day {gameDay}
// //         </h1>

// //         <p className="text-lg mt-2">
// //           {mission.topic}
// //         </p>

// //         <p className="mt-4">
// //           {mission.description}
// //         </p>

// //         <div className="mt-6">
// //           Reward: {mission.reward} XP
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getGameDay } from "../utils/gameDay";

// export default function Mission() {
//   const navigate = useNavigate();
//   const { type } = useParams();

//   const [mission, setMission] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   const [showResultPopup, setShowResultPopup] = useState(false);

//   const [vocabulary, setVocabulary] = useState("");
//   const [grammar, setGrammar] = useState("");
//   const [pronunciation, setPronunciation] = useState("");

//   const [savedResult, setSavedResult] = useState(null);

//   const gameDay = getGameDay();

//   /*
//    * This ID is now the MongoDB mission ID
//    * once the mission has been loaded.
//    */
//   const [missionId, setMissionId] = useState(null);

//   /*
//    * Load mission from MongoDB
//    */
//   useEffect(() => {
//     const loadMission = async () => {
//       try {
//         setLoading(true);
//         setMessage("");

//         const response = await fetch(`/api/missions/day?day=${gameDay}`);

//         if (!response.ok) {
//           const errorText = await response.text();

//           throw new Error(
//             `Mission API failed (${response.status}): ${errorText}`,
//           );
//         }

//         const data = await response.json();

//         console.log("🥑 MongoDB missions:", data);

//         /*
//          * type comes from your route:
//          *
//          * /mission/day
//          * /mission/night
//          *
//          * MongoDB uses:
//          *
//          * session: "day"
//          * session: "night"
//          */
//         const selectedMission = data.missions?.find(
//           (item) => item.session === type,
//         );

//         if (!selectedMission) {
//           setMission(null);

//           setMessage(`No ${type} mission available for Day ${gameDay}.`);

//           return;
//         }

//         console.log("✅ Selected MongoDB mission:", selectedMission);

//         setMission(selectedMission);

//         /*
//          * IMPORTANT:
//          * Use MongoDB _id instead of:
//          * Day1-day
//          */
//         setMissionId(selectedMission._id);
//       } catch (error) {
//         console.error("❌ Failed to load mission:", error);

//         setMessage(error.message || "Failed to load mission.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadMission();
//   }, [gameDay, type]);

//   /*
//    * Load previously saved local result
//    *
//    * TEMPORARY.
//    *
//    * We keep this during Phase 3A so your existing
//    * results don't suddenly disappear.
//    *
//    * We'll remove this in Phase 3D after MongoDB
//    * progress is working.
//    */
//   useEffect(() => {
//     if (!missionId) return;

//     const savedResults = JSON.parse(
//       localStorage.getItem("missionResults") || "{}",
//     );

//     /*
//      * Support old format while migrating.
//      *
//      * Old:
//      * Day1-day
//      *
//      * New:
//      * MongoDB _id
//      */
//     const oldMissionId = `Day${gameDay}-${type}`;

//     const saved = savedResults[missionId] || savedResults[oldMissionId];

//     if (saved) {
//       setSavedResult(saved);
//     }
//   }, [missionId, gameDay, type]);

//   /*
//    * Loading
//    */
//   if (loading) {
//     return (
//       <main className="min-h-screen bg-amber-100 p-5 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl animate-bounce">🥑</div>

//           <p className="mt-4 text-xl font-bold">Loading mission...</p>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * No mission
//    */
//   if (!mission) {
//     return (
//       <main className="min-h-screen bg-amber-100 p-5 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl">🥑</div>

//           <h2 className="text-2xl font-bold mt-4">Mission unavailable</h2>

//           <p className="mt-3">
//             {message || `No mission available for Day ${gameDay}.`}
//           </p>

//           <button
//             onClick={() => navigate(-1)}
//             className="mt-6 border-2 border-black bg-white px-5 py-3 font-bold"
//           >
//             ← Go Back
//           </button>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * Gemini / ChatGPT prompt
//    */
//   const chatPrompt = `Mission description:
// ${mission.description}

// You are my German language tutor.

// Help me complete this mission as a German learner.

// Rules:
// - Speak mainly in German.
// - Give English meaning when necessary.
// - Ask me questions one at a time.
// - Wait for my answer before continuing.
// - Correct my German mistakes and briefly explain them.
// - Keep the conversation related to this mission.
// - Make it interactive and suitable for my current German level.
// - Do not give my evaluation until the mission is finished.

// After I finish the mission, evaluate my performance in exactly these 3 categories:

// 📚 Vocabulary: X/10
// 📝 Grammar: X/10
// 🗣️ Pronunciation: X/10

// Give each category a score from 1 to 10.

// Then briefly explain:
// - What I did well
// - What I need to improve
// - One short recommendation for my German learning

// IMPORTANT:
// Only evaluate pronunciation if you actually have access to my voice/audio.

// If you only received text, say:
// "Pronunciation: N/A"

// Do not give the evaluation before the mission is finished.

// Mission ID:
// ${mission._id}
// `;

//   /*
//    * Start ChatGPT
//    */
//   const startChatGPT = async () => {
//     try {
//       await navigator.clipboard.writeText(chatPrompt);

//       setMessage("✅ Mission copied! Paste it into ChatGPT.");

//       window.open("https://chatgpt.com/", "_blank");
//     } catch (error) {
//       console.error("Clipboard error:", error);

//       try {
//         const textArea = document.createElement("textarea");

//         textArea.value = chatPrompt;

//         textArea.style.position = "fixed";
//         textArea.style.left = "-9999px";

//         document.body.appendChild(textArea);

//         textArea.focus();
//         textArea.select();

//         document.execCommand("copy");

//         document.body.removeChild(textArea);

//         setMessage("✅ Mission copied! Paste it into ChatGPT.");

//         window.open("https://chatgpt.com/", "_blank");
//       } catch (fallbackError) {
//         console.error("Copy failed:", fallbackError);

//         setMessage(
//           "⚠️ Could not copy automatically. Please copy the prompt manually.",
//         );
//       }
//     }
//   };

//   /*
//    * Open result popup
//    */
//   const openResultPopup = () => {
//     if (savedResult) {
//       setVocabulary(savedResult.Vocabulary ?? "");

//       setGrammar(savedResult.Grammar ?? "");

//       setPronunciation(savedResult.Pronunciation ?? "");
//     }

//     setShowResultPopup(true);
//     setMessage("");
//   };

//   /*
//    * Submit result
//    *
//    * STILL localStorage for now.
//    *
//    * Phase 3B will move this to MongoDB.
//    */
//   const submitResult = () => {
//     const vocab = Number(vocabulary);
//     const gram = Number(grammar);
//     const pron = Number(pronunciation);

//     if (
//       !Number.isInteger(vocab) ||
//       vocab < 1 ||
//       vocab > 10 ||
//       !Number.isInteger(gram) ||
//       gram < 1 ||
//       gram > 10 ||
//       !Number.isInteger(pron) ||
//       pron < 1 ||
//       pron > 10
//     ) {
//       setMessage("⚠️ Please enter a score from 1 to 10 for all categories.");

//       return;
//     }

//     const result = {
//       Vocabulary: vocab,
//       Grammar: gram,
//       Pronunciation: pron,
//     };

//     /*
//      * TEMPORARY localStorage
//      */
//     const savedResults = JSON.parse(
//       localStorage.getItem("missionResults") || "{}",
//     );

//     /*
//      * Save using MongoDB ID
//      */
//     savedResults[mission._id] = result;

//     localStorage.setItem("missionResults", JSON.stringify(savedResults));

//     /*
//      * Also save old ID for compatibility
//      */
//     const oldMissionId = `Day${gameDay}-${type}`;

//     savedResults[oldMissionId] = result;

//     localStorage.setItem("missionResults", JSON.stringify(savedResults));

//     setSavedResult(result);

//     /*
//      * TEMPORARY completed missions
//      */
//     const completedMissions = JSON.parse(
//       localStorage.getItem("completedMissions") || "[]",
//     );

//     if (!completedMissions.includes(mission._id)) {
//       completedMissions.push(mission._id);
//     }

//     localStorage.setItem(
//       "completedMissions",
//       JSON.stringify(completedMissions),
//     );

//     setShowResultPopup(false);

//     setVocabulary("");
//     setGrammar("");
//     setPronunciation("");

//     setMessage("🥑 Mission result submitted successfully!");
//   };

//   const totalScore = savedResult
//     ? Number(savedResult.Vocabulary || 0) +
//       Number(savedResult.Grammar || 0) +
//       Number(savedResult.Pronunciation || 0)
//     : 0;

//   return (
//     <main className="min-h-screen bg-amber-100 p-5">
//       {/* Back button */}

//       <button
//         onClick={() => navigate(-1)}
//         className="border-2 border-black px-4 py-2 rounded-sm font-bold"
//       >
//         ← Back
//       </button>

//       <div className="max-w-xl mx-auto mt-10">
//         {/* Day */}

//         <p className="text-sm font-bold">DAY {gameDay}</p>

//         {/* Mission type */}

//         <h1 className="text-3xl font-bold mt-2">
//           {type === "day" ? "Day Mission" : "Night Mission"}
//         </h1>

//         {/* Topic */}

//         <h2 className="text-2xl font-bold mt-8">{mission.topic}</h2>

//         {/* Description */}

//         <p className="mt-4 text-lg leading-7">{mission.description}</p>

//         {/* MongoDB information */}

//         <div className="mt-4 border-2 border-black bg-white p-3 text-xs break-all">
//           <p className="font-bold">Mission ID</p>

//           <p>{mission._id}</p>
//         </div>

//         {/* ChatGPT */}

//         <button
//           onClick={startChatGPT}
//           className="mt-10 w-full border-3 border-black bg-green-300 py-4 rounded-sm font-bold text-xl hover:bg-green-400 active:translate-y-1 transition"
//         >
//           🤖 Start Mission with ChatGPT
//         </button>

//         {/* Status */}

//         {message && (
//           <div className="mt-4 border-2 border-black bg-white p-3 text-center font-bold">
//             {message}
//           </div>
//         )}

//         {/* Prompt */}

//         <details className="mt-6 border-2 border-black bg-white p-3">
//           <summary className="font-bold cursor-pointer">
//             Show ChatGPT Prompt
//           </summary>

//           <pre className="mt-4 text-sm whitespace-pre-wrap leading-5">
//             {chatPrompt}
//           </pre>
//         </details>

//         {/* Submit */}

//         <button
//           onClick={openResultPopup}
//           className="mt-6 w-full border-3 border-black bg-yellow-300 py-4 rounded-sm font-bold text-xl hover:bg-yellow-400 active:translate-y-1 transition"
//         >
//           📤 Submit Result
//         </button>

//         {/* Saved result */}

//         {savedResult && (
//           <div className="mt-8 border-4 border-black bg-green-100 p-5 rounded-sm">
//             <h2 className="text-2xl font-bold text-center">
//               🥑 Mission Result
//             </h2>

//             <p className="text-center font-bold mt-1">{mission.topic}</p>

//             <div className="mt-6 space-y-3">
//               <div className="flex items-center justify-between border-2 border-black bg-white p-3">
//                 <span className="font-bold">📚 Vocabulary</span>

//                 <span className="text-xl font-bold">
//                   {savedResult.Vocabulary}/10
//                 </span>
//               </div>

//               <div className="flex items-center justify-between border-2 border-black bg-white p-3">
//                 <span className="font-bold">📝 Grammar</span>

//                 <span className="text-xl font-bold">
//                   {savedResult.Grammar}/10
//                 </span>
//               </div>

//               <div className="flex items-center justify-between border-2 border-black bg-white p-3">
//                 <span className="font-bold">🗣️ Pronunciation</span>

//                 <span className="text-xl font-bold">
//                   {savedResult.Pronunciation}/10
//                 </span>
//               </div>
//             </div>

//             <div className="mt-5 border-3 border-black bg-yellow-300 p-4 text-center">
//               <p className="font-bold">⭐ Total Score</p>

//               <p className="text-3xl font-bold">{totalScore}/30</p>
//             </div>

//             <div className="mt-4 text-center font-bold">
//               ✅ Mission Completed
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Result popup */}

//       {showResultPopup && (
//         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
//           <div className="w-full max-w-sm bg-amber-100 border-4 border-black p-5 rounded-sm shadow-xl">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold">🥑 Submit Result</h2>

//               <button
//                 onClick={() => setShowResultPopup(false)}
//                 className="border-2 border-black px-2 py-1 font-bold bg-white"
//               >
//                 ✕
//               </button>
//             </div>

//             <p className="mt-2 text-sm font-bold">
//               Day {gameDay} • {type === "day" ? "Day Mission" : "Night Mission"}
//             </p>

//             {/* Vocabulary */}

//             <div className="mt-6">
//               <label className="block font-bold mb-2">📚 Vocabulary</label>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={vocabulary}
//                   onChange={(e) => setVocabulary(e.target.value)}
//                   placeholder="1 - 10"
//                   className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
//                 />

//                 <span className="font-bold">/10</span>
//               </div>
//             </div>

//             {/* Grammar */}

//             <div className="mt-4">
//               <label className="block font-bold mb-2">📝 Grammar</label>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={grammar}
//                   onChange={(e) => setGrammar(e.target.value)}
//                   placeholder="1 - 10"
//                   className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
//                 />

//                 <span className="font-bold">/10</span>
//               </div>
//             </div>

//             {/* Pronunciation */}

//             <div className="mt-4">
//               <label className="block font-bold mb-2">🗣️ Pronunciation</label>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={pronunciation}
//                   onChange={(e) => setPronunciation(e.target.value)}
//                   placeholder="1 - 10"
//                   className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
//                 />

//                 <span className="font-bold">/10</span>
//               </div>
//             </div>

//             {/* Submit */}

//             <button
//               onClick={submitResult}
//               className="mt-6 w-full border-3 border-black bg-green-300 py-4 rounded-sm font-bold text-xl hover:bg-green-400 active:translate-y-1 transition"
//             >
//               ✅ Submit Result
//             </button>

//             {/* Cancel */}

//             <button
//               onClick={() => setShowResultPopup(false)}
//               className="mt-3 w-full border-2 border-black bg-white py-3 rounded-sm font-bold"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getGameDay } from "../utils/gameDay";

import { GoogleGenAI, Modality } from "@google/genai";

// ============================================================
// VOICE TUTOR
// ============================================================

function VoiceTutor({ mission, gameDay, missionId }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const sessionRef = useRef(null);

  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceRef = useRef(null);
  const processorRef = useRef(null);

  // ----------------------------------------------------------
  // Base64 → Uint8Array
  // ----------------------------------------------------------

  const base64ToUint8Array = (base64) => {
    const binaryString = atob(base64);

    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  };

  // ----------------------------------------------------------
  // Play Gemini PCM audio
  // ----------------------------------------------------------

  const playPCM = async (base64Data) => {
    try {
      const audioContext = audioContextRef.current;

      if (!audioContext) return;

      const bytes = base64ToUint8Array(base64Data);

      // Gemini Live audio is PCM16
      const int16 = new Int16Array(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength / 2,
      );

      const float32 = new Float32Array(int16.length);

      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }

      const sampleRate = 24000;

      const audioBuffer = audioContext.createBuffer(
        1,
        float32.length,
        sampleRate,
      );

      audioBuffer.getChannelData(0).set(float32);

      const source = audioContext.createBufferSource();

      source.buffer = audioBuffer;

      source.connect(audioContext.destination);

      source.start();
    } catch (err) {
      console.error("❌ PCM playback error:", err);
    }
  };

  // ----------------------------------------------------------
  // Cleanup
  // ----------------------------------------------------------

  const cleanupVoiceTutor = () => {
    console.log("🧹 Cleaning Gemini Live resources...");

    // Stop microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());

      mediaStreamRef.current = null;
    }

    // Disconnect processor
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {}

      processorRef.current = null;
    }

    // Disconnect microphone source
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {}

      sourceRef.current = null;
    }

    // Close Gemini session
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch {}

      sessionRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}

      audioContextRef.current = null;
    }

    setConnected(false);
    setConnecting(false);
  };

  // ----------------------------------------------------------
  // Start Voice Mission
  // ----------------------------------------------------------

  const startVoiceMission = async () => {
    if (connecting || connected) return;

    try {
      setError("");
      setConnecting(true);

      console.log("🥑 Starting Gemini Voice Tutor...");

      // ------------------------------------------------------
      // 1. Get ephemeral token from backend
      // ------------------------------------------------------

      const tokenResponse = await fetch("/api/gemini-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();

        throw new Error(`Token request failed: ${errorText}`);
      }

      const tokenData = await tokenResponse.json();

      const token = tokenData.token;

      if (!token) {
        throw new Error("Gemini token was not returned by the server.");
      }

      console.log("🔑 Gemini token received.");

      // ------------------------------------------------------
      // 2. Create AudioContext
      // ------------------------------------------------------

      const audioContext = new AudioContext({
        sampleRate: 24000,
      });

      audioContextRef.current = audioContext;

      await audioContext.resume();

      // ------------------------------------------------------
      // 3. Create Gemini client
      // ------------------------------------------------------

      const ai = new GoogleGenAI({
        apiKey: token,
      });

      // ------------------------------------------------------
      // 4. Connect Gemini Live
      // ------------------------------------------------------

      console.log("🔌 Connecting Gemini Live...");

      const session = await ai.live.connect({
        model: "gemini-3.8-live",

        config: {
          responseModalities: [Modality.AUDIO],

          inputAudioTranscription: {},

          outputAudioTranscription: {},
        },

        callbacks: {
          // --------------------------------------------------
          // Connected
          // --------------------------------------------------

          onopen: () => {
            console.log("✅ Gemini Live connected.");

            setConnected(true);
            setConnecting(false);
          },

          // --------------------------------------------------
          // Gemini messages
          // --------------------------------------------------

          onmessage: async (message) => {
            console.log("📨 Gemini message:", message);

            const serverContent = message?.serverContent;

            if (!serverContent) return;

            // ----------------------------------------------
            // Gemini audio
            // ----------------------------------------------

            const modelTurn = serverContent.modelTurn;

            if (modelTurn?.parts) {
              for (const part of modelTurn.parts) {
                if (part.inlineData?.data) {
                  await playPCM(part.inlineData.data);
                }
              }
            }

            // ----------------------------------------------
            // User transcription
            // ----------------------------------------------

            if (serverContent.inputTranscription) {
              console.log("🗣️ You:", serverContent.inputTranscription.text);
            }

            // ----------------------------------------------
            // Gemini transcription
            // ----------------------------------------------

            if (serverContent.outputTranscription) {
              console.log("🥑 Gemini:", serverContent.outputTranscription.text);
            }

            // ----------------------------------------------
            // Turn complete
            // ----------------------------------------------

            if (serverContent.turnComplete) {
              console.log("✅ Gemini turn complete.");
            }
          },

          // --------------------------------------------------
          // Error
          // --------------------------------------------------

          onerror: (event) => {
            console.error("❌ Gemini Live error:", event);

            setError(event?.message || "Gemini Live connection error.");

            cleanupVoiceTutor();
          },

          // --------------------------------------------------
          // Closed
          // --------------------------------------------------

          onclose: (event) => {
            console.log("🔴 Gemini Live closed:", event?.reason);

            setConnected(false);
            setConnecting(false);
          },
        },
      });

      sessionRef.current = session;

      console.log("✅ Gemini Live session created.");

      // ------------------------------------------------------
      // 5. Send mission instructions
      // ------------------------------------------------------

      session.sendClientContent({
        turns: [
          {
            role: "user",

            parts: [
              {
                text: `
You are the German language tutor inside the
"Avocado Deutsch" learning game.

The learner is completing:

Day:
${gameDay}

Mission topic:
${mission.topic}

Mission description:
${mission.description}

Mission ID:
${missionId}


YOUR RULES:

- Speak mainly in German.
- Give English meaning when necessary.
- Ask only ONE question at a time.
- Wait for the learner's answer before continuing.
- Correct German mistakes briefly.
- Explain important mistakes simply.
- Keep the conversation related to this mission.
- Make the conversation interactive.
- Adapt to the learner's German level.
- Do not evaluate the learner before the mission is finished.


MISSION BEHAVIOUR:

Start naturally in German.

Briefly introduce the mission.

Then ask the learner the first question.

Ask only ONE question.

Wait for the learner's answer.

Continue the conversation naturally.

Do not ask multiple questions in one response.

Do not rush the learner.

Use simple German appropriate for a learner.

English can be used briefly when the learner is confused.


FINAL EVALUATION:

When the mission is clearly finished, evaluate exactly these categories:

Vocabulary: X/10
Grammar: X/10
Pronunciation: X/10

Pronunciation should only be evaluated because you have access
to the learner's actual microphone audio.

If pronunciation cannot be evaluated, use:

Pronunciation: N/A

After the scores, briefly explain:

1. What the learner did well.
2. What they should improve.
3. One recommendation for learning German.


IMPORTANT:

Do not reveal the evaluation before the mission is finished.

Do not interrupt the learner unnecessarily.

Start the mission now.
                `.trim(),
              },
            ],
          },
        ],

        turnComplete: true,
      });

      console.log("🥑 Mission instructions sent.");

      // ------------------------------------------------------
      // 6. Get microphone
      // ------------------------------------------------------

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,

          echoCancellation: true,

          noiseSuppression: true,

          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      console.log("🎤 Microphone access granted.");

      // ------------------------------------------------------
      // 7. Microphone → AudioContext
      // ------------------------------------------------------

      const source = audioContext.createMediaStreamSource(stream);

      sourceRef.current = source;

      // ------------------------------------------------------
      // 8. ScriptProcessor
      // ------------------------------------------------------

      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);

        // Convert Float32 → PCM16
        const pcm16 = new Int16Array(inputData.length);

        for (let i = 0; i < inputData.length; i++) {
          const sample = Math.max(-1, Math.min(1, inputData[i]));

          pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        }

        // Convert PCM16 → Base64

        let binary = "";

        const bytes = new Uint8Array(pcm16.buffer);

        const chunkSize = 0x8000;

        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(
            i,
            Math.min(i + chunkSize, bytes.length),
          );

          binary += String.fromCharCode(...chunk);
        }

        const base64 = btoa(binary);

        // Send audio to Gemini

        if (sessionRef.current && connected) {
          sessionRef.current.sendRealtimeInput({
            audio: {
              data: base64,
              mimeType: "audio/pcm;rate=24000",
            },
          });
        }
      };

      // ------------------------------------------------------
      // 9. Connect audio nodes
      // ------------------------------------------------------

      source.connect(processor);

      processor.connect(audioContext.destination);

      console.log("🎤 Microphone streaming started.");
    } catch (err) {
      console.error("❌ Failed to start voice tutor:", err);

      setError(err?.message || "Failed to start voice tutor.");

      cleanupVoiceTutor();
    }
  };

  // ----------------------------------------------------------
  // Stop Voice Mission
  // ----------------------------------------------------------

  const stopVoiceMission = () => {
    console.log("🛑 Stopping Voice Mission...");

    cleanupVoiceTutor();
  };

  // ----------------------------------------------------------
  // Cleanup when component unmounts
  // ----------------------------------------------------------

  useEffect(() => {
    return () => {
      cleanupVoiceTutor();
    };
  }, []);

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------

  return (
    <div className="mt-8">
      {/* Voice Tutor Card */}

      <div className="border-4 border-black bg-white p-5 rounded-sm">
        <h2 className="text-2xl font-bold">🥑 Voice Tutor</h2>

        <p className="mt-2 text-sm">
          Practice this mission with your German AI tutor using your microphone.
        </p>

        {/* Status */}

        <div className="mt-4">
          {connecting && (
            <div className="border-2 border-black bg-yellow-200 p-3 font-bold text-center">
              🔄 Connecting to Gemini...
            </div>
          )}

          {connected && (
            <div className="border-2 border-black bg-green-200 p-3 font-bold text-center">
              🟢 Voice Mission Active
            </div>
          )}

          {!connected && !connecting && (
            <div className="border-2 border-black bg-gray-100 p-3 font-bold text-center">
              ⚪ Voice Tutor Ready
            </div>
          )}
        </div>

        {/* Error */}

        {error && (
          <div className="mt-4 border-2 border-black bg-red-200 p-3 font-bold">
            ❌ {error}
          </div>
        )}

        {/* Start */}

        {!connected && !connecting && (
          <button
            onClick={startVoiceMission}
            className="mt-5 w-full border-3 border-black bg-green-300 py-4 rounded-sm font-bold text-xl hover:bg-green-400 active:translate-y-1 transition"
          >
            🎤 Start Voice Mission
          </button>
        )}

        {/* Stop */}

        {connected && (
          <button
            onClick={stopVoiceMission}
            className="mt-5 w-full border-3 border-black bg-red-300 py-4 rounded-sm font-bold text-xl hover:bg-red-400 active:translate-y-1 transition"
          >
            🛑 End Voice Mission
          </button>
        )}

        {/* Instructions */}

        <div className="mt-5 border-2 border-black bg-amber-100 p-4">
          <p className="font-bold">🎧 How to use</p>

          <ul className="mt-2 list-disc list-inside text-sm space-y-1">
            <li>Allow microphone access.</li>

            <li>Speak naturally in German.</li>

            <li>Gemini will respond with voice.</li>

            <li>Wait for Gemini to finish before answering.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MISSION COMPONENT
// ============================================================

export default function Mission() {
  const navigate = useNavigate();

  const { type } = useParams();

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  const [message, setMessage] = useState("");

  const [showResultPopup, setShowResultPopup] = useState(false);

  const [vocabulary, setVocabulary] = useState("");

  const [grammar, setGrammar] = useState("");

  const [pronunciation, setPronunciation] = useState("");

  const [savedResult, setSavedResult] = useState(null);

  const [mission, setMission] = useState(null);

  const [loadingMission, setLoadingMission] = useState(true);

  const [missionError, setMissionError] = useState("");

  // ----------------------------------------------------------
  // Game day
  // ----------------------------------------------------------

  const gameDay = getGameDay();

  // ----------------------------------------------------------
  // Mission ID
  //
  // MongoDB mission ID will be used when available.
  // ----------------------------------------------------------

  const [missionId, setMissionId] = useState(null);

  // ----------------------------------------------------------
  // Load mission from MongoDB
  // ----------------------------------------------------------

  useEffect(() => {
    const loadMission = async () => {
      try {
        setLoadingMission(true);

        setMissionError("");

        console.log(`🥑 Loading Day ${gameDay} missions...`);

        const response = await fetch(`/api/missions/day?day=${gameDay}`);

        if (!response.ok) {
          const errorText = await response.text();

          throw new Error(errorText || "Failed to load mission.");
        }

        const data = await response.json();

        console.log("🥑 MongoDB mission response:", data);

        const missions = data.missions || [];

        // Find day/night mission

        const selectedMission = missions.find((item) => item.session === type);

        if (!selectedMission) {
          throw new Error(`No ${type} mission found for Day ${gameDay}.`);
        }

        setMission(selectedMission);

        setMissionId(selectedMission._id);

        console.log("✅ Mission loaded:", selectedMission);
      } catch (error) {
        console.error("❌ Mission loading error:", error);

        setMissionError(error.message || "Failed to load mission.");
      } finally {
        setLoadingMission(false);
      }
    };

    loadMission();
  }, [gameDay, type]);

  // ----------------------------------------------------------
  // Load old local result temporarily
  //
  // We are keeping this during Phase 3A.
  // It will be removed in Phase 3B.
  // ----------------------------------------------------------

  useEffect(() => {
    if (!missionId) return;

    const savedResults = JSON.parse(
      localStorage.getItem("missionResults") || "{}",
    );

    const oldMissionId = `Day${gameDay}-${type}`;

    const result = savedResults[missionId] || savedResults[oldMissionId];

    if (result) {
      setSavedResult(result);
    }
  }, [missionId, gameDay, type]);

  // ----------------------------------------------------------
  // Loading
  // ----------------------------------------------------------

  if (loadingMission) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-amber-100 p-5">
        <div className="border-4 border-black bg-white p-8 text-center">
          <div className="text-4xl">🥑</div>

          <h2 className="text-2xl font-bold mt-3">Loading Mission...</h2>

          <p className="mt-2">Getting your mission from MongoDB.</p>
        </div>
      </main>
    );
  }

  // ----------------------------------------------------------
  // Error
  // ----------------------------------------------------------

  if (missionError || !mission) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-amber-100 p-5">
        <div className="border-4 border-black bg-white p-8 text-center max-w-md">
          <div className="text-4xl">🥑</div>

          <h2 className="text-2xl font-bold mt-3">No Mission Available</h2>

          <p className="mt-3">
            {missionError || `No mission available for Day ${gameDay}.`}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 border-2 border-black bg-yellow-300 px-5 py-3 font-bold"
          >
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  // ----------------------------------------------------------
  // Open result popup
  // ----------------------------------------------------------

  const openResultPopup = () => {
    if (savedResult) {
      setVocabulary(savedResult.Vocabulary);

      setGrammar(savedResult.Grammar);

      setPronunciation(savedResult.Pronunciation);
    }

    setShowResultPopup(true);

    setMessage("");
  };

  // ----------------------------------------------------------
  // Submit result
  //
  // NOTE:
  // Still localStorage for Phase 3A.
  // MongoDB progress will replace this in Phase 3B.
  // ----------------------------------------------------------

  const submitResult = () => {
    const vocab = Number(vocabulary);

    const gram = Number(grammar);

    const pron = Number(pronunciation);

    // ------------------------------------------------------
    // Validate
    // ------------------------------------------------------

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
      setMessage("⚠️ Please enter a score from 1 to 10 for all categories.");

      return;
    }

    // ------------------------------------------------------
    // Result
    // ------------------------------------------------------

    const result = {
      Vocabulary: vocab,

      Grammar: gram,

      Pronunciation: pron,
    };

    // ------------------------------------------------------
    // Get existing results
    // ------------------------------------------------------

    const savedResults = JSON.parse(
      localStorage.getItem("missionResults") || "{}",
    );

    // ------------------------------------------------------
    // Save result
    // ------------------------------------------------------

    savedResults[missionId] = result;

    localStorage.setItem("missionResults", JSON.stringify(savedResults));

    // ------------------------------------------------------
    // Update state
    // ------------------------------------------------------

    setSavedResult(result);

    // ------------------------------------------------------
    // Completed missions
    // ------------------------------------------------------

    const completedMissions = JSON.parse(
      localStorage.getItem("completedMissions") || "[]",
    );

    if (!completedMissions.includes(missionId)) {
      completedMissions.push(missionId);

      localStorage.setItem(
        "completedMissions",
        JSON.stringify(completedMissions),
      );
    }

    // ------------------------------------------------------
    // Close popup
    // ------------------------------------------------------

    setShowResultPopup(false);

    // ------------------------------------------------------
    // Clear inputs
    // ------------------------------------------------------

    setVocabulary("");

    setGrammar("");

    setPronunciation("");

    setMessage("🥑 Mission result submitted successfully!");
  };

  // ----------------------------------------------------------
  // Total score
  // ----------------------------------------------------------

  const totalScore = savedResult
    ? savedResult.Vocabulary + savedResult.Grammar + savedResult.Pronunciation
    : 0;

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-amber-100 p-5">
      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <button
        onClick={() => navigate(-1)}
        className="border-2 border-black px-4 py-2 rounded-sm font-bold bg-white"
      >
        ← Back
      </button>

      {/* =====================================================
          MISSION CONTENT
      ===================================================== */}

      <div className="max-w-xl mx-auto mt-10">
        {/* Day */}

        <p className="text-sm font-bold">DAY {gameDay}</p>

        {/* Mission type */}

        <h1 className="text-3xl font-bold mt-2">
          {type === "day" ? "Day Mission" : "Night Mission"}
        </h1>

        {/* Topic */}

        <h2 className="text-2xl font-bold mt-8">{mission.topic}</h2>

        {/* Description */}

        <p className="mt-4 text-lg leading-7">{mission.description}</p>

        {/* =================================================
            MISSION DATABASE INFO
        ================================================= */}

        <div className="mt-4 border-2 border-black bg-white p-3 text-xs">
          <p>
            <strong>MongoDB Mission ID:</strong>
          </p>

          <p className="break-all mt-1">{mission._id}</p>
        </div>

        {/* =================================================
            VOICE TUTOR
            Embedded directly in this file
        ================================================= */}

        <VoiceTutor mission={mission} gameDay={gameDay} missionId={missionId} />

        {/* =================================================
            STATUS MESSAGE
        ================================================= */}

        {message && (
          <div className="mt-4 border-2 border-black bg-white p-3 text-center font-bold">
            {message}
          </div>
        )}

        {/* =================================================
            SUBMIT RESULT
        ================================================= */}

        <button
          onClick={openResultPopup}
          className="mt-6 w-full border-3 border-black bg-yellow-300 py-4 rounded-sm font-bold text-xl hover:bg-yellow-400 active:translate-y-1 transition"
        >
          📤 Submit Result
        </button>

        {/* =================================================
            SAVED RESULT
        ================================================= */}

        {savedResult && (
          <div className="mt-8 border-4 border-black bg-green-100 p-5 rounded-sm">
            <h2 className="text-2xl font-bold text-center">
              🥑 Mission Result
            </h2>

            <p className="text-center font-bold mt-1">{mission.topic}</p>

            {/* Scores */}

            <div className="mt-6 space-y-3">
              {/* Vocabulary */}

              <div className="flex items-center justify-between border-2 border-black bg-white p-3">
                <span className="font-bold">📚 Vocabulary</span>

                <span className="text-xl font-bold">
                  {savedResult.Vocabulary}/10
                </span>
              </div>

              {/* Grammar */}

              <div className="flex items-center justify-between border-2 border-black bg-white p-3">
                <span className="font-bold">📝 Grammar</span>

                <span className="text-xl font-bold">
                  {savedResult.Grammar}/10
                </span>
              </div>

              {/* Pronunciation */}

              <div className="flex items-center justify-between border-2 border-black bg-white p-3">
                <span className="font-bold">🗣️ Pronunciation</span>

                <span className="text-xl font-bold">
                  {savedResult.Pronunciation}/10
                </span>
              </div>
            </div>

            {/* Total */}

            <div className="mt-5 border-3 border-black bg-yellow-300 p-4 text-center">
              <p className="font-bold">⭐ Total Score</p>

              <p className="text-3xl font-bold">{totalScore}/30</p>
            </div>

            {/* Completed */}

            <div className="mt-4 text-center font-bold">
              ✅ Mission Completed
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          RESULT POPUP
      ===================================================== */}

      {showResultPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-amber-100 border-4 border-black p-5 rounded-sm shadow-xl">
            {/* Header */}

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">🥑 Submit Result</h2>

              <button
                onClick={() => setShowResultPopup(false)}
                className="border-2 border-black px-2 py-1 font-bold bg-white"
              >
                ✕
              </button>
            </div>

            {/* Mission info */}

            <p className="mt-2 text-sm font-bold">
              Day {gameDay} • {type === "day" ? "Day Mission" : "Night Mission"}
            </p>

            {/* Vocabulary */}

            <div className="mt-6">
              <label className="block font-bold mb-2">📚 Vocabulary</label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={vocabulary}
                  onChange={(e) => setVocabulary(e.target.value)}
                  placeholder="1 - 10"
                  className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
                />

                <span className="font-bold">/10</span>
              </div>
            </div>

            {/* Grammar */}

            <div className="mt-4">
              <label className="block font-bold mb-2">📝 Grammar</label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={grammar}
                  onChange={(e) => setGrammar(e.target.value)}
                  placeholder="1 - 10"
                  className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
                />

                <span className="font-bold">/10</span>
              </div>
            </div>

            {/* Pronunciation */}

            <div className="mt-4">
              <label className="block font-bold mb-2">🗣️ Pronunciation</label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={pronunciation}
                  onChange={(e) => setPronunciation(e.target.value)}
                  placeholder="1 - 10"
                  className="w-full border-2 border-black p-3 bg-white text-lg font-bold"
                />

                <span className="font-bold">/10</span>
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
              onClick={() => setShowResultPopup(false)}
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
