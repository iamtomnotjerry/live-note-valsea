# AGENTS.md — hướng dẫn cho Cursor và cộng tác viên

## Mục đích repo

**Live Note Taker** — ghi chép buổi học realtime (VALSEA hackathon). Stack: **Next.js 16 + React 19 + TypeScript (strict) + Tailwind + Supabase + next-intl**, deploy **Vercel**. Mục tiêu: code **dễ đọc, dễ bảo trì, dễ mở rộng**; mọi thay đổi kiến trúc phản ánh trong `docs/`.

## Đọc gì trước khi sửa code

1. `docs/ARCHITECTURE.md` — bản đồ thư mục, locale, luồng middleware.
2. `docs/I18N.md` — quy tắc copy, namespace, navigation có locale.
3. `docs/FRONTEND.md` — UI/UX, Server vs Client Components.
4. `docs/BACKEND.md` — Supabase, env, RLS, API nội bộ.

## Quy tắc bắt buộc

- **Server Components mặc định.** Chỉ thêm `"use client"` khi cần hook trình duyệt, sự kiện DOM, hoặc Supabase browser client.
- **i18n:** không hardcode chuỗi UI. Thêm / sửa copy trong **`messages/vi.json` và `messages/en.json`** (cùng key). Server: `getTranslations('Namespace')`; client: `useTranslations('Namespace')`. Route nội bộ: **`Link` / `useRouter` / `usePathname` từ `@/i18n/navigation`**, không dùng `next/link` cho trang trong app. Chi tiết: `docs/I18N.md`.
- **Không** đặt secret trong `NEXT_PUBLIC_*`. API key bên thứ ba (VALSEA, LLM) ưu tiên Route Handler server-side.
- **Biến môi trường public** phải qua `getPublicEnv()` từ `@/lib/env` khi dùng trong code app (tránh `process.env` rải rác không validate).
- **Class Tailwind:** dùng `cn()` từ `@/lib/utils`.
- **Supabase:**
  - Server → `createSupabaseServerClient()` từ `@/lib/supabase/server`
  - Client → `createSupabaseBrowserClient()` từ `@/lib/supabase/client`
- **UI primitives** đặt trong `src/components/ui/`. Logic theo feature → `src/features/<feature>/` (tạo khi feature lớn).
- **Trang có UI** đặt dưới **`src/app/[locale]/`** (giữ đồng bộ với next-intl).
- **Commit:** xem `docs/COMMITS.md`. Pre-commit: `docs/PRE_COMMIT.md`.

## Cách prompt Cursor (tóm tắt)

- Chỉ rõ file/route (`src/app/[locale]/...`, `src/features/...`); nêu Server vs Client; nếu đổi copy → cập nhật **cả hai** file `messages/*.json`.
- Yêu cầu cập nhật `docs/` (ít nhất `I18N.md` / `ARCHITECTURE.md`) nếu đổi pattern locale hoặc middleware.
- Chi tiết: `docs/CURSOR_AND_AI.md`.

## Stack (tham chiếu nhanh)

| Thành phần | Gói / dịch vụ                            |
| ---------- | ---------------------------------------- |
| Framework  | `next`, `react`, `react-dom`             |
| i18n       | `next-intl`                              |
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
