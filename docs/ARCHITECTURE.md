# Kiến trúc (Architecture)

## Tổng quan

- **Runtime:** Next.js 16 (App Router), React 19, TypeScript strict.
- **UI:** Tailwind CSS + token trong `src/app/globals.css` (màu, surface, action, clay landing). Font **Nunito** (subset `vietnamese`) + **JetBrains Mono** cho code.
- **i18n:** **next-intl** — locale **`vi`** (mặc định), **`en`**, **`id`**, **`th`**, **`ms`**; message files ở `messages/`.
- **Dữ liệu & auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **Triển khai:** Vercel (push repo, gán biến môi trường giống `.env.example`).

## Thư mục `src/`

| Đường dẫn                       | Vai trò                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                | Root: `<html lang suppressHydrationWarning>`, font, `ThemeProvider`, `globals.css`.                  |
| `app/[locale]/layout.tsx`       | `NextIntlClientProvider`, `setRequestLocale`, metadata theo locale.                                  |
| `app/[locale]/page.tsx`         | Trang chủ (theo locale).                                                                             |
| `app/[locale]/live/page.tsx`    | Trang live / RTT.                                                                                    |
| `components/ui/`                | Thành phần UI tái sử dụng, không gắn domain.                                                         |
| `components/layout/`            | Header, footer landing (`site-footer.tsx`).                                                          |
| `components/theme-provider.tsx` | Bọc `next-themes` (class trên `<html>`).                                                             |
| `features/landing/`             | Trang chủ hackathon / marketing (claymorphism, hero, catalog, testimonials).                         |
| `i18n/routing.ts`               | `locales`, `defaultLocale`, `localePrefix`.                                                          |
| `i18n/request.ts`               | Cấu hình request next-intl (nạp messages).                                                           |
| `i18n/navigation.ts`            | `Link` / router có awareness locale.                                                                 |
| `lib/env.ts`                    | Chuẩn hoá biến môi trường public qua Zod (`getPublicEnv`).                                           |
| `lib/utils.ts`                  | `cn()` — gộp class Tailwind an toàn.                                                                 |
| `lib/supabase/client.ts`        | Supabase **chỉ cho Client Component** (`"use client"`).                                              |
| `lib/supabase/server.ts`        | Supabase cho Server Component / Server Action / Route Handler.                                       |
| `lib/supabase/middleware.ts`    | Gắn cookie session lên `NextResponse` (có thể là response từ next-intl).                             |
| `middleware.ts`                 | **1)** `createMiddleware(routing)` (next-intl) **2)** `updateSession(request, response)` (Supabase). |

**`messages/`** (cùng cấp `src/` trong project `web/`): `vi.json`, `en.json`, `id.json`, `th.json`, `ms.json` — **cùng cấu trúc key**; ba locale SEA có thể tái sinh từ `en.json` qua `node scripts/gen-sea-ui-locales.mjs` (xem `docs/I18N.md`).

## Luồng request

1. **Middleware:** next-intl xử lý locale (redirect, rewrite, cookie) và trả `NextResponse`; ngay sau đó `updateSession` đọc/ghi cookie Supabase Auth **trên cùng response đó** — tránh ghi đè redirect hoặc mất prefix locale.
2. **Server Components** trong `app/[locale]/` dùng `getTranslations` / `getLocale` khi cần copy hoặc `createSupabaseServerClient()` khi cần session/dữ liệu RLS.
3. **Client Components** gọi `createSupabaseBrowserClient()` cho tương tác realtime / form; `useTranslations` cho copy.

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
