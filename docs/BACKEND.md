# Backend & Supabase

## Biến môi trường

| Biến                                   | Phạm vi                | Mô tả                                                                                      |
| -------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | Public                 | URL dự án Supabase.                                                                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`        | Public                 | JWT anon (legacy); RLS vẫn bảo vệ dữ liệu.                                                 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public (tuỳ chọn)      | Thay thế / bổ sung anon: Dashboard mới có thể chỉ hiện publishable — app đọc qua `env.ts`. |
| `SUPABASE_SERVICE_ROLE_KEY`            | Server-only (optional) | Chỉ dùng job admin / bypass RLS — **không** đặt prefix `NEXT_PUBLIC_`.                     |

`getPublicEnv()` cần **URL + một khóa public hợp lệ**: ưu tiên `NEXT_PUBLIC_SUPABASE_ANON_KEY`, nếu thiếu thì dùng `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (xem [`src/lib/env.ts`](../src/lib/env.ts)).

Copy `.env.example` → `.env.local` và điền giá trị từ Dashboard → Settings → API.

## Client helpers

- **`createSupabaseServerClient()`** — `import "@/lib/supabase/server"` trong Server Component, Server Action, Route Handler.
- **`createSupabaseBrowserClient()`** — chỉ trong file có `"use client"`.

`getPublicEnv()` dùng Zod: nếu thiếu/không hợp lệ env, lỗi rõ ràng (tránh silent undefined).

## Auth & session

- **`src/middleware.ts`:** chạy **next-intl** (`createMiddleware`) trước, rồi `updateSession(request, response)` từ `lib/supabase/middleware.ts`. Session cookie được ghi **lên đúng `NextResponse` mà intl trả về** (redirect/prefix locale không bị mất).
- Nếu chưa cấu hình Supabase env, `updateSession` trả nguyên response từ intl (dev không bị chặn vì thiếu Supabase).

### Google OAuth (PKCE + redirect)

- **Client:** [`src/features/auth/login-form.tsx`](../src/features/auth/login-form.tsx) — `signInWithOAuth({ provider: 'google' })` với `redirectTo` **same-origin** (`/auth/callback?next=…`). `queryParams.prompt=select_account` giúp chọn đúng tài khoản trên máy dùng chung.
- **Callback:** [`src/app/auth/callback/route.ts`](../src/app/auth/callback/route.ts) — `exchangeCodeForSession(code)` trên server (cookie httpOnly qua `@supabase/ssr`), rồi redirect tới `next` đã **chuẩn hoá** — xem [`src/lib/auth-redirect.ts`](../src/lib/auth-redirect.ts): chỉ cho phép `/`, `/live`, `/login`, hoặc `/{locale}/…` với locale đã cấu hình (tránh open redirect). Tham số `next` từ UI dùng **`localizedAppPath`** vì `usePathname()` của next-intl **không** gồm prefix locale (tránh mất ngôn ngữ sau đăng nhập).
- **Lỗi exchange:** redirect về login kèm `?error=auth`; ưu tiên đường dẫn có locale từ cookie **`NEXT_LOCALE`** (next-intl) khi khác locale mặc định.

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
