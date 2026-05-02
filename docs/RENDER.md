# Deploy proxy RTT lên Render

Proxy [`scripts/valsea-rt-proxy.mjs`](../scripts/valsea-rt-proxy.mjs) nhận WebSocket từ trình duyệt và nối tới `wss://api.valsea.ai/v1/realtime` kèm `Authorization: Bearer …`.

Render gán biến **`PORT`** tự động — script đã ưu tiên `PORT` và lắng nghe **`0.0.0.0`**.

## 1. Chuẩn bị

- Repo trên GitHub (root = thư mục `web/` hoặc chỉ chứa app).
- **`VALSEA_API_KEY`** (`vl_...`).

## 2. Tạo Web Service trên Render

1. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
2. **Connect** repository GitHub → chọn đúng repo.
3. Điền thông tin cơ bản:
   - **Name:** ví dụ `valsea-rt-proxy`
   - **Region:** gần bạn (Singapore nếu có).
   - **Branch:** `main` (hoặc branch bạn dùng).
   - **Root Directory:** nếu monorepo và app nằm trong `web/`, gõ **`web`**. Repo chỉ có app thì để trống.
   - **Runtime:** **Node**

## 3. Build & Start (quan trọng)

Repo có `npm run build` = **Next.js** — service này **chỉ chạy proxy**, không build Next:

| Trường            | Giá trị                            |
| ----------------- | ---------------------------------- |
| **Build Command** | `npm install` hoặc `npm ci`        |
| **Start Command** | `node scripts/valsea-rt-proxy.mjs` |

**Không** dùng `npm run build` / `npm start` (vì `start` trong `package.json` là Next.js).

## 4. Biến môi trường

Trong **Environment** của service:

| Name             | Value    | Ghi chú  |
| ---------------- | -------- | -------- |
| `VALSEA_API_KEY` | `vl_...` | Bắt buộc |

**`PORT`:** Render tự inject — **không** cần thêm tay.

**`VALSEA_RT_PROXY_PORT`:** **không** set trên Render (nếu set sẽ ép cổng 3331; nên để script dùng `PORT` của Render).

Không cần `NEXT_PUBLIC_*` trên service proxy.

## 5. Gói & WebSocket

- **Free:** Web Service free có thể **sleep** sau một lúc không có traffic — lần mở đầu có thể **chậm vài chục giây** (cold start). Trước demo nên mở URL một lần để “đánh thức”.
- **WebSocket:** Render hỗ trợ upgrade WebSocket trên Web Service (dùng **`wss://`** từ trang HTTPS).

## 6. Public URL → Vercel

Sau khi deploy xong, Render cho URL dạng:

`https://valsea-rt-proxy.onrender.com` (ví dụ)

Trên **Vercel** → Project → **Environment Variables**:

- **`NEXT_PUBLIC_VALSEA_RT_PROXY_URL`** = **`wss://valsea-rt-proxy.onrender.com`**  
  (cùng hostname, đổi `https` → **`wss`**, **không** thêm path nếu proxy lắng nghe tại gốc).

Redeploy Vercel.

## 7. Kiểm tra

1. Mở site Vercel → `/live` → bắt đầu ghi.
2. Xem **Logs** trên Render: có kết nối / lỗi upstream không.
3. Nếu fail: kiểm tra service không đang sleep, `VALSEA_API_KEY` đúng, và URL trên Vercel là **`wss://`**.

## Lưu ý

- **Bảo mật:** endpoint proxy public — hackathon thường chấp nhận; production nên thêm auth sau.
- **Railway / Fly / VPS:** cùng ý tưởng — chỉ cần process Node + `PORT` + `VALSEA_API_KEY`; xem thêm [`RAILWAY.md`](./RAILWAY.md) nếu dùng Railway.
- Tổng quan deploy: [`DEPLOY.md`](./DEPLOY.md).
