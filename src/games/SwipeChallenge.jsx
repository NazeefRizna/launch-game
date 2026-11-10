
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Timer,
  RotateCcw,
} from "lucide-react";

const TOTAL_STEPS = 16;
const MAX_MISTAKES = 2;
const TIME_LIMIT = 1200;

const directions = ["UP", "DOWN", "LEFT", "RIGHT"];

const icons = {
  UP: ArrowUp,
  DOWN: ArrowDown,
  LEFT: ArrowLeft,
  RIGHT: ArrowRight,
};

function generateSequence() {
  const sequence = [];

  for (let i = 0; i < TOTAL_STEPS; i++) {
    let next;

    do {
      next = directions[Math.floor(Math.random() * directions.length)];
    } while (next === sequence[i - 1]);

    sequence.push(next);
  }

  return sequence;
}

export default function SwipeChallenge({ onComplete }) {
  const [sequence, setSequence] = useState(generateSequence);
  const [currentStep, setCurrentStep] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [failed, setFailed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const resetGame = useCallback(() => {
    setSequence(generateSequence());
    setCurrentStep(0);
    setMistakes(0);
    setTimeLeft(TIME_LIMIT);
    setStarted(false);
    setCountdown(3);
    setFailed(false);
    setFinished(false);
    setFeedback(null);
  }, []);

  // Countdown before starting
  useEffect(() => {
    if (started || failed || finished) return;

    if (countdown <= 0) {
      setStarted(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((previous) => previous - 1);
    }, 700);

    return () => clearTimeout(timer);
  }, [countdown, started, failed, finished]);

  // Response timer
  useEffect(() => {
    if (!started || failed || finished) return;

    setTimeLeft(TIME_LIMIT);

    const startTime = Date.now();

    const timer = setInterval(() => {
      const remaining = TIME_LIMIT - (Date.now() - startTime);

      if (remaining <= 0) {
        setTimeLeft(0);
        setFailed(true);
      } else {
        setTimeLeft(remaining);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [currentStep, started, failed, finished]);

  // Handle direction input
  const handleDirection = (direction) => {
    if (!started || failed || finished) return;

    if (direction === sequence[currentStep]) {
      setFeedback("correct");

      if (currentStep + 1 === TOTAL_STEPS) {
        setFinished(true);
        setStarted(false);
        setTimeout(() => onComplete(), 700);
      } else {
        setCurrentStep((previous) => previous + 1);
      }
    } else {
      setFeedback("wrong");

      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);

      if (nextMistakes >= MAX_MISTAKES) {
        setFailed(true);
        setStarted(false);
      }
    }
  };

  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => setFeedback(null), 250);

    return () => clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyMap = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };

      if (keyMap[event.key]) {
        event.preventDefault();
        handleDirection(keyMap[event.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const CurrentIcon = icons[sequence[currentStep]];

  return (
    <div className="max-w-xl mx-auto w-full text-center">

      <h2 className="text-2xl font-black text-white mb-2">
        Swipe Challenge
      </h2>

      <p className="text-slate-400 text-sm mb-7">
        Follow the arrows before time runs out.
      </p>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3 mb-8">

        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-slate-500 text-xs mb-1">PROGRESS</p>
          <p className="text-white font-black text-xl">
            {currentStep}/{TOTAL_STEPS}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-slate-500 text-xs mb-1">MISTAKES</p>
          <p className="text-red-400 font-black text-xl">
            {mistakes}/{MAX_MISTAKES}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-slate-500 text-xs mb-1">TIME</p>
          <p className="text-cyan-400 font-black text-xl">
            {(timeLeft / 1000).toFixed(1)}s
          </p>
        </div>

      </div>

      {/* PROGRESS BAR */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
          animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* COUNTDOWN */}
      <AnimatePresence mode="wait">

        {!started && !failed && !finished && (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="py-10"
          >
            <p className="text-slate-400 text-sm mb-4">
              GET READY
            </p>

            <p className="text-7xl font-black text-cyan-400">
              {countdown > 0 ? countdown : "GO!"}
            </p>
          </motion.div>
        )}

        {/* CURRENT ARROW */}
        {started && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`w-36 h-36 mx-auto rounded-3xl flex items-center justify-center mb-8 border-2 transition-colors ${
              feedback === "correct"
                ? "bg-green-500/20 border-green-400"
                : feedback === "wrong"
                ? "bg-red-500/20 border-red-400"
                : "bg-blue-500/10 border-blue-400/30"
            }`}
          >
            <CurrentIcon size={75} className="text-cyan-300" />
          </motion.div>
        )}

      </AnimatePresence>

      {/* DIRECTION BUTTONS */}
      {started && (
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">

          <div />

          <button
            onClick={() => handleDirection("UP")}
            className="p-5 rounded-xl bg-white/10 hover:bg-blue-500/30 border border-white/10 text-white active:scale-90 transition"
          >
            <ArrowUp className="mx-auto" size={28} />
          </button>

          <div />

          <button
            onClick={() => handleDirection("LEFT")}
            className="p-5 rounded-xl bg-white/10 hover:bg-blue-500/30 border border-white/10 text-white active:scale-90 transition"
          >
            <ArrowLeft className="mx-auto" size={28} />
          </button>

          <button
            onClick={() => handleDirection("DOWN")}
            className="p-5 rounded-xl bg-white/10 hover:bg-blue-500/30 border border-white/10 text-white active:scale-90 transition"
          >
            <ArrowDown className="mx-auto" size={28} />
          </button>

          <button
            onClick={() => handleDirection("RIGHT")}
            className="p-5 rounded-xl bg-white/10 hover:bg-blue-500/30 border border-white/10 text-white active:scale-90 transition"
          >
            <ArrowRight className="mx-auto" size={28} />
          </button>

        </div>
      )}

      {/* FAILURE */}
      {failed && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <AlertTriangle
            size={42}
            className="text-red-400 mx-auto mb-3"
          />

          <h3 className="text-2xl font-black text-white">
            Challenge Failed!
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            {mistakes >= MAX_MISTAKES
              ? "You made too many mistakes."
              : "You ran out of time."}
          </p>

          <button
            onClick={resetGame}
            className="mt-6 px-7 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-400 transition"
          >
            <RotateCcw size={16} className="inline mr-2" />
            Try Again
          </button>
        </motion.div>
      )}

      {/* SUCCESS */}
      {finished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8"
        >
          <CheckCircle
            size={45}
            className="text-green-400 mx-auto mb-3"
          />

          <h3 className="text-2xl font-black text-green-400">
            Challenge Completed!
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Great reflexes! Moving to the next level...
          </p>
        </motion.div>
      )}

    </div>
  );
}
