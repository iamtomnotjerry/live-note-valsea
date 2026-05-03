# Triển khai: GitHub · Vercel · Supabase

Repo Git hiện gốc tại thư mục **`web/`** (cùng cấp với `package.json`). Các ghi chú `.md` ở `d:\valsea\` (ngoài `web/`) **không** nằm trong Git trừ khi bạn gộp monorepo.

## 1. GitHub

### Tạo repo trống trên GitHub

- [github.com/new](https://github.com/new) → đặt tên (ví dụ `live-note-valsea`) → **không** tick “Add README” nếu đã có code local.

### Đẩy code từ máy (PowerShell)

```powershell
cd d:\valsea\web
git status
git add .
git commit -m "chore: initial Live Note + VALSEA RTT"
git branch -M main
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

Thay `<USER>` / `<REPO>` bằng repo của bạn.

**Lưu ý:** `.env.local` đã có trong `.gitignore` — **không** commit file chứa `VALSEA_API_KEY`.

### GitHub CLI (tuỳ chọn)

```powershell
cd d:\valsea\web
gh repo create <REPO> --private --source=. --remote=origin --push
```

## 2. Vercel

**Tên project (dễ nhớ khi demo):** trong Vercel → Project **Settings** → **General** → **Project Name**, đặt ví dụ `live-note-taker` (slug URL sẽ gọn hơn tên mặc định kiểu `web`).

1. Đăng nhập [vercel.com](https://vercel.com) → **Add New…** → **Project** → **Import** repo GitHub vừa push.
2. **Root Directory:** để trống (`.`) vì repo = nội dung `web/`.  
   Nếu sau này bạn đưa cả `valsea/` lên GitHub và để app trong `web/`, khi đó đặt Root Directory = `web`.
3. **Framework Preset:** Next.js (tự nhận).
4. **Environment Variables** (Settings → Environment Variables), thêm **Production + Preview**:

| Name                                   | Value              | Ghi chú                                                                 |
| -------------------------------------- | ------------------ | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL dự án Supabase | Settings → API                                                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`        | JWT anon `eyJ…`    | Public; **hoặc** dùng dòng dưới thay thế — app cần **ít nhất một** key. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` | Public (Dashboard mới); xem `src/lib/env.ts` nếu không có anon.         |
| `VALSEA_API_KEY`                       | `vl_…`             | **Server only**; proxy RTT / API route sau này.                         |

5. **Deploy.**

### Đa ngôn ngữ (URL)

- **Tiếng Việt (mặc định):** `/`, `/live` (không prefix).
- **English:** `/en`, `/en/live` — next-intl `localePrefix: 'as-needed'`.
- Không cần biến môi trường riêng cho i18n; chỉ cần build/deploy bình thường. Quy ước copy: [`docs/I18N.md`](./I18N.md).

### Live RTT (WebSocket proxy) trên Vercel

- `npm run dev:rtt` chỉ chạy **proxy cục bộ** (`node scripts/valsea-rt-proxy.mjs`). **Vercel không chạy** process WebSocket lâu dài kiểu đó trên cùng một deploy mặc định.
- Trên production, bạn cần một trong các hướng:
  - Host proxy tại dịch vụ có WebSocket (**Render** khuyến nghị cho free tier: [`RENDER.md`](./RENDER.md); hoặc Railway, Fly.io, VPS…), rồi đặt `NEXT_PUBLIC_VALSEA_RT_PROXY_URL` trỏ tới URL **`wss://…`**; hoặc
  - Dùng **REST** `POST /v1/audio/transcriptions` qua Route Handler (không cần WS proxy) — độ trễ khác RTT dev.

Chi tiết backend: [`BACKEND.md`](./BACKEND.md).

## 3. Supabase

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project** → chọn region, đặt mật khẩu DB.
2. **Settings → API:** copy `Project URL` và khóa public (**anon JWT** hoặc **publishable**, tùy Dashboard) → gán `NEXT_PUBLIC_SUPABASE_URL` và **một trong** `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (local `.env.local` + Vercel). Chi tiết: [`.env.example`](../.env.example), [`docs/SUPABASE.md`](./SUPABASE.md).
3. (Tuỳ chọn) Chạy SQL trong [`supabase/schema.sql`](../supabase/schema.sql) ở **SQL Editor** để tạo bảng lưu transcript sau này.
4. Chi tiết RLS và client: [`SUPABASE.md`](./SUPABASE.md).

## Checklist nhanh

- [ ] Push `web/` lên GitHub (không lộ `.env.local`).
- [ ] Vercel import repo + env Supabase + `VALSEA_API_KEY`.
- [ ] Supabase project + (tuỳ chọn) `schema.sql`.
- [ ] i18n: mặc định `/` tiếng Việt, English `/en` — quy ước copy trong [`I18N.md`](./I18N.md).
- [ ] Hiểu giới hạn RTT proxy trên Vercel; proxy public (ví dụ [Render](./RENDER.md)) hoặc REST.
