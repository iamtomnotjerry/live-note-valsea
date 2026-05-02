# Deploy proxy RTT lên Railway (tuỳ chọn)

**Gợi ý miễn phí / dễ vào:** [Render — `RENDER.md`](./RENDER.md). Railway thường yêu cầu thêm gói trả phí.

Proxy [`scripts/valsea-rt-proxy.mjs`](../scripts/valsea-rt-proxy.mjs) nhận WebSocket từ trình duyệt và nối tới `wss://api.valsea.ai/v1/realtime` kèm `Authorization: Bearer …`.

Trên Railway, platform gán biến **`PORT`** — script đã đọc `PORT` (ưu tiên hơn `VALSEA_RT_PROXY_PORT`) và lắng nghe **`0.0.0.0`**.

## 1. Chuẩn bị

- Repo đã push GitHub (có thư mục `web/` hoặc repo chỉ chứa app).
- Có **`VALSEA_API_KEY`** (`vl_...`).

## 2. Tạo project trên Railway

1. Đăng nhập [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → chọn repo.
2. Railway tạo **một service** mặc định. Mở service đó.

## 3. Cấu hình build / start (quan trọng)

Repo này có `npm run build` = **Next.js**, không phải proxy. Bạn cần **chỉ chạy proxy**:

1. Vào service → tab **Settings** (hoặc **Deploy**).
2. **Build Command** (hoặc tương đương trong Nixpacks): đặt ví dụ  
   `npm install`  
   (hoặc `npm ci` nếu lockfile ổn định).  
   **Không** để mặc định `npm run build` nếu nó trigger build Next toàn app (tốn thời gian / có thể fail nếu thiếu env Next).
3. **Start Command** / **Custom Start Command**:  
   `node scripts/valsea-rt-proxy.mjs`

Nếu gốc repo là monorepo và app nằm trong `web/`, tạo service với **Root Directory** = `web` (Railway: Settings → Root Directory).

## 4. Biến môi trường

Trong service → **Variables**:

| Name             | Value                 | Ghi chú                       |
| ---------------- | --------------------- | ----------------------------- |
| `VALSEA_API_KEY` | `vl_...`              | Bắt buộc                      |
| `PORT`           | _(để Railway tự gán)_ | Thường **không** cần set tay. |

Không cần `NEXT_PUBLIC_*` trên service proxy.

## 5. Public URL (HTTPS / WSS)

1. Service → **Settings** → **Networking** → **Generate Domain** (hoặc gắn domain riêng).
2. Railway cho URL dạng `https://your-service.up.railway.app`.  
   Trình duyệt kết nối WebSocket qua **cùng host**, dùng **`wss://`**:
   - Ví dụ: `wss://your-service.up.railway.app`

**Không** dùng `ws://127.0.0.1` trên Vercel.

## 6. Nối Vercel

Trong Vercel → Project → **Environment Variables**:

- `NEXT_PUBLIC_VALSEA_RT_PROXY_URL` = `wss://your-service.up.railway.app`  
  (đúng domain Railway của bạn, **không** có `/` thừa nếu proxy lắng nghe tại root).

Redeploy Vercel sau khi lưu env.

## 7. Kiểm tra

1. Mở site Vercel → `/live` → **Bắt đầu ghi**.
2. Xem log Railway: có connection / lỗi upstream không.
3. Nếu lỗi CORS / mixed content: đảm bảo trang Vercel là **HTTPS** và proxy URL là **`wss://`**.

## Lưu ý

- **Bảo mật:** URL proxy public — ai cũng có thể thử kết nối. Hackathon có thể chấp nhận; production nên thêm **auth** (token ngắn hạn, allowlist) sau.
- **Free tier / sleep:** Một số gói có cold start; demo quan trọng nên “đánh thức” service trước vài phút.
- Chi tiết chung: [`DEPLOY.md`](./DEPLOY.md).
