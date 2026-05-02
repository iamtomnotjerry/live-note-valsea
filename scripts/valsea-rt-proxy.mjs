/**
 * Local WebSocket proxy: browser -> this server -> wss://api.valsea.ai/v1/realtime
 * Browsers cannot set Authorization / X-API-Key on WebSocket; Node can.
 *
 * Usage: npm run dev:proxy  |  production: PORT từ host (Railway), VALSEA_API_KEY bắt buộc
 * Env: VALSEA_API_KEY; local: VALSEA_RT_PROXY_PORT (default 3331); prod: PORT do platform gán
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
}
if (existsSync(envFile)) {
  config({ path: envFile });
}

const UPSTREAM = "wss://api.valsea.ai/v1/realtime";
/** Railway/Fly/Render inject PORT (ưu tiên); local: VALSEA_RT_PROXY_PORT hoặc 3331 */
const portStr =
  (process.env.PORT && String(process.env.PORT).trim()) ||
  (process.env.VALSEA_RT_PROXY_PORT &&
    String(process.env.VALSEA_RT_PROXY_PORT).trim()) ||
  "3331";
const PORT = Number(portStr);
const LISTEN_HOST = process.env.VALSEA_RT_PROXY_HOST || "0.0.0.0";
const apiKey = process.env.VALSEA_API_KEY?.trim();

if (!apiKey) {
  console.error(
    "[valsea-rt-proxy] Thiếu VALSEA_API_KEY.\n  Local: web/.env.local hoặc web/.env (cùng cấp package.json).\n  Render/Railway: Environment → VALSEA_API_KEY=vl_...",
  );
  process.exit(1);
}

const wss = new WebSocketServer({ port: PORT, host: LISTEN_HOST });

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
    `[valsea-rt-proxy] ws://${LISTEN_HOST}:${PORT} -> ${UPSTREAM} (Bearer ***)`,
  );
});
