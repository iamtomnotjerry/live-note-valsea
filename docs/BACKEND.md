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
- **Callback:** [`src/app/auth/callback/route.ts`](../src/app/auth/callback/route.ts) — `exchangeCodeForSession(code)` trên server (cookie httpOnly qua `@supabase/ssr`), rồi redirect tới `next` đã **chuẩn hoá** — xem [`src/lib/auth-redirect.ts`](../src/lib/auth-redirect.ts): chỉ cho phép `/`, `/live`, `/login`, và nhánh **`/profile/**`** đã whitelist (`/profile/folders`, `/profile/folders/uncategorized`, `/profile/folders/<uuid>`, `/profile/notes`, `/profile/notes/<uuid>`, `/profile/account`, cùng bản có prefix locale), hoặc `/{locale}/…`tương ứng (tránh open redirect). Tham số`next` từ UI dùng **`localizedAppPath`** vì `usePathname()` của next-intl **không** gồm prefix locale (tránh mất ngôn ngữ sau đăng nhập).
- **Lỗi exchange:** redirect về login kèm `?error=auth`; ưu tiên đường dẫn có locale từ cookie **`NEXT_LOCALE`** (next-intl) khi khác locale mặc định.

## Database

- Schema tổng hợp: [`supabase/schema.sql`](../supabase/schema.sql) (chạy SQL Editor hoặc `supabase db push`). Migration từng bước: [`supabase/migrations/`](../supabase/migrations/) — giữ khớp với Supabase **Database → Migrations** (có thể apply qua MCP `apply_migration`).
- Bật **Row Level Security** trước khi production.
- **Bảng chính:** `transcript_sessions` (ghi chú đã lưu: `title`, `transcript`, `folder_id`, `created_at`, **`updated_at`**, RLS theo `user_id`); `note_folders` (nhóm theo user); RPC **`note_counts_by_folder_for_user()`** — app gọi để đếm note theo folder (fallback nếu RPC chưa deploy: xem [`docs/SUPABASE.md`](./SUPABASE.md)).
- Kiểu TypeScript cho client Supabase: [`src/lib/supabase/database.types.ts`](../src/lib/supabase/database.types.ts) — import `Database` trong [`server.ts`](../src/lib/supabase/server.ts) / [`client.ts`](../src/lib/supabase/client.ts). Có thể tái sinh bằng MCP **`generate_typescript_types`** hoặc CLI:

  ```bash
  npx supabase gen types typescript --project-id YOUR_REF > src/lib/supabase/database.types.ts
  ```

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
