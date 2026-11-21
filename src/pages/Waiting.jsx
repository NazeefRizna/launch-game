
export default function Waiting() {
  return (
    <div className="min-h-screen bg-[#080B18] text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-6">🚀</div>

        <p className="text-cyan-400 font-semibold tracking-widest text-sm mb-3">
          LAUNCHQUEST
        </p>

        <h1 className="text-4xl font-bold mb-4">
          Get Ready!
        </h1>

        <p className="text-slate-400 leading-relaxed">
          The challenge hasn't started yet. Please stay on this page.
          The game will become available as soon as the event begins.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Waiting for the event to start
        </div>
      </div>
    </div>
  );
}
