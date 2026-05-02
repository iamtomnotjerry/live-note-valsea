# Live Note Taker

Ứng dụng **ghi chép buổi học realtime** (tên dễ nhớ cho demo hackathon) — **Next.js 16**, **Supabase**, **Vercel**, tích hợp **VALSEA** speech-to-text.

## Bắt đầu

```bash
cp .env.example .env.local
# Điền NEXT_PUBLIC_SUPABASE_* và VALSEA_API_KEY

npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Live RTT (VALSEA WebSocket)

Trình duyệt cần **proxy cục bộ** để gắn Bearer khi bắt tay WebSocket (xem `docs/BACKEND.md`).

```bash
npm run dev:rtt
```

Sau đó mở [http://localhost:3000/live](http://localhost:3000/live), bấm **Start recording**.

**Lỗi WebSocket `ws://127.0.0.1:3331`:** trong terminal tab `proxy` phải thấy `listening` — nếu thấy `Thiếu VALSEA_API_KEY`, tạo/chỉnh file **`web/.env.local`** (cùng thư mục với `package.json`), thêm dòng `VALSEA_API_KEY=vl_...`, rồi chạy lại `npm run dev:rtt`.

## Scripts

| Lệnh                   | Mô tả                  |
| ---------------------- | ---------------------- |
| `npm run dev`          | Dev server (Turbopack) |
| `npm run build`        | Production build       |
| `npm run start`        | Chạy bản build         |
| `npm run lint`         | ESLint                 |
| `npm run format`       | Prettier ghi đè        |
| `npm run format:check` | Kiểm tra format        |

## Tài liệu trong repo

- **`AGENTS.md`** — quy tắc cho Cursor / AI và người mới vào dự án.
- **`docs/ARCHITECTURE.md`** — kiến trúc, thư mục, luồng middleware.
- **`docs/FRONTEND.md`** — UI/UX, Tailwind, Server/Client.
- **`docs/BACKEND.md`** — Supabase, env, RLS, API.
- **`docs/COMMITS.md`** — conventional commits.
- **`docs/PRE_COMMIT.md`** — Husky, lint-staged.
- **`docs/CURSOR_AND_AI.md`** — cách prompt hiệu quả.

## GitHub · Vercel · Supabase

Hướng dẫn đầy đủ: [`docs/DEPLOY.md`](docs/DEPLOY.md) · Supabase: [`docs/SUPABASE.md`](docs/SUPABASE.md).

Tóm tắt:

1. **GitHub:** `git remote add origin …` rồi `git push` từ thư mục `web/` (xem DEPLOY).
2. **Vercel:** Import repo → Root Directory để trống nếu repo chỉ chứa app Next này → thêm env `NEXT_PUBLIC_SUPABASE_*`, `VALSEA_API_KEY`.
3. **Supabase:** Tạo project → copy URL + anon key → chạy tuỳ chọn [`supabase/schema.sql`](supabase/schema.sql).

**RTT trên Vercel:** proxy WebSocket local không chạy trên Vercel mặc định — xem [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Bảo mật

- Chỉ `NEXT_PUBLIC_*` cho Supabase URL + anon key.
- **Service role** (nếu dùng) chỉ server — không commit, không prefix public.

## License

Private / theo quyết định chủ repo.
