# Trái ngọt Bắc Ninh

Ứng dụng web quản lý nhà vườn, truy xuất nông sản và hỗ trợ kỹ thuật cho vùng cây ăn quả phường Chũ, TP. Bắc Ninh. Dự án dùng React, TypeScript, Vite và Express; vẫn hoạt động với bộ tri thức cục bộ khi chưa cấu hình Gemini.

## Tính năng

| Nhóm | Chức năng |
| --- | --- |
| Khách mua | Duyệt, tìm kiếm, lọc sản phẩm/chứng nhận; xem nguồn gốc, nhà vườn, vị trí và nhật ký; quản lý giỏ hàng và luồng đặt hàng mô phỏng. |
| Nhà vườn | Đăng nhập nhanh bằng tài khoản mẫu; khai báo hồ sơ vườn; thêm, sửa giá và thông tin bài đăng nông sản. |
| Canh tác | Tổng quan vườn, thời tiết, lịch công việc; ghi nhật ký tưới, bón phân, BVTV hoặc việc chung và đồng bộ vào nông sản. |
| Bản đồ | Bản đồ vị trí khu vườn, lớp tiêu chuẩn/vệ tinh, thông tin từng vùng và mô hình 3D với góc camera, trạng thái tưới. |
| Cộng đồng | Lọc thẻ, thích, bình luận, tạo/sửa/xóa bài viết và ảnh trong phạm vi phiên trình duyệt. |
| Trợ lý AI | Hỏi đáp canh tác, chẩn đoán sâu bệnh bằng mô tả/ảnh và kết nối chuyên gia; dùng fallback theo cây trồng khi Gemini không sẵn sàng. |

> Dữ liệu tài khoản, sản phẩm, cộng đồng và đơn hàng là dữ liệu mẫu trong bộ nhớ. Tải lại trang sẽ đưa chúng về trạng thái ban đầu. Đặt hàng là mô phỏng, không tạo giao dịch thật.

## Kiến trúc

```text
src/App.tsx
├── Điều hướng, đăng nhập demo, giỏ hàng và dữ liệu nông sản phiên làm việc
├── Marketplace / ProductDetail / Cart
├── Overview / Weather / Calendar / GardenLocation / Community
└── Assistant: AiAssistantTab / DiagnosisTab / ExpertChatTab

server.ts: GET /api/health · POST /api/chat · POST /api/diagnosis
```

Các chuyên mục lớn và hộp thoại được tải chậm. Ba màn hình của Trợ lý AI là các chunk riêng và chỉ tải khi mở.

## Cài đặt và chạy

