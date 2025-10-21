# 🚀 Enhanced Frontend - MonNews Search System

## 📋 Tổng quan

Frontend đã được nâng cấp để hỗ trợ đầy đủ **4 tiêu chí tìm kiếm nâng cao**:

### ✅ Tiêu chí 1 - Tốc độ phản hồi
- **Thời gian phản hồi trung bình**: Dưới 20 giây
- **Timeout tối đa**: 30 giây với thông báo lỗi rõ ràng
- **Performance Dashboard**: Hiển thị thời gian phản hồi, trạng thái, và các chỉ số hiệu suất

### ✅ Tiêu chí 2 - Số lượng và chất lượng kết quả
- **Tối thiểu 10 kết quả**: Đảm bảo số lượng kết quả chất lượng cao
- **60% tiêu chí compliance**: Lọc kết quả dựa trên độ liên quan
- **Sắp xếp theo độ liên quan**: Kết quả được sắp xếp theo số lượng tiêu chí đáp ứng

### ✅ Tiêu chí 3 - Thông tin chi tiết cho từng kết quả
- **7 loại thông tin bắt buộc**:
  1. **Tên tài liệu**: Tiêu đề chính xác
  2. **Loại tài liệu**: PDF/DOCX/PPTX/XLSX/Online/Khác
  3. **Ngày xuất bản**: Định dạng DD/MM/YYYY
  4. **Tác giả**: Tên tác giả/tổ chức xuất bản
  5. **Chỉ số đáp ứng**: X/Y tiêu chí đạt
  6. **Tóm tắt nội dung**: Tối đa 15 dòng
  7. **Link nguồn**: URL truy cập trực tiếp

- **Trích dẫn minh chứng**: 2-3 câu cho mỗi tiêu chí đạt
- **Highlight keywords**: Từ khóa được làm nổi bật
- **Criteria Compliance**: Hiển thị chi tiết tiêu chí đạt/chưa đạt

### ✅ Tiêu chí 4 - Độ chính xác nội dung
- **Trích dẫn chính xác 100%**: So với nội dung gốc
- **Tóm tắt không thêm thông tin**: Chỉ dựa trên tài liệu nguồn
- **Truy xuất nguồn**: Có thể truy cập tài liệu gốc

## 🎨 Các Component Mới

### 1. **SearchPanel** (Nâng cấp)
- **Enhanced Search Toggle**: Kích hoạt tìm kiếm nâng cao
- **Multi-Criteria Input**: Nhập nhiều tiêu chí tìm kiếm
- **Minimum Results Setting**: Đặt số kết quả tối thiểu (10-50)
- **Real-time Validation**: Kiểm tra input trước khi tìm kiếm

### 2. **PerformanceDashboard**
- **Response Time**: Hiển thị thời gian phản hồi
- **Performance Status**: Trạng thái hiệu suất (Tốt/Chậm/Timeout)
- **Minimum Results Achievement**: Đạt tối thiểu 10 kết quả
- **Timeout Status**: Có bị timeout hay không
- **Detailed Analysis**: Phân tích chi tiết hiệu suất

### 3. **CriteriaCompliance**
- **Compliance Score**: Hiển thị X/Y tiêu chí đạt
- **Criteria Met**: Danh sách tiêu chí đạt (màu xanh)
- **Criteria Not Met**: Danh sách tiêu chí chưa đạt (màu đỏ)
- **Progress Bar**: Thanh tiến trình tỷ lệ đáp ứng
- **Color Coding**: Màu sắc theo mức độ đáp ứng

### 4. **DocumentInfo**
- **Document Type Badge**: Loại tài liệu với icon
- **Publication Date**: Ngày xuất bản
- **Author Information**: Thông tin tác giả
- **Source Link**: Link nguồn có thể click
- **Search Engine & Language**: Engine tìm kiếm và ngôn ngữ
- **Source Verification**: Xác thực nguồn
- **Content Accuracy Score**: Điểm độ chính xác

### 5. **SummaryDisplay**
- **Expandable Summary**: Tóm tắt có thể mở rộng
- **Relevant Quotes**: Trích dẫn minh chứng
- **Highlighted Content**: Nội dung được highlight
- **Quality Indicators**: Chỉ số chất lượng nội dung
- **Interactive Elements**: Các nút tương tác

### 6. **TimeoutAlert**
- **Timeout Detection**: Phát hiện timeout
- **Retry Functionality**: Chức năng thử lại
- **User Guidance**: Hướng dẫn người dùng
- **Error Analysis**: Phân tích nguyên nhân lỗi

## 🚀 Cách sử dụng

### 1. **Kích hoạt Enhanced Search**
```javascript
// Trong SearchPanel, bật toggle "Kích hoạt tìm kiếm nâng cao"
enableEnhancedSearch: true
```

### 2. **Nhập tiêu chí tìm kiếm**
```javascript
// Nhập nhiều tiêu chí, mỗi tiêu chí một dòng
criteriaList: [
  "artificial intelligence",
  "defense applications", 
  "autonomous systems",
  "threat detection"
]
```

### 3. **Đặt số kết quả tối thiểu**
```javascript
// Đặt từ 10-50 kết quả
search_pages: 10  // Tối thiểu 10 kết quả
```

### 4. **Xem Performance Dashboard**
- Thời gian phản hồi
- Trạng thái hiệu suất
- Đạt tối thiểu 10 kết quả
- Có bị timeout hay không

### 5. **Phân tích kết quả**
- **Criteria Compliance**: Xem tiêu chí nào đạt/chưa đạt
- **Document Info**: Thông tin chi tiết tài liệu
- **Summary**: Tóm tắt và trích dẫn minh chứng
- **Source Verification**: Xác thực nguồn

## 🎯 Tính năng nổi bật

### 1. **Real-time Performance Monitoring**
- Theo dõi thời gian phản hồi
- Phát hiện timeout
- Đánh giá hiệu suất tìm kiếm

### 2. **Advanced Criteria Analysis**
- Phân tích độ liên quan từng tiêu chí
- Hiển thị trích dẫn minh chứng
- Highlight keywords quan trọng

### 3. **Enhanced User Experience**
- Giao diện trực quan, dễ sử dụng
- Thông báo lỗi rõ ràng
- Hướng dẫn người dùng

### 4. **Comprehensive Document Information**
- 7 loại thông tin bắt buộc
- Xác thực nguồn
- Đánh giá độ chính xác

## 🔧 Cấu hình

### Environment Variables
```bash
VITE_API_URL=http://localhost:8100
```

### Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "xlsx": "^0.18.5",
  "tailwindcss": "^3.3.0"
}
```

## 🚀 Chạy Frontend

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

## 📊 API Integration

Frontend tích hợp với Backend API để:
- Gửi yêu cầu tìm kiếm nâng cao
- Nhận kết quả với đầy đủ metadata
- Hiển thị performance information
- Xử lý timeout và lỗi

## 🎨 Styling

Sử dụng Tailwind CSS với:
- **Custom Components**: Các component tùy chỉnh
- **Responsive Design**: Thiết kế responsive
- **Dark/Light Mode**: Hỗ trợ chế độ sáng/tối
- **Animations**: Hiệu ứng mượt mà

## 🔍 Testing

```bash
# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage
```

## 📝 Notes

- Frontend đã được tối ưu cho 4 tiêu chí tìm kiếm nâng cao
- Tương thích với Backend API mới
- Hỗ trợ đầy đủ 7 loại thông tin bắt buộc
- Có xử lý timeout và lỗi tốt
- Giao diện thân thiện, dễ sử dụng
