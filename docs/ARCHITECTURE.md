# Kiến trúc (Architecture)

## Tổng quan

- **Runtime:** Next.js 16 (App Router), React 19, TypeScript strict.
- **UI:** Tailwind CSS + token trong `src/app/globals.css` (màu, surface, action). Font **Inter** (subset `vietnamese`) + **JetBrains Mono** cho code.
- **Dữ liệu & auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **Triển khai:** Vercel (push repo, gán biến môi trường giống `.env.example`).

## Thư mục `src/`

| Đường dẫn                    | Vai trò                                                        |
| ---------------------------- | -------------------------------------------------------------- |
| `app/`                       | Routes, layout, metadata. Ưu tiên **Server Components**.       |
| `components/ui/`             | Thành phần UI tái sử dụng, không gắn domain.                   |
| `components/layout/`         | Khung trang (header, shell).                                   |
| `lib/env.ts`                 | Chuẩn hoá biến môi trường public qua Zod (`getPublicEnv`).     |
| `lib/utils.ts`               | `cn()` — gộp class Tailwind an toàn.                           |
| `lib/supabase/client.ts`     | Supabase **chỉ cho Client Component** (`"use client"`).        |
| `lib/supabase/server.ts`     | Supabase cho Server Component / Server Action / Route Handler. |
| `lib/supabase/middleware.ts` | Làm mới session cookie ở edge.                                 |
| `middleware.ts`              | Gọi `updateSession` cho các route khớp `matcher`.              |

## Luồng request

1. **Middleware** chạy trước, cập nhật cookie Supabase Auth (nếu đã cấu hình env).
2. **Server Components** dùng `createSupabaseServerClient()` khi cần đọc session hoặc dữ liệu có RLS.
3. **Client Components** gọi `createSupabaseBrowserClient()` cho tương tác realtime / form.

## Mở rộng (scalability)

- Thêm domain (ghi chú, VALSEA, Agora): tạo `src/features/<feature>/` (components, hooks, actions) thay vì nhồi hết vào `app/`.
- API bên thứ ba (VALSEA REST/WebSocket): Route Handlers trong `app/api/.../route.ts` để giấu API key nếu cần.
- **Service role key** chỉ dùng server-side, không bao giờ `NEXT_PUBLIC_`.

## Ghi chú Next.js 16

Build có thể cảnh báo chuyển từ convention `middleware` sang `proxy`. Theo dõi [tài liệu Next.js](https://nextjs.org/docs/messages/middleware-to-proxy); hiện tại mẫu Supabase vẫn dùng middleware — có thể migrate khi chính thức ổn định.

## Tài liệu liên quan

- `docs/FRONTEND.md` — quy ước UI/UX và component.
- `docs/BACKEND.md` — Supabase, RLS, env.
- `AGENTS.md` — hướng dẫn cho agent (Cursor).
