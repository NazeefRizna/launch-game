
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "https://launch-game.nazeefrizna.workers.dev";




export const options = {
  stages: [
    { duration: "30s", target: 30 },
    { duration: "30s", target: 60 },
    { duration: "30s", target: 90 },
    { duration: "30s", target: 120 },
    { duration: "3m", target: 120 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
  },
};




const routes = [
  "/",
  "/game/1",
  "/game/2",
  "/game/3",
  "/game/4",
  "/game/5",
];

let assetsLoaded = false;

export default function () {
  if (!assetsLoaded) {
    const response = http.get(BASE_URL + "/");

    check(response, {
      "homepage loads": (r) => r.status === 200,
    });

    if (response.status === 200) {
      const matches = response.body.matchAll(
        /(?:src|href)=["']([^"']+\.(?:js|css|svg))["']/g
      );

      const assets = new Set();

      for (const match of matches) {
        let path = match[1];

        if (!path.startsWith("http")) {
          if (!path.startsWith("/")) path = "/" + path;
          assets.add(path);
        }
      }

      for (const path of assets) {
        const assetResponse = http.get(BASE_URL + path);

        check(assetResponse, {
          "asset loads successfully": (r) => r.status === 200,
        });
      }

      assetsLoaded = true;
    }
  }

  const route = routes[Math.floor(Math.random() * routes.length)];

  const response = http.get(BASE_URL + route);

  check(response, {
    "game route loads": (r) => r.status === 200,
  });

  sleep(3);
}
