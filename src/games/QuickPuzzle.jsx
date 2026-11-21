
import { useEffect, useState } from "react";

const COLORS = [
  { name: "red", style: "bg-red-500", active: "bg-red-300 shadow-red-400/70" },
  { name: "blue", style: "bg-blue-500", active: "bg-blue-300 shadow-blue-400/70" },
  { name: "green", style: "bg-green-500", active: "bg-green-300 shadow-green-400/70" },
  { name: "yellow", style: "bg-yellow-500", active: "bg-yellow-300 shadow-yellow-400/70" },
];

const TOTAL_ROUNDS = 5;

function generateSequence(length) {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * COLORS.length)
  );
}

export default function QuickPuzzle({ onComplete }) {
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState(() => generateSequence(2));
  const [inputIndex, setInputIndex] = useState(0);
  const [activeColor, setActiveColor] = useState(null);
  const [phase, setPhase] = useState("showing");
  const [message, setMessage] = useState("Watch the sequence carefully!");

  // Play the sequence
  useEffect(() => {
    if (phase !== "showing") return;

    const timers = [];

    sequence.forEach((color, index) => {
      const startTime = 300 + index * 650;

      timers.push(
        setTimeout(() => setActiveColor(color), startTime)
      );

      timers.push(
        setTimeout(() => setActiveColor(null), startTime + 400)
      );
    });

    timers.push(
      setTimeout(() => {
        setActiveColor(null);
        setPhase("input");
        setMessage("Now repeat the sequence!");
      }, 300 + sequence.length * 650)
    );

    return () => timers.forEach(clearTimeout);
  }, [phase, sequence]);

  // Complete the level
  useEffect(() => {
    if (phase === "complete") {
      onComplete();
    }
  }, [phase, onComplete]);

  const handleColorClick = (colorIndex) => {
    if (phase !== "input") return;

    if (colorIndex !== sequence[inputIndex]) {
      setMessage("Not quite! Watch the sequence again.");
      setInputIndex(0);
      setActiveColor(null);
      setPhase("showing");
      return;
    }

    const nextIndex = inputIndex + 1;

    if (nextIndex === sequence.length) {
      if (round === TOTAL_ROUNDS) {
        setPhase("complete");
        return;
      }

      const nextRound = round + 1;

      setRound(nextRound);
      setSequence(generateSequence(nextRound + 1));
      setInputIndex(0);
      setMessage("Correct! Watch the next sequence.");
      setPhase("showing");
    } else {
      setInputIndex(nextIndex);
    }
  };

  return (
    <div className="max-w-sm mx-auto text-center">
      <h2 className="text-2xl font-bold text-white mb-2">
        Colour Sequence
      </h2>

      <p className="text-slate-400 text-sm mb-6">
        Remember the colours and repeat them in order.
      </p>

      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-slate-300">
          Round {round}/{TOTAL_ROUNDS}
        </span>

        <span className="text-slate-300">
          {inputIndex}/{sequence.length} correct
        </span>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{
            width: `${((round - 1) / TOTAL_ROUNDS) * 100}%`,
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-[280px] mx-auto">
        {COLORS.map((color, index) => (
          <button
            key={color.name}
            onClick={() => handleColorClick(index)}
            disabled={phase !== "input"}
            aria-label={color.name}
            className={`aspect-square rounded-3xl transition-all duration-200 shadow-lg ${
              activeColor === index
                ? `${color.active} scale-95 shadow-xl`
                : `${color.style} opacity-80`
            } ${
              phase === "input"
                ? "cursor-pointer hover:brightness-110 active:scale-95"
                : "cursor-default"
            }`}
          />
        ))}
      </div>

      <p className="mt-7 text-sm font-medium text-slate-300">
        {phase === "complete"
          ? "Amazing! Challenge completed!"
          : message}
      </p>
    </div>
  );
}
