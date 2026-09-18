import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Page/Home";
import Letter from "./Page/Letter";
import Story from "./Page/Story";
import Mission from "./Page/Mission";
import Walk from "./Page/Walk";
import ExtraQuestPage from "./Page/ExtraQuestPage";

import { isOnboardingComplete } from "./utils/onboarding";

function App() {
  const onboardingComplete = isOnboardingComplete();

  return (
    <BrowserRouter>
      <section
        className="w-full min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('/bg-1.png')",
        }}
      >
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Walking / Onboarding */}
          <Route path="/walk" element={<Walk />} />

          {/* Letter */}
          <Route path="/letter" element={<Letter />} />

          {/* Story */}
          <Route path="/story/:day" element={<Story />} />

          {/* Mission */}
          <Route path="/mission/:type" element={<Mission />} />

          <Route path="/extra-quest" element={<ExtraQuestPage />} />
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default App;
