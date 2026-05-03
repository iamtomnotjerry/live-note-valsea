# Supabase — kết nối dự án

## Trạng thái project (đã check qua Supabase MCP)

| Hạng mục             | Kết quả                                                                                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API URL**          | `https://ahhijuoqfnrqmldurnuk.supabase.co`                                                                                                                                                                                   |
| **Bảng `public`**    | `transcript_sessions`, `transcript_segments`, `note_folders` — **RLS bật** (số dòng tuỳ dùng)                                                                                                                                |
| **Security advisor** | Gọi MCP `get_advisors` (security): còn **WARN** tuỳ chọn (vd. _Leaked password protection_ nếu dùng mật khẩu — Google OAuth không bắt buộc). DB function `transcript_sessions_set_updated_at` đã gắn `search_path = public`. |

### MCP Supabase (Cursor)

Agent có thể gọi **`apply_migration`** / **`execute_sql`** trên project đã liên kết — ví dụ đã apply:

- `transcript_sessions_updated_at_and_folder_counts_rpc` — cột `updated_at`, trigger, RPC `note_counts_by_folder_for_user`.
- `fix_transcript_sessions_set_updated_at_search_path` — chỉnh linter `function_search_path_mutable`.

File tương ứng trong repo: [`supabase/migrations/`](../supabase/migrations/) (giữ đồng bộ với Dashboard **Database → Migrations**).

Kiểu TypeScript DB: [`src/lib/supabase/database.types.ts`](../src/lib/supabase/database.types.ts) (đồng bộ với schema hiện tại; có thể regenerate bằng MCP `generate_typescript_types` hoặc CLI `supabase gen types`).

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

- Bảng `transcript_sessions`: `user_id` → `auth.users`, `title`, **`transcript`** (full text export), `created_at`, **`updated_at`** (tự cập nhật khi sửa), **`folder_id`** (tuỳ chọn) → `note_folders`.
- Hàm SQL **`note_counts_by_folder_for_user()`**: gom đếm note theo `folder_id` cho user hiện tại (app gọi qua RPC; nếu chưa deploy thì app fallback đếm bằng query `folder_id`).
- Bảng **`note_folders`**: `user_id`, `name` — nhóm các phiên đã lưu (UI “folder / file”).
- Bảng `transcript_segments` (tuỳ chọn mở rộng sau).
- **RLS:** chỉ `authenticated`, mỗi user chỉ đọc/ghi dòng `user_id = auth.uid()` (và segment thuộc session của mình). Insert `transcript_sessions` chỉ cho phép `folder_id` trỏ tới folder **của chính user** hoặc `null`. Có thêm policy **update** / **delete** session của chính user (để chỉnh sửa ghi chú trên trang Profile).

**Project Supabase đã tạo trước khi có `note_folders`:** mở SQL Editor, chạy **toàn bộ** file `schema.sql` hiện tại (các lệnh `IF NOT EXISTS` / `DROP POLICY` + `CREATE POLICY` an toàn khi chạy lại), hoặc copy phần từ comment `/* Folders:` trong file đến hết policy `sess_insert_own` đã cập nhật.

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
