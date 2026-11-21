
import { useState, useEffect, useCallback } from "react";

export default function useGameProgress(eventId) {
  const [progress, setProgress] = useState({
    eventId: null,
    completedLevels: [],
  });

  // Load progress for the current event.
  useEffect(() => {
    if (!eventId) return;

    const storageKey = `launch-game-progress:${eventId}`;

    try {
      const savedProgress = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      setProgress({
        eventId,
        completedLevels: Array.isArray(savedProgress)
          ? savedProgress
          : [],
      });
    } catch {
      setProgress({
        eventId,
        completedLevels: [],
      });
    }
  }, [eventId]);

  // Save progress only after the correct event has loaded.
  useEffect(() => {
    if (!eventId || progress.eventId !== eventId) return;

    const storageKey = `launch-game-progress:${eventId}`;

    localStorage.setItem(
      storageKey,
      JSON.stringify(progress.completedLevels)
    );
  }, [eventId, progress]);

  // Mark a level as completed.
  const completeLevel = useCallback(
    (level) => {
      if (!eventId) return;

      setProgress((previous) => {
        if (previous.eventId !== eventId) {
          return previous;
        }

        if (previous.completedLevels.includes(level)) {
          return previous;
        }

        return {
          ...previous,
          completedLevels: [
            ...previous.completedLevels,
            level,
          ],
        };
      });
    },
    [eventId]
  );

  // Check whether a level is unlocked.
  const isUnlocked = useCallback(
    (level) => {
      if (level === 1) return true;

      if (progress.eventId !== eventId) return false;

      return progress.completedLevels.includes(level - 1);
    },
    [eventId, progress]
  );

  // Reset progress for the current event only.
  const resetProgress = useCallback(() => {
    if (!eventId) return;

    localStorage.removeItem(
      `launch-game-progress:${eventId}`
    );

    setProgress({
      eventId,
      completedLevels: [],
    });

    window.location.href = "/";
  }, [eventId]);

  // Prevent old progress from being used while a new event loads.
  const completedLevels =
    progress.eventId === eventId
      ? progress.completedLevels
      : [];

  return {
    completedLevels,
    completeLevel,
    isUnlocked,
    resetProgress,
    isFinished: completedLevels.length === 5,
  };
}
