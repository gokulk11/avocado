import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Page/Home";
import Letter from "./Page/Letter";
import Story from "./Page/Story";

import { isOnboardingComplete } from "./utils/onboarding";
import Walk from "./Page/Walk";

function App() {
  const onboardingComplete = isOnboardingComplete();

  return (
    <BrowserRouter>
      <section
        className="w-full min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/bg-1.png')" }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/walk" element={<Walk />} />
          <Route path="/letter" element={<Letter />} />
          <Route path="/story/:day" element={<Story />} />
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default App;
