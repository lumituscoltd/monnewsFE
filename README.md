# MonNews Lummitus - Search UI

Hệ thống tìm kiếm và thu thập tài liệu thông minh với giao diện hiện đại.

## 🚀 Cài đặt

```bash
npm install
```

## 🏃 Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 🏗️ Build cho production

```bash
npm run build
```

## 🌐 Deploy lên Server (Nginx + SSL)

### Lần đầu tiên deploy:
```bash
sudo bash deploy.sh
```

Script sẽ tự động:
- Build ứng dụng
- Deploy lên `/var/www/monnews`
- Cấu hình Nginx cho domain `monnews.lumitus.com.vn`
- Cài đặt SSL certificate với Certbot (Let's Encrypt)

### Update code sau khi pull từ Git:
```bash
sudo bash update.sh
```

Script sẽ tự động:
- Pull code từ Git
- Check dependencies changes
- Build lại ứng dụng
- Backup phiên bản cũ
- Deploy phiên bản mới
- Reload Nginx

### Khôi phục backup khi cần:
```bash
sudo bash rollback.sh
```

📖 **Chi tiết:** 
- Deploy: [DEPLOYMENT.md](DEPLOYMENT.md)
- Update: [UPDATE_GUIDE.md](UPDATE_GUIDE.md)

## 📦 Công nghệ sử dụng

- **React 18** - UI Framework
- **Vite** - Build tool siêu nhanh
- **TailwindCSS** - Utility-first CSS framework
- **SheetJS (xlsx)** - Xuất dữ liệu ra Excel

## 🎨 Tính năng

- ✅ Tìm kiếm đa nguồn (Google, Bing, DuckDuckGo, Baidu)
- ✅ Hỗ trợ đa ngôn ngữ (VN, EN, ZH)
- ✅ Lọc kết quả theo tiêu chí nội dung
- ✅ Xuất kết quả ra file Excel
- ✅ Giao diện responsive, hiện đại
- ✅ Loading animation khi tìm kiếm
- ✅ Auto-deploy script với Nginx + SSL
- ✅ Màu đỏ chủ đạo (#DC2626)

## 📁 Cấu trúc dự án

```
src/
├── components/
│   ├── Header.jsx
│   ├── SearchPanel.jsx
│   ├── ResultsTable.jsx
│   └── Footer.jsx
├── pages/
│   └── SearchPage.jsx
├── utils/
│   └── mockData.js
├── App.jsx
├── index.css
└── main.jsx
```

## 🔮 Mở rộng tương lai

- Kết nối API backend (FastAPI)
- Tóm tắt nội dung bằng LLM
- Bộ lọc theo thời gian
- Modal xem chi tiết nội dung
- Lưu lịch sử tìm kiếm

