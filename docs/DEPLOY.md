# Triển khai: GitHub · Vercel · Supabase

Repo Git hiện gốc tại thư mục **`web/`** (cùng cấp với `package.json`). Các ghi chú `.md` ở `d:\valsea\` (ngoài `web/`) **không** nằm trong Git trừ khi bạn gộp monorepo.

## 1. GitHub

### Tạo repo trống trên GitHub

- [github.com/new](https://github.com/new) → đặt tên (ví dụ `ghi-lop` / `live-note-valsea`) → **không** tick “Add README” nếu đã có code local.

### Đẩy code từ máy (PowerShell)

```powershell
cd d:\valsea\web
git status
git add .
git commit -m "chore: initial GhiLớp + VALSEA RTT"
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

1. Đăng nhập [vercel.com](https://vercel.com) → **Add New…** → **Project** → **Import** repo GitHub vừa push.
2. **Root Directory:** để trống (`.`) vì repo = nội dung `web/`.  
   Nếu sau này bạn đưa cả `valsea/` lên GitHub và để app trong `web/`, khi đó đặt Root Directory = `web`.
3. **Framework Preset:** Next.js (tự nhận).
4. **Environment Variables** (Settings → Environment Variables), thêm **Production + Preview**:

| Name                            | Value              | Ghi chú                                             |
| ------------------------------- | ------------------ | --------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL dự án Supabase | Settings → API                                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon `eyJ...`      | public                                              |
| `VALSEA_API_KEY`                | `vl_...`           | **server only**, dùng cho API route / tính năng sau |

5. **Deploy.**

### Live RTT (WebSocket proxy) trên Vercel

- `npm run dev:rtt` chỉ chạy **proxy cục bộ** (`node scripts/valsea-rt-proxy.mjs`). **Vercel không chạy** process WebSocket lâu dài kiểu đó trên cùng một deploy mặc định.
- Trên production, bạn cần một trong các hướng:
  - Host proxy tại dịch vụ có WebSocket (Railway, Fly.io, VPS…), rồi đặt `NEXT_PUBLIC_VALSEA_RT_PROXY_URL` trỏ tới URL đó; hoặc
  - Dùng **REST** `POST /v1/audio/transcriptions` qua Route Handler (không cần WS proxy) — độ trễ khác RTT dev.

Chi tiết backend: [`BACKEND.md`](./BACKEND.md).

## 3. Supabase

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project** → chọn region, đặt mật khẩu DB.
2. **Settings → API:** copy `Project URL` và `anon` `public` → gán vào `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` (local `.env.local` + Vercel).
3. (Tuỳ chọn) Chạy SQL trong [`supabase/schema.sql`](../supabase/schema.sql) ở **SQL Editor** để tạo bảng lưu transcript sau này.
4. Chi tiết RLS và client: [`SUPABASE.md`](./SUPABASE.md).

## Checklist nhanh

- [ ] Push `web/` lên GitHub (không lộ `.env.local`).
- [ ] Vercel import repo + env Supabase + `VALSEA_API_KEY`.
- [ ] Supabase project + (tuỳ chọn) `schema.sql`.
- [ ] Hiểu giới hạn RTT proxy trên Vercel; lên kế hoạch proxy riêng hoặc REST.
