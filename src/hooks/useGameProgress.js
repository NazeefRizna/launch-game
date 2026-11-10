import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "launch-game-progress";

export default function useGameProgress() {
  const [completedLevels, setCompletedLevels] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(completedLevels)
    );
  }, [completedLevels]);

  const completeLevel = useCallback((level) => {
  setCompletedLevels((previous) =>
    previous.includes(level)
      ? previous
      : [...previous, level]
  );
}, []);

  const isUnlocked = (level) => {
    if (level === 1) return true;
    return completedLevels.includes(level - 1);
  };

  const handleReset = () => {
  localStorage.clear();
  window.location.reload();
};

  return {
    completedLevels,
    completeLevel,
    isUnlocked,
    resetProgress,
    isFinished: completedLevels.length === 5,
  };
}