import { useState, useEffect } from "react";
import { Shuffle } from "lucide-react";

const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function shufflePuzzle() {
  let board = [...SOLVED];

  // Generate a solvable puzzle by making legal moves.
  for (let i = 0; i < 100; i++) {
    const empty = board.indexOf(0);
    const neighbors = [];

    if (empty % 3 > 0) neighbors.push(empty - 1);
    if (empty % 3 < 2) neighbors.push(empty + 1);
    if (empty >= 3) neighbors.push(empty - 3);
    if (empty < 6) neighbors.push(empty + 3);

    const next = neighbors[
      Math.floor(Math.random() * neighbors.length)
    ];

    [board[empty], board[next]] =
      [board[next], board[empty]];
  }

  return board;
}

export default function QuickPuzzle({ onComplete }) {
  const [board, setBoard] = useState(shufflePuzzle);

  const solved = board.every(
    (value, index) => value === SOLVED[index]
  );

  useEffect(() => {
    if (solved) onComplete();
  }, [solved, onComplete]);

  const moveTile = (index) => {
    const empty = board.indexOf(0);

    const adjacent =
      Math.abs(Math.floor(index / 3) - Math.floor(empty / 3)) +
      Math.abs((index % 3) - (empty % 3)) === 1;

    if (!adjacent) return;

    const updated = [...board];

    [updated[index], updated[empty]] =
      [updated[empty], updated[index]];

    setBoard(updated);
  };

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-slate-400 mb-6">
        Arrange the numbers from 1 to 8.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => moveTile(index)}
            disabled={value === 0 || solved}
            className={`aspect-square rounded-2xl text-3xl font-bold transition ${
              value === 0
                ? "bg-transparent"
                : "bg-gradient-to-br from-blue-500 to-indigo-700 hover:scale-95"
            }`}
          >
            {value || ""}
          </button>
        ))}
      </div>

      <button
        onClick={() => setBoard(shufflePuzzle())}
        className="mt-7 flex items-center gap-2 mx-auto text-sm text-slate-400 hover:text-white"
      >
        <Shuffle size={16} /> Shuffle again
      </button>
    </div>
  );
}