import { useState, useEffect } from "react";
import { Lock, Delete } from "lucide-react";

const SECRET_CODE = "4826";

export default function FinalCode({ onComplete }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (code.length === 4 && code === SECRET_CODE) {
      setMessage("Code unlocked!");
      onComplete();
    }
  }, [code, onComplete]);

  const addDigit = (digit) => {
    if (code.length >= 4) return;

    const next = code + digit;
    setCode(next);

    if (next.length === 4 && next !== SECRET_CODE) {
      setAttempts((a) => a + 1);
      setMessage("Incorrect code. Try again!");
    } else {
      setMessage("");
    }
  };

  const clearCode = () => {
    setCode("");
    setMessage("");
  };

  return (
    <div className="max-w-sm mx-auto text-center">
      <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-500/20 flex items-center justify-center mb-5">
        <Lock size={38} className="text-purple-400" />
      </div>

      <p className="text-slate-400 mb-6">
        Enter the four-digit secret code to unlock the final stage.
      </p>

      <div className="flex justify-center gap-3 mb-5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-14 h-16 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center text-2xl font-bold"
          >
            {code[i] ? "●" : ""}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 mb-6">
        Attempts: {attempts}
      </p>

      <div className="grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            onClick={() => addDigit(digit)}
            className="h-14 rounded-xl bg-white/10 hover:bg-blue-500/40 text-xl font-semibold transition"
          >
            {digit}
          </button>
        ))}

        <button
          onClick={clearCode}
          className="h-14 rounded-xl bg-white/10 flex items-center justify-center"
        >
          <Delete size={20} />
        </button>

        <button
          onClick={() => addDigit("0")}
          className="h-14 rounded-xl bg-white/10 hover:bg-blue-500/40 text-xl"
        >
          0
        </button>

        <button
          onClick={clearCode}
          className="h-14 rounded-xl bg-white/10"
        >
          C
        </button>
      </div>

      {message && (
        <p className={`mt-5 text-sm ${
          code === SECRET_CODE
            ? "text-green-400"
            : "text-red-400"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}