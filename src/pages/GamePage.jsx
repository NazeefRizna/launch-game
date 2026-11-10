
import { useCallback, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import {
  Lock,
  Trophy,
  ArrowRight,
  Play,
  Target,
  Clock,
  MousePointer2,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Hash,
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

const instructions = {
  1: {
    subtitle: "Test your reflexes and reaction speed.",
    objective: "Hit 10 moving targets before the timer runs out.",
    rules: [
      "Click the glowing target whenever it appears.",
      "The target changes position after every successful hit.",
      "You have only 10 seconds to complete the challenge.",
    ],
    tip: "Keep your eyes on the target and react as quickly as possible.",
    difficulty: "Fast Reflexes",
    icon: Target,
  },

  2: {
    subtitle: "Challenge your memory and concentration.",
    objective: "Find all 4 matching pairs of hidden cards.",
    rules: [
      "Select two cards to reveal their symbols.",
      "Matching pairs remain revealed.",
      "Non-matching cards turn face down again.",
      "Find all pairs to complete the challenge.",
    ],
    tip: "Pay attention to the positions of previously revealed cards.",
    difficulty: "Memory & Focus",
    icon: RotateCcw,
  },

  3: {
    subtitle: "Put your problem-solving skills to the test.",
    objective: "Arrange the numbered tiles in the correct order from 1 to 8.",
    rules: [
      "Click a tile next to the empty space to move it.",
      "Arrange the numbers in ascending order.",
      "The empty space should be at the bottom-right corner.",
      "Complete the arrangement to win.",
    ],
    tip: "Think a few moves ahead instead of moving tiles randomly.",
    difficulty: "Logic & Strategy",
    icon: Hash,
  },

  4: {
    subtitle: "Follow the directions without losing focus.",
    objective: "Complete 12 randomized directional prompts.",
    rules: [
      "Watch the arrow displayed on the screen.",
      "Press the corresponding directional button.",
      "You can make a maximum of 2 mistakes.",
      "Three mistakes will fail the challenge.",
    ],
    tip: "Stay focused. The directions can change quickly and may repeat.",
    difficulty: "Accuracy & Focus",
    icon: MousePointer2,
  },

  5: {
    subtitle: "One final challenge stands between you and victory.",
    objective: "Crack the secret four-digit code within 6 attempts.",
    rules: [
      "Enter a four-digit number and submit your guess.",
      "Green means the digit and its position are correct.",
      "Yellow means the digit exists but is in the wrong position.",
      "Red means the digit does not exist in the secret code.",
      "Use the feedback to figure out the correct combination.",
    ],
    tip: "Use the colour feedback from previous attempts to narrow down the possibilities.",
    difficulty: "Code Breaking",
    icon: ShieldCheck,
  },
};

export default function GamePage({
  completed,
  isUnlocked,
  completeLevel,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Track which route the user has started.
  // A new level has a new location key, so instructions appear again.
  const [startedLocationKey, setStartedLocationKey] = useState(null);

  const started = startedLocationKey === location.key;

  const level = Number(id);

  if (!Number.isInteger(level) || !gameComponents[level]) {
    return <Navigate to="/" replace />;
  }

  if (!isUnlocked(level)) {
    return <Navigate to="/" replace />;
  }

  const Game = gameComponents[level];
  const game = games[level - 1];
  const instruction = instructions[level];
  const InstructionIcon = instruction.icon;

  // Successfully complete the current challenge
  const handleComplete = useCallback(() => {
    completeLevel(level);

    if (level === 5) {
      navigate("/victory");
    } else {
      navigate(`/game/${level + 1}`);
    }
  }, [level, completeLevel, navigate]);

  // Skip the current challenge
  const handleSkip = () => {
    completeLevel(level);

    if (level === 5) {
      navigate("/victory");
    } else {
      navigate(`/game/${level + 1}`);
    }
  };

  return (
    <main className="min-h-screen pb-16">

      <GameHeader
        current={level}
        completed={completed}
      />

      <div className="max-w-4xl mx-auto px-5 mt-16">

        {/* LEVEL HEADER */}
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

        {/* MAIN GAME CONTAINER */}
        <div className="mt-12 bg-white/[0.04] border border-white/10 rounded-3xl p-6 md:p-10 min-h-[420px] flex flex-col justify-center">

          <AnimatePresence mode="wait">

            {!started ? (

              /* INSTRUCTION SCREEN */
              <motion.div
                key="instructions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto w-full"
              >

                <div className="text-center mb-8">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                    <InstructionIcon size={32} />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    How to Play
                  </h2>

                  <p className="text-slate-400 mt-2">
                    {instruction.subtitle}
                  </p>

                </div>

                {/* OBJECTIVE */}
                <div className="bg-blue-500/5 border border-blue-400/20 rounded-2xl p-5 mb-6">

                  <div className="flex items-center gap-2 text-blue-300 text-sm font-bold mb-2">
                    <Target size={17} />
                    YOUR OBJECTIVE
                  </div>

                  <p className="text-white leading-relaxed">
                    {instruction.objective}
                  </p>

                </div>

                {/* RULES */}
                <div className="mb-7">

                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Lightbulb size={18} className="text-yellow-400" />
                    Game Rules
                  </h3>

                  <div className="space-y-3">

                    {instruction.rules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed"
                      >
                        <span className="w-6 h-6 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-blue-300">
                          {index + 1}
                        </span>

                        <p>{rule}</p>
                      </div>
                    ))}

                  </div>

                </div>

                {/* PRO TIP */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-7">

                  <div className="flex items-center gap-2 text-purple-300 text-sm font-bold mb-2">
                    <Lightbulb size={16} />
                    PRO TIP
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {instruction.tip}
                  </p>

                </div>

                {/* DIFFICULTY */}
                <div className="flex justify-center mb-7">

                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                    <Clock size={15} />
                    {instruction.difficulty}
                  </div>

                </div>

                {/* START GAME */}
                <button
                  onClick={() => setStartedLocationKey(location.key)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black tracking-wider flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <Play size={19} fill="currentColor" />
                  START GAME
                  <ArrowRight size={18} />
                </button>

                {/* SKIP FROM INSTRUCTIONS */}
                <button
                  onClick={handleSkip}
                  className="w-full mt-4 py-3 text-sm font-semibold text-slate-500 hover:text-white transition-colors"
                >
                  Skip This Level
                  <ArrowRight size={15} className="inline ml-2" />
                </button>

              </motion.div>

            ) : (

              /* GAME SCREEN */
              <motion.div
                key="game"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >

                <Game
                  key={location.key}
                  onComplete={handleComplete}
                />

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">

                  {/* VIEW INSTRUCTIONS */}
                  <button
                    onClick={() => setStartedLocationKey(null)}
                    className="px-6 py-3 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300 text-sm font-semibold"
                  >
                    View Instructions
                  </button>

                  {/* SKIP GAME */}
                  <button
                    onClick={handleSkip}
                    className="px-6 py-3 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300 text-sm font-semibold"
                  >
                    Skip Game
                    <ArrowRight size={16} className="inline ml-2" />
                  </button>

                </div>

              </motion.div>

            )}

          </AnimatePresence>

        </div>

        {/* LEVEL STATUS */}
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
