import { motion } from "framer-motion";

export default function ProgressBar({ current, completed }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-3">
        <span>YOUR PROGRESS</span>
        <span>{completed.length}/5 COMPLETED</span>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: completed.includes(level)
                  ? "100%"
                  : level === current
                  ? "45%"
                  : "0%",
              }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}