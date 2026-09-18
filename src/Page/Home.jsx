// import { useNavigate } from "react-router-dom";

// import Header from "../Components/Header";
// import Day from "../Components/Day";
// import ProgressBar from "../Components/ProgressBar";
// import Task from "../Components/Task";

// export default function Home() {
//   const navigate = useNavigate();

//   const walkCompleted = localStorage.getItem("walkCompleted") === "true";

//   const letterCompleted = localStorage.getItem("letterCompleted") === "true";

//   // First visit
//   if (!walkCompleted) {
//     return (
//       <div className="p-2">
//         <Header />

//         <div className="min-h-[80vh] flex items-center justify-center">
//           <button onClick={() => navigate("/walk")} className="px-6 py-3">
//             Go for a Walk
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Walk finished, but Letter not finished
//   if (!letterCompleted) {
//     return (
//       <div className="p-2">
//         <Header />

//         <div className="min-h-[80vh] flex items-center justify-center">
//           <button onClick={() => navigate("/letter")} className="px-6 py-3">
//             Start the Journey
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Everything finished → normal game home
//   return (
//     <div className="p-2">
//       <Header />
//       <Day />
//       <ProgressBar />
//       <Task />
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";

import Header from "../Components/Header";
import Day from "../Components/Day";
import ProgressBar from "../Components/ProgressBar";
import Task from "../Components/Task";
import ExtraQuest from "../Components/ExtraQuest";

export default function Home() {
  const navigate = useNavigate();

  const walkCompleted = localStorage.getItem("walkCompleted") === "true";

  const letterCompleted = localStorage.getItem("letterCompleted") === "true";

  // First visit
  if (!walkCompleted) {
    return (
      <div className="p-2">
        <Header />

        <div className="min-h-[80vh] flex items-center justify-center">
          <button onClick={() => navigate("/walk")} className="px-6 py-3">
            Go for a Walk
          </button>
        </div>
      </div>
    );
  }

  // Walk finished, but Letter not finished
  if (!letterCompleted) {
    return (
      <div className="p-2">
        <Header />

        <div className="min-h-[80vh] flex items-center justify-center">
          <button onClick={() => navigate("/letter")} className="px-6 py-3">
            Start the Journey
          </button>
        </div>
      </div>
    );
  }

  // Everything finished → normal game home
  return (
    <div className="p-2">
      <Header />

      <Day />

      <ProgressBar />

      {/* Main Missions */}
      <Task />

      {/* Extra Quest */}
      <ExtraQuest />
    </div>
  );
}
