
import { useState } from "react";
import { motion } from "framer-motion";

const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 6;

function generateSecretCode() {
  return Array.from(
    { length: CODE_LENGTH },
    () => Math.floor(Math.random() * 10)
  ).join("");
}

function checkGuess(guess, secretCode) {
  const result = Array(CODE_LENGTH).fill("wrong");
  const remaining = secretCode.split("");

  // First pass: identify exact matches
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guess[i] === secretCode[i]) {
      result[i] = "correct";
      remaining[i] = null;
    }
  }

  // Second pass: identify correct digits in wrong positions
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (result[i] === "correct") continue;

    const index = remaining.indexOf(guess[i]);

    if (index !== -1) {
      result[i] = "present";
      remaining[index] = null;
    }
  }

  return result;
}

const colors = {
  correct: "bg-green-500 border-green-400",
  present: "bg-yellow-500 border-yellow-400",
  wrong: "bg-red-600 border-red-500",
};

export default function FinalCode({ onComplete }) {
  const [secretCode, setSecretCode] = useState(generateSecretCode);

  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const submitGuess = () => {
    if (
      guess.length !== CODE_LENGTH ||
      won ||
      lost
    ) {
      return;
    }

    const result = checkGuess(guess, secretCode);

    const newAttempts = [
      ...attempts,
      { guess, result },
    ];

    setAttempts(newAttempts);
    setGuess("");

    if (guess === secretCode) {
      setWon(true);
      onComplete();
    } else if (newAttempts.length >= MAX_ATTEMPTS) {
      setLost(true);
    }
  };

  const handleInput = (value) => {
    if (!/^\d*$/.test(value)) return;

    if (value.length <= CODE_LENGTH) {
      setGuess(value);
    }
  };

  const retry = () => {
    setSecretCode(generateSecretCode());
    setGuess("");
    setAttempts([]);
    setWon(false);
    setLost(false);
  };

  return (
    <div className="max-w-md mx-auto w-full text-center">

      <h2 className="text-2xl font-black text-white mb-2">
        Crack the Final Code
      </h2>

      <p className="text-slate-400 mb-6">
        Find the 4-digit secret code.
        You have {MAX_ATTEMPTS} attempts.
      </p>

      {/* COLOUR LEGEND */}
      <div className="flex justify-center flex-wrap gap-x-3 gap-y-2 mb-6">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-slate-400">
            Correct position
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-slate-400">
            Wrong position
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600" />
          <span className="text-xs text-slate-400">
            Not in code
          </span>
        </div>

      </div>

      {/* PREVIOUS ATTEMPTS */}
      <div className="space-y-3 mb-7">

        {attempts.map((attempt, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-3"
          >
            {attempt.guess.split("").map((digit, i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-black text-white ${colors[attempt.result[i]]}`}
              >
                {digit}
              </div>
            ))}
          </motion.div>
        ))}

      </div>

      {/* INPUT */}
      {!won && !lost && (
        <>
          <p className="text-slate-400 text-sm mb-3">
            Attempt {attempts.length + 1} of {MAX_ATTEMPTS}
          </p>

          <div className="flex justify-center gap-3 mb-5">
            <input
              type="text"
              inputMode="numeric"
              maxLength={CODE_LENGTH}
              value={guess}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitGuess();
              }}
              placeholder="0000"
              className="w-48 text-center text-3xl tracking-[0.5em] font-black bg-slate-900 border border-white/20 rounded-xl p-4 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <button
            onClick={submitGuess}
            disabled={guess.length !== CODE_LENGTH}
            className="px-8 py-3 rounded-xl bg-blue-500 text-white font-bold disabled:opacity-40 hover:bg-blue-400 transition"
          >
            Check Code
          </button>
        </>
      )}

      {/* SUCCESS */}
      {won && (
        <div className="mt-6">

          <h3 className="text-3xl font-black text-green-400">
            Code Cracked!
          </h3>

          <p className="text-slate-400 mt-2">
            Congratulations! You completed all five challenges.
          </p>

        </div>
      )}

      {/* FAILURE */}
      {lost && (
        <div className="mt-6">

          <h3 className="text-2xl font-black text-red-400">
            Out of Attempts!
          </h3>

          <p className="text-slate-400 mt-2">
            The secret code was{" "}
            <span className="text-white font-bold tracking-widest">
              {secretCode}
            </span>
          </p>

          <button
            onClick={retry}
            className="mt-5 px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-400 transition"
          >
            Try Again
          </button>

        </div>
      )}

    </div>
  );
}
