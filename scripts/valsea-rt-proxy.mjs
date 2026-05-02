/**
 * Local WebSocket proxy: browser -> this server -> wss://api.valsea.ai/v1/realtime
 * Browsers cannot set Authorization / X-API-Key on WebSocket; Node can.
 *
 * Usage: npm run dev:proxy
 * Env: VALSEA_API_KEY (from .env.local), VALSEA_RT_PROXY_PORT (default 3331)
 */
import { existsSync } from "fs";
import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";

/** Repo root (folder that contains package.json), không phụ thuộc process.cwd() khi chạy concurrently */
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envLocal = resolve(repoRoot, ".env.local");
const envFile = resolve(repoRoot, ".env");

if (existsSync(envLocal)) {
  config({ path: envLocal });
} else {
  console.warn(
    `[valsea-rt-proxy] Không thấy ${envLocal} — tạo file này và thêm VALSEA_API_KEY=vl_...`,
  );
}
if (existsSync(envFile)) {
  config({ path: envFile });
}

const UPSTREAM = "wss://api.valsea.ai/v1/realtime";
const PORT = Number(process.env.VALSEA_RT_PROXY_PORT || "3331");
const apiKey = process.env.VALSEA_API_KEY?.trim();

if (!apiKey) {
  console.error(
    "[valsea-rt-proxy] Thiếu VALSEA_API_KEY. Thêm vào web/.env.local:\n  VALSEA_API_KEY=vl_...\n(File phải nằm trong thư mục web/, cùng cấp package.json.)",
  );
  process.exit(1);
}

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (client) => {
  const upstream = new WebSocket(UPSTREAM, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  let cleaned = false;
  const shutdown = (reason) => {
    if (cleaned) return;
    cleaned = true;
    try {
      client.close(1000, reason);
    } catch {
      /* ignore */
    }
    try {
      upstream.close(1000, reason);
    } catch {
      /* ignore */
    }
  };

  client.on("message", (data, isBinary) => {
    if (upstream.readyState !== WebSocket.OPEN) return;
    upstream.send(data, { binary: isBinary });
  });

  upstream.on("message", (data, isBinary) => {
    if (client.readyState !== WebSocket.OPEN) return;
    client.send(data, { binary: isBinary });
  });

  upstream.on("error", (err) => {
    console.error("[valsea-rt-proxy] upstream error:", err.message);
    shutdown("upstream_error");
  });

  client.on("error", (err) => {
    console.error("[valsea-rt-proxy] client error:", err.message);
    shutdown("client_error");
  });

  upstream.on("close", () => shutdown("upstream_closed"));
  client.on("close", () => shutdown("client_closed"));
});

wss.on("listening", () => {
  console.log(
    `[valsea-rt-proxy] ws://127.0.0.1:${PORT} -> ${UPSTREAM} (Bearer ***)`,
  );
});
