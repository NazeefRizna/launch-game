
import { useEffect, useState } from "react";
import {
  getEventStatus,
  connectToEvent,
} from "../services/eventApi";

export default function useEventStatus() {
  const [eventState, setEventState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    let active = true;
    let socket;
    let reconnectTimer;
    let pollTimer;

    async function refreshStatus() {
      try {
        const state = await getEventStatus();

        if (active) {
          setEventState(state);
          setLoading(false);
        }
      } catch (error) {
        if (active) {
          setConnectionError(true);
        }
      }
    }

    function connect() {
      if (!active) return;

      socket = connectToEvent(
        (state) => {
          if (!active) return;

          setEventState(state);
          setLoading(false);
          setConnectionError(false);
        },
        () => {
          if (!active) return;

          setConnectionError(true);

          // Fallback status checks while disconnected
          if (!pollTimer) {
            pollTimer = setInterval(refreshStatus, 5000);
          }

          // Reconnect automatically
          if (!reconnectTimer) {
            reconnectTimer = setTimeout(() => {
              reconnectTimer = null;
              connect();
            }, 5000);
          }
        },
        () => {
          if (!active) return;

          setConnectionError(false);

          if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
          }
        }
      );
    }

    refreshStatus();
    connect();

    return () => {
      active = false;

      if (socket) socket.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  return {
    eventState,
    loading,
    connectionError,
  };
}
