import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

const directions = [
  "UP", "LEFT", "DOWN", "RIGHT",
  "UP", "RIGHT", "LEFT", "DOWN",
];

const icons = {
  UP: ArrowUp,
  DOWN: ArrowDown,
  LEFT: ArrowLeft,
  RIGHT: ArrowRight,
};

export default function SwipeChallenge({ onComplete }) {
  const [step, setStep] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    if (step === directions.length) {
      onComplete();
    }
  }, [step, onComplete]);

  const handleDirection = (direction) => {
    if (step >= directions.length) return;

    if (direction === directions[step]) {
      setStep((s) => s + 1);
      setWrong(false);
    } else {
      setMistakes((m) => m + 1);
      setWrong(true);

      setTimeout(() => setWrong(false), 400);
    }
  };

  const reset = () => {
    setStep(0);
    setMistakes(0);
    setWrong(false);
  };

  const CurrentIcon = icons[directions[step]];

  return (
    <div className="text-center max-w-md mx-auto">
      <p className="text-slate-400 mb-2">
        Follow the indicated direction.
      </p>

      <p className="text-cyan-400 font-semibold mb-7">
        {step}/{directions.length} directions completed
      </p>

      <motion.div
        animate={wrong ? { x: [-8, 8, -8, 0] } : { x: 0 }}
        className="w-36 h-36 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center"
      >
        {CurrentIcon && <CurrentIcon size={75} />}
      </motion.div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        <div />
        <button onClick={() => handleDirection("UP")} className="direction-btn">
          <ArrowUp />
        </button>
        <div />

        <button onClick={() => handleDirection("LEFT")} className="direction-btn">
          <ArrowLeft />
        </button>
        <button onClick={() => handleDirection("DOWN")} className="direction-btn">
          <ArrowDown />
        </button>
        <button onClick={() => handleDirection("RIGHT")} className="direction-btn">
          <ArrowRight />
        </button>
      </div>

      <p className="text-sm text-slate-400 mt-6">
        Mistakes: {mistakes}
      </p>

      <button
        onClick={reset}
        className="mt-4 text-sm text-slate-400 hover:text-white"
      >
        Restart
      </button>
    </div>
  );
}