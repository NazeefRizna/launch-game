
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Admin from "./pages/Admin";
import useGameProgress from "./hooks/useGameProgress";
import useEventStatus from "./hooks/useEventStatus";

import Welcome from "./pages/Welcome";
import GamePage from "./pages/GamePage";
import Victory from "./pages/Victory";

function WaitingPage() {
  return (
    <div className="min-h-screen bg-[#080B18] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6">🚀</div>

        <h1 className="text-4xl font-bold mb-4">
          LAUNCHQUEST
        </h1>

        <p className="text-xl text-slate-300 mb-3">
          Get ready for the challenge!
        </p>

        <p className="text-slate-500">
          The event hasn't started yet. Please wait for the organizer
          to open the game.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Waiting for event to start...
        </div>
      </div>
    </div>
  );
}

function LoadingPage() {
  return (
    <div className="min-h-screen bg-[#080B18] text-white flex items-center justify-center">
      <p className="text-slate-400">
        Connecting to LAUNCHQUEST...
      </p>
    </div>
  );
}

function RedirectPage({ url }) {
  useEffect(() => {
    if (!url) return;

    const timer = setTimeout(() => {
      window.location.replace(url);
    }, 3500);

    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="min-h-screen bg-[#080B18] text-white flex items-center justify-center">
      <p className="text-slate-300">
        Redirecting you to the launch website...
      </p>
    </div>
  );
}

function FinalVictory({ isFinished, websiteUrl }) {
  if (!isFinished) {
    return <Victory isFinished={false} />;
  }

  return (
    <>
      <Victory isFinished={true} />

      <div className="fixed bottom-5 left-0 right-0 text-center text-sm text-green-400 pointer-events-none">
        Redirecting to the launch website...
      </div>

      <RedirectPage url={websiteUrl} />
    </>
  );
}

export default function App() {
  const {
    eventState,
    loading,
    connectionError,
  } = useEventStatus();

  // Progress is now linked to the current event ID.
  const {
    completedLevels,
    completeLevel,
    isUnlocked,
    isFinished,
    resetProgress,
  } = useGameProgress(eventState?.eventId);

  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  // Admin remains accessible even after the event ends.
  if (isAdminRoute) {
    return <Admin />;
  }

  if (loading || !eventState || !eventState.eventId) {
    return <LoadingPage />;
  }

  // Event ended: redirect participants.
  if (eventState.status === "ended" && eventState.websiteUrl) {
    return <RedirectPage url={eventState.websiteUrl} />;
  }

  // Event hasn't started.
  if (eventState.status === "waiting") {
    return <WaitingPage />;
  }

  if (eventState.status !== "running") {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-[#080B18] text-white">

      {connectionError && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-black text-center text-xs p-2">
          Reconnecting to event server...
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={<Welcome completed={completedLevels} />}
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
            <FinalVictory
              isFinished={isFinished}
              websiteUrl={eventState.websiteUrl}
            />
          }
        />

        <Route
          path="*"
          element={<Welcome completed={completedLevels} />}
        />
      </Routes>

      <button
        onClick={resetProgress}
        className="fixed bottom-3 right-3 z-50 text-[10px] text-slate-600 hover:text-white bg-black/40 px-3 py-2 rounded-lg"
      >
        Reset demo
      </button>
    </div>
  );
}
