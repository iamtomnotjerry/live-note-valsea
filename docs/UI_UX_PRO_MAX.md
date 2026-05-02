# UI UX Pro Max (Cursor)

Skill: [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) · Demo tham chiếu: [Educational platform](https://www.uupm.cc/demo/educational-platform).

## Đã cài trong repo `web/`

CLI (toàn cục, một lần):

```bash
npm install -g uipro-cli
cd path/to/web
uipro init --ai cursor
```

Kết quả: thư mục **`.cursor/skills/ui-ux-pro-max/`** (`SKILL.md`, script Python `scripts/search.py`, dữ liệu CSV). Cursor sẽ gợi ý quy tắc UI/UX khi bạn nhờ thiết kế / landing / dashboard.

**Python 3.x** cần cho lệnh nâng cao (design system ASCII/Markdown), ví dụ:

```bash
python .cursor/skills/ui-ux-pro-max/scripts/search.py "edtech playful" --design-system -f markdown
```

(Đường dẫn tương đối từ thư mục `web/`.)

## Cách dùng hằng ngày

- Chat tự nhiên: _“Redesign hero theo claymorphism, checklist WCAG”_ — skill thường được kích hoạt khi làm UI/UX.
- Bám stack dự án: **Next.js + Tailwind** (xem `docs/FRONTEND.md`, `AGENTS.md`).

## Trang chủ Live Note Taker

Landing hiện tại lấy cảm hứng layout edu-demo (hero, catalog, progress, testimonials, CTA) nhưng **nội dung hackathon / Live Note Taker / VALSEA**; không dùng emoji làm icon (SVG).