Yêu cầu: Node.js 20+ và npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`. Nếu không có `GEMINI_API_KEY`, các endpoint AI vẫn trả kết quả dự phòng cục bộ.

| Biến | Bắt buộc | Mô tả |
| --- | --- | --- |
| `GEMINI_API_KEY` | Không | Khóa Gemini cho phân tích ảnh và hội thoại AI. |
| `PORT` | Không | Cổng Express; mặc định `3000`. |
| `NODE_ENV` | Không | Đặt `production` để Express phục vụ từ `dist/`. |

Không đưa `.env.local` hoặc API key vào Git.

### Triển khai GitHub Pages

Repository này là project site GitHub Pages nên bản build dùng tiền tố `/traingotbacninh/`. Hãy triển khai **nội dung thư mục `dist/`** sau khi chạy:

```powershell
npm run build
```

Không thay `vite.config.ts` bằng cấu hình rút gọn chỉ có React: dự án cần plugin Tailwind để giao diện được biên dịch đúng. Các ảnh đặt trong `public/assets` cũng đã được tạo URL tương thích với GitHub Pages.

GitHub Pages chỉ phục vụ tệp tĩnh. Các API `/api/chat` và `/api/diagnosis` cần một backend riêng nếu muốn gọi Gemini trên môi trường production; nếu không, ứng dụng tự chuyển sang nội dung fallback cục bộ khi request thất bại.

## Lệnh dự án

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Chạy Express kèm Vite ở chế độ phát triển. |
| `npm run build` | Tạo bản production trong `dist/`. |
| `npm run start` | Chạy server; dùng với `NODE_ENV=production` sau khi build. |
| `npm run preview` | Xem bản build qua Vite. |
| `npm run lint` | Kiểm tra TypeScript, không sinh tệp. |
| `npm run clean` | Xóa `dist/` và `server.js`. |

## API nội bộ

### `GET /api/health`

Trả về `status`, thời điểm server và cờ `aiEnabled`.

### `POST /api/chat`

Nhận `{ prompt, currentFarmer? }`. `prompt` bắt buộc, không rỗng, tối đa 3.000 ký tự. Khi Gemini lỗi hoặc hết thời gian chờ 15 giây, server trả về câu trả lời cục bộ theo cây trồng.

### `POST /api/diagnosis`

Nhận `{ imageBase64?, mimeType?, plantType?, affectedPart?, symptomsDescription? }`.

- Chỉ nhận JPEG, PNG hoặc WebP.
- Ảnh base64 tối đa 12 MB tại server; client giới hạn tệp gốc 10 MB.
- Client thu nhỏ ảnh về cạnh dài tối đa 1.600 px và mã hóa JPEG chất lượng 82% trước khi gửi.
- Gemini có thời gian chờ 25 giây; lỗi sẽ chuyển sang chẩn đoán dự phòng theo cây trồng/triệu chứng.

## Kiểm thử đã thực hiện — 25/10/2026

### Kiểm thử kỹ thuật

| Hạng mục | Cách kiểm thử | Kết quả |
| --- | --- | --- |
| Kiểu TypeScript | `npm run lint` | Đạt, không có lỗi kiểu. |
| Bản production | `npm run build` | Đạt, 1.699 module được chuyển đổi và build hoàn tất. |
| Khởi động production | Chạy `tsx server.ts` với `NODE_ENV=production`, cổng riêng | Đạt, server lắng nghe thành công. |
| Tải chậm Trợ lý AI | Kiểm tra manifest build | Đạt: `AssistantTab` 3,39 KB; chat, chẩn đoán và chuyên gia là chunk riêng. |
| Bảo vệ đầu vào API | Rà soát route và typecheck | Đạt: giới hạn request 14 MB, kiểm tra MIME/kích thước ảnh, giới hạn câu hỏi 3.000 ký tự và dọn timer timeout. |

### Ma trận chức năng

| Luồng | Phạm vi kiểm thử | Trạng thái |
| --- | --- | --- |
| Điều hướng và khả năng truy cập | Sidebar, header, skip-link, title/meta theo tab, tải chậm các tab | Đạt qua rà soát tích hợp ở `App.tsx` và build. |
| Sạp nông sản | Tìm kiếm, lọc, xem chi tiết, thêm giỏ, chỉnh số lượng/xóa | Đạt qua callback và kiểu dữ liệu `MarketplaceTab` → `App` → `CartModal`. |
| Đăng nhập nhà vườn | Đăng nhập nhanh, đăng xuất, chuyển Tổng quan, cập nhật hồ sơ | Đạt qua state `currentFarmer`, `isLoggedIn` và modal. |
| Đăng/sửa nông sản | Thêm đầu danh sách, sửa giá/nội dung, cập nhật sản phẩm đang xem | Đạt qua callback cập nhật bất biến của `produceList`. |
| Lịch và nhật ký | Lọc/hoàn thành công việc, tạo 4 loại nhật ký, đồng bộ nông sản | Đạt qua `cultivationSync` và `handleAddCultivationLog`. |
| Bản đồ vườn | Chuyển chế độ bản đồ, chọn vườn, mô hình 3D/góc camera/tưới | Đạt qua props, state và cleanup resize của component bản đồ. |
| Cộng đồng | Lọc, thích, bình luận, tạo/sửa/xóa bài và ảnh | Đạt ở lớp state; không xóa bài qua UI để tránh thay đổi dữ liệu demo đang mở. |
| Trợ lý AI | Chat/chẩn đoán/chuyên gia, fallback cục bộ, điều hướng chéo | Đạt về render và luồng fallback; không gửi câu hỏi thật. |
| Chẩn đoán ảnh | Chọn ảnh, camera, resize/nén, gọi API/fallback, in/lưu | Đạt qua đường đi mã và build; chưa cấp quyền camera hoặc tải ảnh qua UI. |
| Chuyên gia | Danh sách, tìm kiếm/lọc, hồ sơ, chọn chủ đề, phiên chat | Đạt smoke test UI: hiển thị 6 chuyên gia, 4 trực tuyến và các nút hồ sơ/chat. Không gửi tin nhắn thử. |

Các thao tác gửi tin nhắn AI, tải ảnh, bật camera, in và hoàn tất đặt hàng không được kích hoạt vì có thể truyền dữ liệu, yêu cầu quyền thiết bị hoặc tạo thay đổi phiên. Hãy kiểm thử tích hợp trong staging với API key thử nghiệm trước khi triển khai.

## Hiệu năng và an toàn

- Trợ lý AI code-split theo chức năng để giảm JavaScript tải ban đầu.
- Ảnh chẩn đoán được nén phía client, giảm băng thông và bộ nhớ.
- API giới hạn kích thước request và kiểu ảnh; có timeout rõ ràng và fallback không phụ thuộc mạng.
- Nội dung nông học do AI sinh ra chỉ mang tính hỗ trợ. Cần đối chiếu nhãn thuốc, danh mục hiện hành và cán bộ chuyên môn trước khi áp dụng.

## Cấu trúc thư mục

```text
src/
  components/       Giao diện theo từng chức năng
  data/             Dữ liệu mẫu sản phẩm, bệnh và chuyên gia
  types/            Kiểu TypeScript dùng chung
  utils/            Đồng bộ nhật ký canh tác
  App.tsx           Điều phối state và luồng chính
server.ts            Express, Gemini và fallback nông học
public/              Tài nguyên public
ANH/                 Ảnh nông sản và nhà vườn
```

## Hướng phát triển

- Thêm kiểm thử tự động cho giỏ hàng, nhật ký và API validation.
- Lưu dữ liệu vào backend có xác thực thay vì state tại client.
- Tích hợp kho ảnh an toàn, rate limiting, quan sát lỗi API và staging cho Gemini.
