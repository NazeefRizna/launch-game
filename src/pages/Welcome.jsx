import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Gamepad2,
  Trophy,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Welcome({ completed }) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12 relative overflow-hidden">

      <div className="absolute w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full -bottom-20 -right-20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-2xl w-full text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-300 text-sm mb-8">
          <Sparkles size={16} />
          THE ULTIMATE LAUNCH CHALLENGE
        </div>

        <div className="flex justify-center mb-7">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <Gamepad2 size={50} />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
          Ready to
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
            Level Up?
          </span>
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto mt-6 leading-relaxed">
          Five exciting challenges. Five levels.
          One final destination. Complete the
          challenge and unlock something special.
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto my-10">
          {[
            { icon: Zap, title: "5 Levels", subtitle: "Challenges" },
            { icon: Trophy, title: "1 Mission", subtitle: "Complete" },
            { icon: Sparkles, title: "1 Reward", subtitle: "To Unlock" },
          ].map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <Icon className="mx-auto text-cyan-400 mb-3" size={23} />
              <p className="font-bold text-sm">{title}</p>
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() =>
  navigate(
    completed.length === 5
      ? "/victory"
      : `/game/${completed.length + 1}`
  )
}
          className="group w-full max-w-xs mx-auto flex items-center justify-center gap-3 py-4 px-7 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-lg shadow-xl shadow-blue-600/20 hover:scale-105 transition"
        >
          {completed.length > 0 ? "Continue Challenge" : "Start Game"}
          <ArrowRight className="group-hover:translate-x-1 transition" />
        </button>

        <p className="text-slate-600 text-xs mt-7">
          COMPLETE ALL FIVE LEVELS TO UNLOCK THE EXPERIENCE
        </p>
      </motion.div>
    </main>
  );
}