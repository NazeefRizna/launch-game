
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "15s", target: 30 },
    { duration: "30s", target: 60 },
    { duration: "30s", target: 120 },
    { duration: "30s", target: 120 },
    { duration: "15s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
  },
};

const FRONTEND = "https://launch-game.nazeefrizna.workers.dev";
const API = "https://launchquest-control.nazeefrizna.workers.dev";

export default function () {
  const frontendResponse = http.get(FRONTEND);

  check(frontendResponse, {
    "frontend loads": (r) => r.status === 200,
  });

  const apiResponse = http.get(`${API}/api/status`);

  check(apiResponse, {
    "event API responds": (r) => r.status === 200,
    "event status is valid": (r) => {
      try {
        const data = r.json();
        return ["waiting", "running", "ended"].includes(data.status);
      } catch {
        return false;
      }
    },
  });

  sleep(2);
}
