
import { useEffect, useState } from "react";
import {
  getEventStatus,
  adminRequest,
  connectToEvent,
} from "../services/eventApi";

export default function Admin() {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [eventState, setEventState] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      try {
        const state = await getEventStatus();

        if (active) {
          setEventState(state);
          setWebsiteUrl(state.websiteUrl || "");
        }
      } catch {
        if (active) {
          setError("Unable to connect to the event server.");
        }
      }
    }

    loadStatus();

    const socket = connectToEvent(
      (state) => {
        if (!active) return;

        setEventState(state);
        setWebsiteUrl((current) => current || state.websiteUrl || "");
      },
      () => {
        if (active) {
          setError("Live connection interrupted. Refresh to reconnect.");
        }
      },
      () => {
        if (active) setError("");
      }
    );

    return () => {
      active = false;
      socket.close();
    };
  }, []);

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await adminRequest("verify", passcode);

      setAuthenticated(true);
      setMessage("Admin login successful.");
    } catch (err) {
      setError(err.message || "Incorrect admin passcode.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action, successMessage, body = {}) {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await adminRequest(action, passcode, body);

      if (result.state) {
        setEventState(result.state);
      }

      setMessage(successMessage);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function saveWebsiteUrl(event) {
    event.preventDefault();

    if (!websiteUrl.trim()) {
      setError("Please enter the launching website URL.");
      return;
    }

    try {
      const parsedUrl = new URL(websiteUrl);

      if (parsedUrl.protocol !== "https:") {
        setError("Please enter a valid HTTPS URL.");
        return;
      }
    } catch {
      setError("Please enter a valid website URL.");
      return;
    }

    await handleAction(
      "config",
      "Launching website URL saved successfully.",
      { websiteUrl }
    );
  }

  function confirmEndEvent() {
    const confirmed = window.confirm(
      "Are you sure you want to end LAUNCHQUEST?\n\n" +
      "All participants currently playing will immediately be redirected " +
      "to the saved launching website.\n\n" +
      "This action cannot be undone."
    );

    if (confirmed) {
      handleAction(
        "end",
        "Event ended. All participants will be redirected to the launching website."
      );
    }
  }

  function confirmResetEvent() {
    const confirmed = window.confirm(
      "Reset LAUNCHQUEST to waiting?\n\n" +
      "All participants will return to the waiting screen. " +
      "Their individual game progress will not be deleted."
    );

    if (confirmed) {
      handleAction("reset", "Event reset to waiting.");
    }
  }

  const status = eventState?.status || "connecting";

  const statusColors = {
    waiting: "text-amber-400",
    running: "text-emerald-400",
    ended: "text-red-400",
    connecting: "text-slate-400",
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#080B18] text-white flex items-center justify-center px-5">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-[#11182B] border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🚀</div>

            <h1 className="text-3xl font-bold">
              LAUNCHQUEST
            </h1>

            <p className="text-slate-400 mt-2">
              Admin Dashboard
            </p>
          </div>

          <label className="block text-sm text-slate-300 mb-2">
            Admin Passcode
          </label>

          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter admin passcode"
            required
            autoComplete="current-password"
            className="w-full bg-[#080B18] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
          />

          {error && (
            <p className="text-red-400 text-sm mt-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !passcode.trim()}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold rounded-xl py-3"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B18] text-white px-5 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-10">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest">
            EVENT MANAGEMENT
          </p>

          <h1 className="text-4xl font-bold mt-2">
            LAUNCHQUEST Admin
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your launch event and participant access.
          </p>
        </header>

        {/* Event Status */}
        <section className="bg-[#11182B] border border-white/10 rounded-2xl p-6 mb-6">
          <p className="text-slate-400 text-sm mb-2">
            CURRENT EVENT STATUS
          </p>

          <h2
            className={`text-3xl font-bold uppercase ${
              statusColors[status] || "text-slate-400"
            }`}
          >
            {status}
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Status updates automatically when the event changes.
          </p>
        </section>

        {/* Website Configuration */}
        <section className="bg-[#11182B] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">
            Launching Website
          </h2>

          <p className="text-slate-400 text-sm mb-5">
            Participants will be redirected here after completing all
            five levels or when you end the event.
          </p>

          <form onSubmit={saveWebsiteUrl}>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://your-launch-website.com"
              className="w-full bg-[#080B18] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
              required
            />

            {websiteUrl.startsWith("https://") && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-cyan-400 text-sm mt-3 hover:underline"
              >
                Preview launching website ↗
              </a>
            )}

            <button
              type="submit"
              disabled={loading}
              className="block w-full mt-5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-xl py-3 font-semibold"
            >
              {loading ? "Saving..." : "Save Website URL"}
            </button>
          </form>
        </section>

        {/* Event Controls */}
        <section className="bg-[#11182B] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-5">
            Event Controls
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Start */}
            <button
              onClick={() =>
                handleAction(
                  "start",
                  "Event started successfully."
                )
              }
              disabled={
                loading ||
                !eventState?.websiteUrl ||
                status === "running"
              }
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-xl py-4 font-bold"
            >
              {loading ? "Processing..." : "Start Event"}
            </button>

            {/* End with confirmation */}
            <button
              onClick={confirmEndEvent}
              disabled={
                loading ||
                !eventState?.websiteUrl ||
                status !== "running"
              }
              className="bg-red-600 hover:bg-red-500 disabled:opacity-40 rounded-xl py-4 font-bold"
            >
              End Event
            </button>

            {/* Reset with confirmation */}
            <button
              onClick={confirmResetEvent}
              disabled={loading || status === "waiting"}
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 rounded-xl py-4 font-bold"
            >
              Reset Event
            </button>

          </div>

          <p className="text-slate-500 text-xs mt-5">
            Reset returns participants to the waiting screen without
            deleting their individual game progress.
          </p>
        </section>

        {/* Feedback */}
        {message && (
          <div className="mt-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <p className="text-emerald-400 text-sm">
              {message}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-5 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400 text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setAuthenticated(false);
              setPasscode("");
              setMessage("");
              setError("");
            }}
            className="text-slate-500 hover:text-white text-sm"
          >
            Log out
          </button>
        </div>

      </div>
    </div>
  );
}
