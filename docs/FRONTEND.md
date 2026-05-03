# Frontend

## Nguyên tắc UI/UX (pro)

1. **Hierarchy:** Một hành động chính (primary) trên màn hình; secondary/ghost cho tác vụ phụ.
2. **Typography:** `<html lang>` theo locale hiện tại (next-intl + `getLocale()`). Font chính **Nunito** (Google Fonts, subset `vietnamese`); **JetBrains Mono** cho đoạn `code`. Line-height thoáng (1.6 trên `body`); tránh đoạn quá rộng (`max-w-*`, `text-pretty` / `text-balance` khi phù hợp). Trang chủ dùng thêm token `[data-landing]` + lớp `.clay-card` (claymorphism) — xem `globals.css`.
3. **Màu sắc:** Dùng CSS variables (`--foreground`, `--muted-fg`, `--action`, …) để light/dark nhất quán và đạt contrast tốt hơn so với hard-code hex rải rác.
4. **Focus:** Không xoá viền focus; `globals.css` có `:focus-visible` — component interactive phải thấy được khi điều hướng bàn phím.
5. **Semantics:** Heading đúng cấp, landmark (`header`, `main`, `nav` + `aria-label` khi cần), `sr-only` cho tiêu đề section chỉ phục vụ screen reader. Nhãn `aria-label` của control đổi ngôn ngữ → lấy từ `messages` (ví dụ `LocaleSwitcher`).
6. **Performance:** Ưu tiên Server Components; `"use client"` chỉ khi cần hook trình duyệt, event, state cục bộ, hoặc Supabase browser client.

## UI UX Pro Max (Cursor skill)

- Cài đặt và CLI: [`docs/UI_UX_PRO_MAX.md`](./UI_UX_PRO_MAX.md) · Repo gốc: [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

## i18n (next-intl)

- **Chi tiết và checklist mở rộng locale:** [`docs/I18N.md`](./I18N.md).
- **Tóm tắt:** mọi copy user-facing nằm trong `messages/*.json` (`vi`, `en`, `id`, `th`, `ms`) — **cùng key** mọi file.
- **Điều hướng nội bộ:** `import { Link, useRouter, usePathname } from '@/i18n/navigation'` — không dùng `next/link` cho route trong app (tránh mất locale).
- **Đổi ngôn ngữ:** `LocaleSwitcher` (`router.replace(pathname, { locale })`); không tự nối chuỗi `/en` trên URL.
- **Component server:** `await getTranslations('Namespace')`; **client:** `useTranslations('Namespace')`.
- **Giá trị gửi API / log:** tách biệt khỏi chuỗi UI; map locale → tham số kỹ thuật (ví dụ ASR `language`) ở một chỗ (page hoặc helper).

## Giao diện sáng / tối

- **`next-themes`** (`ThemeProvider` trong `src/app/layout.tsx`, `attribute="class"`, `darkMode: 'class'` trong Tailwind).
- Nút **`ThemeToggle`** trên header; trạng thái lưu theo cookie/local của `next-themes`.
- Token màu landing: `[data-landing="true"]` và `.dark [data-landing="true"]` trong `globals.css` (pastel campus + dark tím ấm). Trang **`/`**, **`/live`**, **`/login`** dùng wrapper `data-landing` + `landing-gradient-bg`; **`SiteHeader`** / **`SiteFooter`** nhận `tone="landing"`; panel/form RTT và đăng nhập có prop tuỳ chọn **`tone="landing"`** (`LiveRttPanel`, `LoginForm`) để class neo (`neo-card`, `neo-btn`, …) khớp landing — mặc định `default` ở chỗ khác.

## Tailwind

- **`tailwind.config.ts` → `content`:** phải gồm `src/features/**` (ví dụ landing) — nếu thiếu, mọi utility trong feature không được build và UI trông “vỡ” hoàn toàn.
- Gom class xung đột qua `cn()` từ `@/lib/utils`.
- Nút: dùng `Button` hoặc `buttonClassName()` khi cần `<Link>` trông như nút (tránh lồng `<button><a>`). Với Link nội bộ, dùng `Link` từ `@/i18n/navigation`.

## Cấu trúc component

- `components/ui/*`: primitive, không import feature-specific API.
- `components/layout/*`: khung app (header kèm i18n).
- Feature lớn: `src/features/<name>/` (xem `docs/ARCHITECTURE.md`). Trang **profile** (folders, notes, editor) dùng neo/clay **`tone="landing"`** giống live/login khi cần đồng bộ visual.
