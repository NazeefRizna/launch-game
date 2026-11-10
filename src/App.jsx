import { Routes, Route } from "react-router-dom";

import useGameProgress from "./hooks/useGameProgress";

import Welcome from "./pages/Welcome";
import GamePage from "./pages/GamePage";
import Victory from "./pages/Victory";
import SampleWebsite from "./pages/SampleWebsite";

export default function App() {
  const {
    completedLevels,
    completeLevel,
    isUnlocked,
    isFinished,
    resetProgress,
  } = useGameProgress();

  return (
    <div className="min-h-screen bg-[#080B18] text-white">

      <Routes>
        <Route
          path="/"
          element={
            <Welcome completed={completedLevels} />
          }
        />

        <Route
          path="/game/:id"
          element={
            <GamePage
              completed={completedLevels}
              isUnlocked={isUnlocked}
              completeLevel={completeLevel}
            />
          }
        />

        <Route
          path="/victory"
          element={
            <Victory isFinished={isFinished} />
          }
        />

        <Route
          path="/website"
          element={
            isFinished
              ? <SampleWebsite />
              : <Welcome completed={completedLevels} />
          }
        />
      </Routes>

      {/* MVP demonstration reset */}
      <button
        onClick={resetProgress}
        className="fixed bottom-3 right-3 z-50 text-[10px] text-slate-600 hover:text-white bg-black/40 px-3 py-2 rounded-lg"
      >
        Reset demo
      </button>
    </div>
  );
}