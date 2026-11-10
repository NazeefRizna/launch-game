import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Clock, RotateCcw } from "lucide-react";

export default function ReactionRush({ onComplete }) {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished || score >= 10) return;

    if (time === 0) {
      setFinished(true);
      return;
    }

    const timer = setTimeout(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, finished, score]);

  useEffect(() => {
    if (score >= 10) {
      setFinished(true);
      onComplete();
    }
  }, [score, onComplete]);

  const restart = () => {
    setScore(0);
    setTime(15);
    setFinished(false);
  };

  return (
    <div className="text-center">
      <div className="flex justify-center gap-8 mb-8">
        <div>
          <p className="text-slate-400 text-sm">TARGETS</p>
          <p className="text-3xl font-bold">{score}/10</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">TIME LEFT</p>
          <p className="text-3xl font-bold text-cyan-400">
            {time}s
          </p>
        </div>
      </div>

      {!finished ? (
        <div className="min-h-64 flex items-center justify-center">
          <motion.button
            whileTap={{ scale: 0.8 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            onClick={() => setScore((s) => s + 1)}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl shadow-blue-500/30 flex items-center justify-center"
          >
            <Target size={55} className="text-white" />
          </motion.button>
        </div>
      ) : score >= 10 ? (
        <div className="py-12">
          <h2 className="text-3xl font-bold text-green-400">
            Excellent reflexes!
          </h2>
          <p className="text-slate-400 mt-3">
            You've completed the challenge.
          </p>
        </div>
      ) : (
        <div className="py-12">
          <h2 className="text-2xl font-bold">Time's up!</h2>
          <p className="text-slate-400 mt-3">
            You reached {score} targets. Try again!
          </p>

          <button
            onClick={restart}
            className="mt-6 px-6 py-3 bg-blue-600 rounded-xl inline-flex gap-2"
          >
            <RotateCcw size={18} /> Retry
          </button>
        </div>
      )}
    </div>
  );
}