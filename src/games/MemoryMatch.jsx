
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const symbols = ["🚀", "⚡", "🌟", "🎯"];

function createCards() {
  const shuffled = [...symbols, ...symbols];

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.map((symbol, index) => ({
    id: index,
    symbol,
    matched: false,
  }));
}

export default function MemoryMatch({ onComplete }) {
  const [cards, setCards] = useState(createCards);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const completedRef = useRef(false);

  useEffect(() => {
    if (
      cards.every((card) => card.matched) &&
      !completedRef.current
    ) {
      completedRef.current = true;
      onComplete();
    }
  }, [cards, onComplete]);

  const selectCard = (id) => {
    if (locked || completedRef.current) return;

    const card = cards.find((c) => c.id === id);

    if (!card || card.matched || selected.includes(id)) return;

    if (selected.length === 0) {
      setSelected([id]);
      return;
    }

    const first = cards.find((c) => c.id === selected[0]);

    setSelected([selected[0], id]);
    setMoves((m) => m + 1);
    setLocked(true);

    if (first.symbol === card.symbol) {
      setCards((previous) =>
        previous.map((c) =>
          c.id === id || c.id === first.id
            ? { ...c, matched: true }
            : c
        )
      );

      setSelected([]);
      setLocked(false);
    } else {
      setTimeout(() => {
        setSelected([]);
        setLocked(false);
      }, 800);
    }
  };

  const restart = () => {
    completedRef.current = false;
    setCards(createCards());
    setSelected([]);
    setMoves(0);
    setLocked(false);
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <h2 className="text-2xl font-black text-white mb-2">
        Memory Match
      </h2>

      <p className="text-slate-400 mb-2">
        Find all four matching pairs.
      </p>

      <p className="text-cyan-400 font-semibold mb-7">
        Moves: {moves}
      </p>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => {
          const visible =
            card.matched || selected.includes(card.id);

          return (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => selectCard(card.id)}
              disabled={locked || card.matched || visible}
              className={`aspect-square rounded-2xl text-3xl flex items-center justify-center border transition ${
                card.matched
                  ? "bg-green-500/20 border-green-400"
                  : visible
                  ? "bg-blue-500/30 border-blue-400"
                  : "bg-white/10 border-white/10 hover:bg-white/20"
              }`}
            >
              {visible ? card.symbol : "?"}
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={restart}
        className="mt-7 text-sm text-slate-400 hover:text-white transition"
      >
        Restart game
      </button>
    </div>
  );
}
