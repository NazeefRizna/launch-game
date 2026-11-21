const API_URL =
  import.meta.env.VITE_EVENT_API_URL ||
  "https://launchquest-control.nazeefrizna.workers.dev";

export async function getEventStatus() {
  const response = await fetch(`${API_URL}/api/status`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to get event status");
  }

  return response.json();
}

export async function adminRequest(path, passcode, body = {}) {
  const response = await fetch(`${API_URL}/api/admin/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${passcode}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}


export function connectToEvent(onUpdate, onDisconnect, onConnect) {
  const socketUrl = API_URL.replace(/^http/, "ws") + "/api/events";
  const socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    onConnect?.();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "EVENT_UPDATE") onUpdate(data);
    } catch (error) {
      console.error("Invalid event update:", error);
    }
  };

  socket.onclose = () => onDisconnect?.();
  socket.onerror = () => socket.close();

  return socket;
}
