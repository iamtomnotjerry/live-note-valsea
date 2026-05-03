# Pre-commit & chất lượng code

## Husky + lint-staged

- Hook: `.husky/pre-commit` chạy **`npx lint-staged`**.
- Cấu hình trong `package.json` → `lint-staged`:
  - **Prettier** — format file staged: `*.{ts,tsx,js,jsx,mjs,cjs,json,css,md}` (gồm mọi `messages/*.json`).
  - **ESLint** — `*.{ts,tsx}` với `--max-warnings 0` (cảnh báo cũng fail).

Khi đổi copy i18n: cập nhật **mọi** `messages/{vi,en,id,th,ms}.json` cùng key (hoặc sửa `en.json` rồi chạy `node scripts/gen-sea-ui-locales.mjs` cho `id`/`th`/`ms`) — xem [`docs/I18N.md`](./I18N.md).

## Cài đặt lần đầu

Sau `git clone` và `npm install`, chạy một lần (nếu hook chưa executable — trên Windows/Git Bash thường ổn):

```bash
npm run prepare
```

## Chạy tay trước khi push

```bash
npm run format:check
npm run lint
npm run build
```

**Lưu ý Next.js 16:** lệnh `next lint` đã bị gỡ; dự án dùng `eslint .` (xem `package.json` → `lint`).

## CI (khuyến nghị)

Trên Vercel, build đã chạy `next build`. Có thể thêm GitHub Actions chạy `lint` + `format:check` cho mọi PR.

## Bỏ qua hook (chỉ khi bất khả kháng)

```bash
git commit --no-verify
```

Không lạm dụng; hook tồn tại để giữ codebase đồng nhất.
