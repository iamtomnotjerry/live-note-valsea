# Supabase — kết nối dự án

## Trạng thái project (đã check qua Supabase MCP)

| Hạng mục             | Kết quả                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| **API URL**          | `https://ahhijuoqfnrqmldurnuk.supabase.co`                              |
| **Bảng `public`**    | `transcript_sessions`, `transcript_segments` — **RLS bật**, hiện 0 dòng |
| **Security advisor** | Không có lint trả về (lần gọi `get_advisors` gần nhất)                  |

**MCP không thể thay bạn:** bật provider **Google**, nhập **Client ID / Client Secret**, sửa **Site URL / Redirect URLs** trong Dashboard — làm tay theo checklist dưới.

### Google Cloud — URI bắt buộc (copy nguyên)

Dán vào OAuth client loại **Web application** → **Authorized redirect URIs** (Google gọi Supabase trước, không gọi thẳng `localhost`):

```text
https://ahhijuoqfnrqmldurnuk.supabase.co/auth/v1/callback
```

**Authorized JavaScript origins** (local dev):

```text
http://localhost:3000
```

Sau đó copy **Client ID** + **Client secret** → Supabase → **Authentication** → **Providers** → **Google** → Save.

## Liên kết với Next.js (`web/`)

App đã cấu hình `@supabase/ssr`:

- Client (browser): [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts)
- Server: [`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts)
- Middleware: next-intl + làm mới session Supabase — [`src/middleware.ts`](../src/middleware.ts) gọi `updateSession(request, response)` với response từ intl (xem [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md)).

Biến public (Zod trong [`src/lib/env.ts`](../src/lib/env.ts) khi gọi `getPublicEnv()`):

- `NEXT_PUBLIC_SUPABASE_URL`
- **Một trong hai** (app gộp trong `resolveSupabaseAnonKey()` — ưu tiên anon nếu có cả hai):
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — JWT anon (legacy / Dashboard “anon public”)
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — khóa publishable dạng `sb_publishable_…` (Dashboard mới)

Copy từ Supabase Dashboard → **Settings → API**. Xem thêm [`.env.example`](../.env.example).

## Auth & RLS

- Bật **Row Level Security** cho mọi bảng chứa dữ liệu người dùng.
- Policy mẫu: `auth.uid() = user_id` (điều chỉnh theo schema thực tế).
- **Service role key** chỉ dùng trên server / job — không `NEXT_PUBLIC_`, không commit.

## Schema (transcript + phiên live)

File [`supabase/schema.sql`](../supabase/schema.sql):

- Bảng `transcript_sessions`: `user_id` → `auth.users`, `title`, **`transcript`** (full text export), `created_at`.
- Bảng `transcript_segments` (tuỳ chọn mở rộng sau).
- **RLS:** chỉ `authenticated`, mỗi user chỉ đọc/ghi dòng `user_id = auth.uid()` (và segment thuộc session của mình).

Chạy lại script trong SQL Editor nếu bạn đã từng chạy bản policy `open_*` cũ (file hiện `DROP` policy cũ rồi tạo policy mới).

## Auth (Google OAuth) — checklist Dashboard

1. **Supabase → Authentication → URL configuration**
   - **Site URL:** `http://localhost:3000` (hoặc domain deploy).
   - **Redirect URLs:** thêm  
     `http://localhost:3000/auth/callback`  
     và bản HTTPS production nếu có (`https://…/auth/callback`).
2. **Supabase → Authentication → Providers → Google:** bật, dán **Client ID** + **Client Secret** từ Google (sau bước URI ở mục “Trạng thái project” phía trên).
3. **Google Cloud → OAuth consent screen:** External + **Test users** (nếu app còn Testing).
4. **App:** [`/[locale]/login`](../src/app/[locale]/login/page.tsx) gọi `signInWithOAuth({ provider: 'google' })`; [`src/app/auth/callback/route.ts`](../src/app/auth/callback/route.ts) đổi `code` lấy cookie session rồi redirect `?next=` (ví dụ `/live`).

## CLI (tuỳ chọn)

```bash
npx supabase login
npx supabase link --project-ref <YOUR_REF>
npx supabase db push
```

Cần `supabase/config.toml` từ `supabase init` nếu dùng migration đầy đủ — hiện repo dùng SQL file đơn giản.
