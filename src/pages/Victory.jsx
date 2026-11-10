import { motion } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Trophy,
  Globe,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Victory({ isFinished }) {
  const navigate = useNavigate();

  if (!isFinished) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12 relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-blue-500/10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-xl w-full text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, 0], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/20"
        >
          <Trophy size={65} className="text-white" />
        </motion.div>

        <div className="mt-9 inline-flex items-center gap-2 text-green-400 text-sm font-bold">
          <Sparkles size={17} />
          ALL LEVELS COMPLETED
        </div>

        <h1 className="text-5xl md:text-6xl font-black mt-5">
          YOU DID IT!
        </h1>

        <p className="text-slate-400 text-lg mt-5 leading-relaxed">
          Five challenges. Five victories.
          You've successfully unlocked the final experience.
        </p>

        <div className="grid grid-cols-5 gap-2 my-9">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className="bg-green-500/10 border border-green-400/20 rounded-xl p-3 text-green-400 font-bold"
            >
              ✓
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/website")}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-xl shadow-green-500/20"
        >
          Explore the Website
          <ArrowRight />
        </button>

        <p className="text-xs text-slate-600 mt-6">
          YOUR NEXT EXPERIENCE STARTS HERE
        </p>
      </motion.div>
    </main>
  );
}