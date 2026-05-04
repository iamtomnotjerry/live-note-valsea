# Frontend

## Nguyên tắc UI/UX (pro)

1. **Hierarchy:** Một hành động chính (primary) trên màn hình; secondary/ghost cho tác vụ phụ.
2. **Typography:** `<html lang>` theo locale hiện tại (next-intl + `getLocale()`). Font chính **Nunito** (Google Fonts, subset `vietnamese`); **JetBrains Mono** cho đoạn `code`. Line-height thoáng (1.6 trên `body`); tránh đoạn quá rộng (`max-w-*`, `text-pretty` / `text-balance` khi phù hợp). Trang chủ dùng thêm token `[data-landing]` + lớp `.clay-card` (claymorphism) — xem `globals.css`.
3. **Màu sắc:** Dùng CSS variables (`--foreground`, `--muted-fg`, `--action`, …) để light/dark nhất quán và đạt contrast tốt hơn so với hard-code hex rải rác.
4. **Focus:** Không xoá viền focus; `globals.css` có `:focus-visible` — component interactive phải thấy được khi điều hướng bàn phím.
5. **Semantics:** Heading đúng cấp, landmark (`header`, `main`, `nav` + `aria-label` khi cần), `sr-only` cho tiêu đề section chỉ phục vụ screen reader. Nhãn `aria-label` của control đổi ngôn ngữ → lấy từ `messages` (ví dụ `LocaleSwitcher`).
6. **Performance:** Ưu tiên Server Components; `"use client"` chỉ khi cần hook trình duyệt, event, state cục bộ, hoặc Supabase browser client.
7. **Loading:** Route segment dùng **`loading.tsx`** (skeleton + `aria-busy`); nút bất đồng bộ dùng **`Button` `loading`** (spinner + `aria-busy`, tự `disabled`). Đổi ngôn ngữ: **`LocaleSwitcher`** bọc `router.replace` trong **`useTransition`** + `aria-busy` trên `<select>`.
8. **RSC → Client:** không truyền **hàm** xuống Client Component (trừ Server Action đã `"use server"`). Truyền chuỗi / số / object JSON-safe đã tính sẵn trên server (ví dụ nhãn ngày đã format cho thẻ note).

## UI UX Pro Max (Cursor skill)

- Cài đặt và CLI: [`docs/UI_UX_PRO_MAX.md`](./UI_UX_PRO_MAX.md) · Repo gốc: [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

## i18n (next-intl)

- **Chi tiết và checklist mở rộng locale:** [`docs/I18N.md`](./I18N.md).
- **Tóm tắt:** mọi copy user-facing nằm trong `messages/*.json` (`vi`, `en`, `id`, `th`, `ms`) — **cùng key** mọi file.
- **Điều hướng nội bộ:** `import { Link, useRouter, usePathname } from '@/i18n/navigation'` — không dùng `next/link` cho route trong app (tránh mất locale). Khi cần UI **pending** sau khi bấm link (spinner / dim), dùng **`NavLink`** từ `@/components/navigation/nav-link` (bọc `Link` next-intl + `useLinkStatus` từ `next/link`).
- **Đổi ngôn ngữ:** `LocaleSwitcher` (`router.replace(pathname, { locale })` trong `useTransition`); không tự nối chuỗi `/en` trên URL. Chuỗi **`LocaleSwitcher.switching`** trong `messages/*.json` cho trạng thái đang đổi locale.
- **Component server:** `await getTranslations('Namespace')`; **client:** `useTranslations('Namespace')`.
- **Giá trị gửi API / log:** tách biệt khỏi chuỗi UI; map locale → tham số kỹ thuật (ví dụ ASR `language`) ở một chỗ (page hoặc helper).

## Giao diện sáng / tối

- **`next-themes`** (`ThemeProvider` trong `src/app/layout.tsx`, `attribute="class"`, `darkMode: 'class'` trong Tailwind).
- Nút **`ThemeToggle`** trên header; trạng thái lưu theo cookie/local của `next-themes`.
- Token màu landing: `[data-landing="true"]` và `.dark [data-landing="true"]` trong `globals.css` (pastel campus + dark tím ấm). Trang **`/`**, **`/live`**, **`/login`** dùng wrapper `data-landing` + `landing-gradient-bg`; **`SiteHeader`** / **`SiteFooter`** nhận `tone="landing"`; panel/form RTT và đăng nhập có prop tuỳ chọn **`tone="landing"`** (`LiveRttPanel`, `LoginForm`) để class neo (`neo-card`, `neo-btn`, …) khớp landing — mặc định `default` ở chỗ khác.

## Tailwind

- **`tailwind.config.ts` → `content`:** phải gồm `src/features/**` (ví dụ landing) — nếu thiếu, mọi utility trong feature không được build và UI trông “vỡ” hoàn toàn.
- Gom class xung đột qua `cn()` từ `@/lib/utils`.
- Animation thanh tải khi điều hướng: keyframe **`route-bar`** trong `tailwind.config.ts` (dùng bởi `RouteTransitionProgress`).
- Nút: dùng **`Button`** (có **`loading`**) hoặc `buttonClassName()` khi cần `<Link>` trông như nút (tránh lồng `<button><a>`). Với link nội bộ: **`Link`** hoặc **`NavLink`** từ `@/i18n/navigation` / `@/components/navigation/nav-link`.

## Cấu trúc component

- `components/ui/*`: primitive, không import feature-specific API.
- `components/layout/*`: khung app (header kèm i18n).
- Feature lớn: `src/features/<name>/` (xem `docs/ARCHITECTURE.md`). Trang **profile** (folders, notes, editor) dùng neo/clay **`tone="landing"`** giống live/login khi cần đồng bộ visual.
- **VALSEA trên editor ghi chú:** `NoteValseaToolbar` gọi `/api/valsea/tool` và `/api/valsea/transcribe`; icon SVG tách file `note-valsea-toolbar-icons.tsx`; chuỗi UI và hộp hướng dẫn trong `messages/*.json` (`Profile.editorValsea*`, `editorValseaGuide*`). Chi tiết env và route: [`docs/BACKEND.md`](./BACKEND.md) (mục API tích hợp VALSEA).
