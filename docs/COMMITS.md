# Commit messages

## Quy ước (Conventional Commits)

```
<type>(<scope>): <mô tả ngắn>

[optional body]
```

### `type` thường dùng

| Type       | Khi nào                                       |
| ---------- | --------------------------------------------- |
| `feat`     | Tính năng mới                                 |
| `fix`      | Sửa lỗi                                       |
| `docs`     | Chỉ tài liệu                                  |
| `chore`    | CI, config, dependency không đổi hành vi user |
| `refactor` | Đổi cấu trúc code, không đổi hành vi          |
| `test`     | Thêm/sửa test                                 |
| `style`    | Format, không đổi logic                       |

### `scope` (tùy chọn)

Ngắn gọn theo khu vực: `auth`, `notes`, `api`, `ui`, `supabase`, `i18n` (copy trong `messages/`), …

### Ví dụ

- `feat(notes): add session list page`
- `fix(supabase): refresh cookies in middleware`
- `chore: bump next to 16.2.4`
- `feat(i18n): add LocaleSwitcher strings for exam mode`
- `feat(ui): route loading skeletons, nav progress, button loading states`
- `fix(ui): responsive SiteHeader, landing dark-mode neo contrast`

## Nguyên tắc

- Một commit một ý chính; dễ revert và review.
- Mô tả tiếng Anh hoặc tiếng Việt **nhất quán** trong repo (đội chọn một ngôn ngữ cho commit).
