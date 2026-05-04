# Kiến trúc (Architecture)

## Tổng quan

- **Runtime:** Next.js 16 (App Router), React 19, TypeScript strict.
- **UI:** Tailwind CSS + token trong `src/app/globals.css` (màu, surface, action, clay landing). Font **Nunito** (subset `vietnamese`) + **JetBrains Mono** cho code.
- **i18n:** **next-intl** — locale **`vi`** (mặc định), **`en`**, **`id`**, **`th`**, **`ms`**; message files ở `messages/`.
- **Dữ liệu & auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **Triển khai:** Vercel (push repo, gán biến môi trường giống `.env.example`).

## Thư mục `src/`

| Đường dẫn                          | Vai trò                                                                                                                                                                                               |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                   | Root: `<html lang suppressHydrationWarning>`, font, `ThemeProvider`, `globals.css`.                                                                                                                   |
| `app/[locale]/layout.tsx`          | `NextIntlClientProvider`, **`RouteTransitionProgress`** (thanh tải khi click link nội bộ), `setRequestLocale`, metadata theo locale.                                                                  |
| `app/[locale]/loading.tsx`         | Skeleton + `aria-busy` khi chuyển route trong segment `[locale]` (App Router `loading.js`).                                                                                                           |
| `app/[locale]/page.tsx`            | Trang chủ (theo locale).                                                                                                                                                                              |
| `app/[locale]/live/page.tsx`       | Trang live / RTT.                                                                                                                                                                                     |
| `app/[locale]/profile/`            | Workspace sau đăng nhập: **`/profile` → redirect `/profile/folders`**, `folders`, `folders/[folderId]`, `notes`, `notes/[sessionId]`, `account`; layout + nav trong `layout.tsx` / `profile-nav.tsx`. |
| `app/[locale]/profile/loading.tsx` | Skeleton vùng nội dung profile (sidebar layout giữ nguyên).                                                                                                                                           |
| `features/profile/`                | Thư viện note, editor, folder CRUD tile, pagination, server actions (`transcript-session-actions`, …).                                                                                                |
| `features/live-note/`              | RTT panel, dialog lưu transcript (`save-transcript-dialog`), **`note-folder-actions`** (server).                                                                                                      |
| `hooks/`                           | Hook dùng chung (vd. focus trap dialog).                                                                                                                                                              |
| `lib/supabase/database.types.ts`   | Kiểu `Database` cho `createServerClient` / `createBrowserClient` (đồng bộ với schema Supabase).                                                                                                       |
| `supabase/migrations/`             | SQL migration versioned (đồng bộ với Supabase Dashboard khi dùng MCP/CLI).                                                                                                                            |
| `components/ui/`                   | Primitive: `Button` (prop **`loading`** + `Spinner`), **`Skeleton`**, `Spinner`, `cn` qua `buttonClassName` khi cần.                                                                                  |
| `components/navigation/`           | **`NavLink`** (`next/link` `useLinkStatus` + `Link` next-intl), **`RouteTransitionProgress`**.                                                                                                        |
| `components/layout/`               | Header (`site-header`, `site-header-nav`, `site-header-brand-link`, `header-auth`), footer landing (`site-footer.tsx`).                                                                               |
| `components/theme-provider.tsx`    | Bọc `next-themes` (class trên `<html>`).                                                                                                                                                              |
| `features/landing/`                | Trang chủ hackathon / marketing (claymorphism, hero, catalog, testimonials).                                                                                                                          |
| `i18n/routing.ts`                  | `locales`, `defaultLocale`, `localePrefix`.                                                                                                                                                           |
| `i18n/request.ts`                  | Cấu hình request next-intl (nạp messages).                                                                                                                                                            |
| `i18n/navigation.ts`               | `Link` / router có awareness locale; link có trạng thái pending → bọc **`NavLink`** (`@/components/navigation/nav-link`).                                                                             |
| `lib/env.ts`                       | Chuẩn hoá biến môi trường public qua Zod (`getPublicEnv`).                                                                                                                                            |
| `lib/utils.ts`                     | `cn()` — gộp class Tailwind an toàn.                                                                                                                                                                  |
| `lib/supabase/client.ts`           | Supabase **chỉ cho Client Component** (`"use client"`).                                                                                                                                               |
| `lib/supabase/server.ts`           | Supabase cho Server Component / Server Action / Route Handler.                                                                                                                                        |
| `lib/supabase/middleware.ts`       | Gắn cookie session lên `NextResponse` (có thể là response từ next-intl).                                                                                                                              |
| `middleware.ts`                    | **1)** `createMiddleware(routing)` (next-intl) **2)** `updateSession(request, response)` (Supabase).                                                                                                  |

**`messages/`** (cùng cấp `src/` trong project `web/`): `vi.json`, `en.json`, `id.json`, `th.json`, `ms.json` — **cùng cấu trúc key**; ba locale SEA có thể tái sinh từ `en.json` qua `node scripts/gen-sea-ui-locales.mjs` (xem `docs/I18N.md`).

## Luồng request

1. **Middleware:** next-intl xử lý locale (redirect, rewrite, cookie) và trả `NextResponse`; ngay sau đó `updateSession` đọc/ghi cookie Supabase Auth **trên cùng response đó** — tránh ghi đè redirect hoặc mất prefix locale.
2. **Server Components** trong `app/[locale]/` dùng `getTranslations` / `getLocale` khi cần copy hoặc `createSupabaseServerClient()` khi cần session/dữ liệu RLS.
3. **Client Components** gọi `createSupabaseBrowserClient()` cho tương tác realtime / form; `useTranslations` cho copy.

## Loading & ranh giới RSC → Client

- **`loading.tsx`** theo segment (`[locale]`, `profile`) hiển thị skeleton có `aria-busy` / `aria-live` và copy namespace **`Loading`** trong `messages/*.json`.
- **Không truyền hàm** (callback) từ Server Component xuống Client Component — chỉ serializable props; ví dụ thẻ note trong thư viện: server gọi format ngày + `getTranslations`, truyền **`updatedLabel: string`** vào `LibraryNoteCard`.
- CTA **`/`** ↔ **`/live`**: component client **`LiveAppNavLink`** để dùng chung `NavLink`.

## Mở rộng (scalability)

- Thêm domain (ghi chú, VALSEA, Agora): tạo `src/features/<feature>/` (components, hooks, actions) thay vì nhồi hết vào `app/`.
- Thêm locale: xem [`docs/I18N.md`](./I18N.md).
- API bên thứ ba (VALSEA REST/WebSocket): Route Handlers trong `app/api/.../route.ts` để giấu API key nếu cần (route API **không** nằm dưới `[locale]`; URL không đổi theo ngôn ngữ UI).
- **Service role key** chỉ dùng server-side, không bao giờ `NEXT_PUBLIC_`.

## Ghi chú Next.js 16

Build có thể cảnh báo chuyển từ convention `middleware` sang `proxy`. Theo dõi [tài liệu Next.js](https://nextjs.org/docs/messages/middleware-to-proxy); hiện tại mẫu Supabase + next-intl vẫn dùng middleware — có thể migrate khi chính thức ổn định.

## Tài liệu liên quan

- `docs/I18N.md` — quy ước message, namespace, mở rộng locale.
- `docs/FRONTEND.md` — quy ước UI/UX và component.
- `docs/BACKEND.md` — Supabase, RLS, env.
- `AGENTS.md` — hướng dẫn cho agent (Cursor).
