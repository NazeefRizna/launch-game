import { Link } from "react-router-dom";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function GameHeader({
  current,
  completed,
}) {
  return (
    <header className="w-full max-w-4xl mx-auto px-5 pt-7">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Exit game</span>
        </Link>

        <div className="flex items-center gap-2 font-bold">
          <Gamepad2 className="text-cyan-400" />
          <span>LAUNCH<span className="text-cyan-400">QUEST</span></span>
        </div>
      </div>

      <ProgressBar
        current={current}
        completed={completed}
      />
    </header>
  );
}