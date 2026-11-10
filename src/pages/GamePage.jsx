import { useCallback } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Trophy,
  ArrowRight,
} from "lucide-react";

import GameHeader from "../components/GameHeader";

import ReactionRush from "../games/ReactionRush";
import MemoryMatch from "../games/MemoryMatch";
import QuickPuzzle from "../games/QuickPuzzle";
import SwipeChallenge from "../games/SwipeChallenge";
import FinalCode from "../games/FinalCode";

import { games } from "../data/gameConfig";

const gameComponents = {
  1: ReactionRush,
  2: MemoryMatch,
  3: QuickPuzzle,
  4: SwipeChallenge,
  5: FinalCode,
};

export default function GamePage({
  completed,
  isUnlocked,
  completeLevel,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const level = Number(id);

  if (!Number.isInteger(level) || !gameComponents[level]) {
    return <Navigate to="/" replace />;
  }

  if (!isUnlocked(level)) {
    return <Navigate to="/" replace />;
  }

  const Game = gameComponents[level];
  const game = games[level - 1];

  const handleComplete = useCallback(() => {
    completeLevel(level);

    if (level === 5) {
      navigate("/victory");
    } else {
      navigate(`/game/${level + 1}`);
    }
  }, [level, completeLevel, navigate]);

  return (
    <main className="min-h-screen pb-16">
      <GameHeader
        current={level}
        completed={completed}
      />

      <div className="max-w-4xl mx-auto px-5 mt-16">
        <motion.div
          key={level}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-xs font-bold tracking-widest mb-5">
            LEVEL {level} OF 5
          </div>

          <h1 className="text-4xl md:text-5xl font-black">
            {game.name}
          </h1>

          <p className="text-slate-400 mt-4">
            {game.description}
          </p>
        </motion.div>

        <div className="mt-12 bg-white/[0.04] border border-white/10 rounded-3xl p-6 md:p-10 min-h-[420px] flex flex-col justify-center">
  <Game
    onComplete={handleComplete}
  />

  <div className="flex justify-center mt-8">
    <button
      onClick={handleComplete}
      className="px-6 py-3 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300 text-sm font-semibold"
    >
      Skip Game <ArrowRight size={16} className="inline ml-2" />
    </button>
  </div>
</div>

        <div className="flex items-center justify-center gap-2 text-slate-600 text-xs mt-7">
          {completed.includes(level) ? (
            <Trophy size={14} />
          ) : (
            <Lock size={14} />
          )}
          Complete this challenge to unlock the next level
        </div>
      </div>
    </main>
  );
}