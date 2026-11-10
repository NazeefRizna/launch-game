
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Target, Clock, Zap } from "lucide-react";

const GAME_TIME = 11;
const TARGET_COUNT = 10;

function getRandomPosition() {
  return {
    x: Math.random() * 80 + 5,
    y: Math.random() * 75 + 5,
  };
}

export default function ReactionRush({ onComplete }) {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_TIME);
  const [finished, setFinished] = useState(false);
  const [position, setPosition] = useState(getRandomPosition());

  useEffect(() => {
    if (finished) return;

    if (time <= 0) {
      setFinished(true);
      return;
    }

    const timer = setTimeout(() => {
      setTime((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, finished]);

  useEffect(() => {
    if (score >= TARGET_COUNT) {
      setFinished(true);
      onComplete();
    }
  }, [score, onComplete]);

  const handleTargetClick = () => {
    if (finished) return;

    setScore((previous) => previous + 1);
    setPosition(getRandomPosition());
  };

  const retry = () => {
    setScore(0);
    setTime(GAME_TIME);
    setFinished(false);
    setPosition(getRandomPosition());
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">

      <div className="flex justify-between mb-8">
        <div className="flex items-center gap-2 text-blue-300">
          <Target size={18} />
          <span className="font-bold">{score}/{TARGET_COUNT}</span>
        </div>

        <div className="flex items-center gap-2 text-purple-300">
          <Clock size={18} />
          <span className="font-bold">{time}s</span>
        </div>
      </div>

      {finished ? (
        <div className="py-16">
          {score >= TARGET_COUNT ? (
            <h2 className="text-3xl font-black text-green-400">
              Challenge Completed!
            </h2>
          ) : (
            <>
              <h2 className="text-3xl font-black text-red-400">
                Time's Up!
              </h2>

              <p className="text-slate-400 mt-3">
                You scored {score} out of {TARGET_COUNT}.
              </p>

              <button
                onClick={retry}
                className="mt-6 px-6 py-3 rounded-xl bg-blue-500 text-white font-bold"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="text-slate-400 mb-5">
            Hit the moving target 10 times before time runs out!
          </p>

          <div className="relative w-full h-[350px] bg-slate-900/70 border border-white/10 rounded-2xl overflow-hidden">

            <motion.button
              key={score}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              transition={{ duration: 0.18 }}
              onClick={handleTargetClick}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-500 hover:bg-cyan-400 shadow-lg shadow-blue-500/40 flex items-center justify-center text-white"
              aria-label="Hit target"
            >
              <Zap size={23} fill="currentColor" />
            </motion.button>

          </div>
        </>
      )}
    </div>
  );
}
