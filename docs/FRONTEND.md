# Frontend

## Nguyên tắc UI/UX (pro)

1. **Hierarchy:** Một hành động chính (primary) trên màn hình; secondary/ghost cho tác vụ phụ.
2. **Typography:** `lang="vi"` ở `<html>`, line-height thoáng (1.6 trên `body`), tránh đoạn quá rộng (`max-w-*`, `text-pretty` / `text-balance` khi phù hợp).
3. **Màu sắc:** Dùng CSS variables (`--foreground`, `--muted-fg`, `--action`, …) để light/dark nhất quán và đạt contrast tốt hơn so với hard-code hex rải rác.
4. **Focus:** Không xoá viền focus; `globals.css` có `:focus-visible` — component interactive phải thấy được khi điều hướng bàn phím.
5. **Semantics:** Heading đúng cấp, landmark (`header`, `main`, `nav` + `aria-label` khi cần), `sr-only` cho tiêu đề section chỉ phục vụ screen reader.
6. **Performance:** Ưu tiên Server Components; `"use client"` chỉ khi cần hook trình duyệt, event, hoặc Supabase browser client.

## Tailwind

- Gom class xung đột qua `cn()` từ `@/lib/utils`.
- Nút: dùng `Button` hoặc `buttonClassName()` khi cần `<Link>` trông như nút (tránh lồng `<button><a>`).

## Cấu trúc component

- `components/ui/*`: primitive, không import feature-specific API.
- `components/layout/*`: khung app.
- Feature lớn: cân nhắc `src/features/<name>/` (xem `docs/ARCHITECTURE.md`).

## i18n (tương lai)

- Hiện copy tiếng Việt inline. Khi cần đa ngôn ngữ: `next-intl` hoặc tách file `messages/vi.json`.
