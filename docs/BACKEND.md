# Backend & Supabase

## Biến môi trường

| Biến                            | Phạm vi                | Mô tả                                                                  |
| ------------------------------- | ---------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Public                 | URL dự án Supabase.                                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public                 | Khóa anon; RLS bảo vệ dữ liệu.                                         |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-only (optional) | Chỉ dùng job admin / bypass RLS — **không** đặt prefix `NEXT_PUBLIC_`. |

Copy `.env.example` → `.env.local` và điền giá trị từ Dashboard → Settings → API.

## Client helpers

- **`createSupabaseServerClient()`** — `import "@/lib/supabase/server"` trong Server Component, Server Action, Route Handler.
- **`createSupabaseBrowserClient()`** — chỉ trong file có `"use client"`.

`getPublicEnv()` dùng Zod: nếu thiếu/không hợp lệ env, lỗi rõ ràng (tránh silent undefined).

## Auth & session

- **`src/middleware.ts`:** chạy **next-intl** (`createMiddleware`) trước, rồi `updateSession(request, response)` từ `lib/supabase/middleware.ts`. Session cookie được ghi **lên đúng `NextResponse` mà intl trả về** (redirect/prefix locale không bị mất).
- Nếu chưa cấu hình Supabase env, `updateSession` trả nguyên response từ intl (dev không bị chặn vì thiếu Supabase).

## Database

- Tạo bảng trong Supabase SQL Editor; bật **Row Level Security** trước khi production.
- Sinh type TypeScript:

  ```bash
  npx supabase gen types typescript --project-id YOUR_REF > src/types/database.generated.ts
  ```

  (Cần CLI Supabase hoặc lấy type từ Dashboard.)

## API tích hợp VALSEA (hackathon)

- **Khuyến nghị:** Gọi VALSEA từ **Route Handler** (`app/api/.../route.ts`) nếu cần giữ API key server-side; client gọi `/api/...` của bạn.

### Live Transcription (RTT) — WebSocket

- Endpoint upstream: `wss://api.valsea.ai/v1/realtime` ([docs](https://valsea.ai/docs/realtime)).
- Handshake cần header `Authorization: Bearer …` hoặc `X-API-Key` — **trình duyệt không gắn header WebSocket** được như Node.
- **Dev:** chạy `npm run dev:rtt` — Next dev + [`scripts/valsea-rt-proxy.mjs`](../scripts/valsea-rt-proxy.mjs): proxy `ws://127.0.0.1:3331` → VALSEA với Bearer từ `VALSEA_API_KEY` (đọc `.env.local`).
- **Client:** [`src/features/live-note/live-rtt-panel.tsx`](../src/features/live-note/live-rtt-panel.tsx) gửi `session.start` (`model: valsea-rtt`), sau đó `audio.append` (PCM 16 kHz mono, base64). Partial/final transcript như tài liệu VALSEA.
- **Biến:** `VALSEA_API_KEY`, `VALSEA_RT_PROXY_PORT` (optional), `NEXT_PUBLIC_VALSEA_RT_PROXY_URL` (URL proxy mà browser kết nối).
- **Production:** cần proxy tương đựch (Worker / dịch vụ có WebSocket + secret) — không expose proxy không auth ra internet.

## Vercel

- Project Settings → Environment Variables: thêm các biến giống `.env.local`.
- Build command: `npm run build`; output mặc định Next.
- Chi tiết push GitHub + biến môi trường + hạn chế RTT: [`docs/DEPLOY.md`](./DEPLOY.md).
