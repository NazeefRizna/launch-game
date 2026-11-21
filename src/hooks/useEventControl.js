
import { useCallback, useEffect, useState } from "react";
import { getEventStatus, connectToEvent } from "../services/eventApi";

export default function useEventControl() {
  const [eventState, setEventState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshStatus = useCallback(async () => {
    try {
      const state = await getEventStatus();
      setEventState(state);
      setError("");
      return state;
    } catch (err) {
      setError("Unable to connect to the event server.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    let socket;
    let reconnectTimer;
    let pollTimer;
    let connected = false;

    const pollStatus = async () => {
      if (!active || connected) return;

      try {
        const state = await getEventStatus();
        if (active) {
          setEventState(state);
          setError("");
        }
      } catch {
        if (active) setError("Connection to the event server was lost.");
      }

      if (active && !connected) {
        pollTimer = setTimeout(pollStatus, 15000);
      }
    };

    const connect = () => {
      if (!active) return;

      socket = connectToEvent(
        (state) => {
          if (active) {
            setEventState(state);
            setLoading(false);
            setError("");
          }
        },
        () => {
          connected = false;

          if (!active) return;

          if (!pollTimer) {
            pollTimer = setTimeout(pollStatus, 1000);
          }

          if (!reconnectTimer) {
            reconnectTimer = setTimeout(() => {
              reconnectTimer = null;
              connect();
            }, 5000);
          }
        },
        () => {
          connected = true;
          clearTimeout(pollTimer);
          pollTimer = null;
        }
      );
    };

    getEventStatus()
      .then((state) => {
        if (active) {
          setEventState(state);
          setLoading(false);
          setError("");
        }
      })
      .catch(() => {
        if (active) {
          setError("Unable to connect to the event server.");
          setLoading(false);
        }
      });

    connect();

    return () => {
      active = false;
      clearTimeout(reconnectTimer);
      clearTimeout(pollTimer);
      socket?.close();
    };
  }, []);

  return { eventState, loading, error, refreshStatus };
}
