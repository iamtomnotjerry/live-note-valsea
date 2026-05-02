# Supabase — kết nối dự án

## Liên kết với Next.js (`web/`)

App đã cấu hình `@supabase/ssr`:

- Client (browser): [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts)
- Server: [`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts)
- Middleware làm mới session: [`src/middleware.ts`](../src/middleware.ts)

Biến bắt buộc (Zod trong [`src/lib/env.ts`](../src/lib/env.ts) khi gọi `getPublicEnv()`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Copy từ Supabase Dashboard → **Settings → API**.

## Auth & RLS

- Bật **Row Level Security** cho mọi bảng chứa dữ liệu người dùng.
- Policy mẫu: `auth.uid() = user_id` (điều chỉnh theo schema thực tế).
- **Service role key** chỉ dùng trên server / job — không `NEXT_PUBLIC_`, không commit.

## Schema gợi ý (transcript)

File [`supabase/schema.sql`](../supabase/schema.sql) tạo bảng + RLS với policy **mở cho dev/hackathon**. Trước khi public production, thay policy `open_*` bằng quy tắc theo `auth.uid()`.

## CLI (tuỳ chọn)

```bash
npx supabase login
npx supabase link --project-ref <YOUR_REF>
npx supabase db push
```

Cần `supabase/config.toml` từ `supabase init` nếu dùng migration đầy đủ — hiện repo dùng SQL file đơn giản.
