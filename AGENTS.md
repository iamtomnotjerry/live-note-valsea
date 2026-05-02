# AGENTS.md — hướng dẫn cho Cursor và cộng tác viên

## Mục đích repo

**Live Note Taker** — ghi chép buổi học realtime (VALSEA hackathon). Stack: **Next.js 16 + React 19 + TypeScript (strict) + Tailwind + Supabase**, deploy **Vercel**. Mục tiêu: code **dễ đọc, dễ bảo trì, dễ mở rộng**; mọi thay đổi kiến trúc phản ánh trong `docs/`.

## Đọc gì trước khi sửa code

1. `docs/ARCHITECTURE.md` — bản đồ thư mục và luồng request.
2. `docs/FRONTEND.md` — UI/UX, Server vs Client Components.
3. `docs/BACKEND.md` — Supabase, env, RLS, API nội bộ.

## Quy tắc bắt buộc

- **Server Components mặc định.** Chỉ thêm `"use client"` khi cần hook trình duyệt, sự kiện DOM, hoặc Supabase browser client.
- **Không** đặt secret trong `NEXT_PUBLIC_*`. API key bên thứ ba (VALSEA, LLM) ưu tiên Route Handler server-side.
- **Biến môi trường public** phải qua `getPublicEnv()` từ `@/lib/env` khi dùng trong code app (tránh `process.env` rải rác không validate).
- **Class Tailwind:** dùng `cn()` từ `@/lib/utils`.
- **Supabase:**
  - Server → `createSupabaseServerClient()` từ `@/lib/supabase/server`
  - Client → `createSupabaseBrowserClient()` từ `@/lib/supabase/client`
- **UI primitives** đặt trong `src/components/ui/`. Logic theo feature → `src/features/<feature>/` (tạo khi feature lớn).
- **Commit:** xem `docs/COMMITS.md`. Pre-commit: `docs/PRE_COMMIT.md`.

## Cách prompt Cursor (tóm tắt)

- Chỉ rõ file/route; nêu Server vs Client; yêu cầu cập nhật `docs/` nếu đổi pattern.
- Chi tiết: `docs/CURSOR_AND_AI.md`.

## Stack (tham chiếu nhanh)

| Thành phần | Gói / dịch vụ                            |
| ---------- | ---------------------------------------- |
| Framework  | `next`, `react`, `react-dom`             |
| DB / Auth  | `@supabase/supabase-js`, `@supabase/ssr` |
| Validation | `zod`                                    |
| CSS        | `tailwindcss`, `clsx`, `tailwind-merge`  |

## Kiểm tra trước khi PR

```bash
npm run format:check
npm run lint
npm run build
```

(Next.js 16: không còn `next lint`; dùng ESLint CLI — script `lint` trong `package.json`.)
