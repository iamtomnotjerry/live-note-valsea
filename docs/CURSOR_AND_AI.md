# Làm việc với Cursor / AI

## Trước mỗi prompt lớn

1. Đọc **`AGENTS.md`** (root project `web/`).
2. Nếu đụng UI hoặc copy: `docs/FRONTEND.md` + `docs/I18N.md` (chuỗi trong `messages/*.json`, cùng key mọi locale).
3. Nếu đụng Supabase/API: `docs/BACKEND.md` + `docs/ARCHITECTURE.md`.

## Prompt hiệu quả

- Nêu **route** hoặc **file** (`src/app/[locale]/...`, `src/features/...`, `messages/*.json`).
- Nêu **ràng buộc:** Server vs Client Component, có cần giấu API key không.
- Yêu cầu cập nhật **docs** khi thay đổi kiến trúc hoặc env.

## Quy tắc `.cursor/rules`

File `.cursor/rules/valsea-web.mdc` áp dụng cho `src/**` — agent luôn thấy convention dự án.

## Không để AI “đoán mò” env

Luôn nhắc: biến public trong `.env.example`; secret chỉ server.
