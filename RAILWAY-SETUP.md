# 🚀 Hướng dẫn Deploy Game TienLoThan lên Railway

## 📋 **Environment Variables cần cấu hình**

### **1. Database Configuration**
```
DATABASE_URL="postgresql://neondb_owner:npg_u5SXZm3yzvOl@ep-long-dust-a1cl7wyx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### **2. JWT Secret Key**
```
JWT_SECRET="tien-lo-than-game-super-secret-jwt-key-2024-railway-production"
```

### **3. Environment**
```
NODE_ENV="production"
```

### **4. Public URLs (Cập nhật với URL thực của Railway)**
```
NUXT_PUBLIC_BASE_URL="https://tien-lo-than-game-production.railway.app"
NUXT_PUBLIC_API_BASE_URL="https://tien-lo-than-game-production.railway.app/api"
```

## 🔧 **Cách cấu hình trên Railway**

### **Bước 1: Truy cập Railway Dashboard**
- Mở: https://railway.app/dashboard
- Đăng nhập bằng GitHub

### **Bước 2: Tạo project mới**
1. Nhấn "New Project"
2. Chọn "Deploy from GitHub repo"
3. Chọn repository `tien-lo-than-game`

### **Bước 3: Cấu hình Environment Variables**
1. Vào Settings → Variables
2. Thêm từng biến môi trường theo danh sách trên
3. **Lưu ý**: Cập nhật `NUXT_PUBLIC_BASE_URL` và `NUXT_PUBLIC_API_BASE_URL` với URL thực của Railway

### **Bước 4: Thêm PostgreSQL Database**
1. Nhấn "New" → "Database" → "PostgreSQL"
2. Copy `DATABASE_URL` từ database service
3. Paste vào Variables của service ứng dụng

## 🎮 **Truy cập Game**

Sau khi deploy thành công:
- **URL Game**: `https://tien-lo-than-game-production.railway.app`
- **API Base**: `https://tien-lo-than-game-production.railway.app/api`

## 📱 **Tính năng Game**

- **Trang chủ**: Hiển thị thông tin nhân vật
- **Tu luyện**: Nâng cấp cảnh giới
- **Nhiệm vụ**: Hoàn thành quest để nhận thưởng
- **Cửa hàng**: Mua trang bị và vật phẩm
- **Xếp hạng**: So sánh với người chơi khác
- **Linh thú**: Nuôi và săn linh thú
- **Lò đạo**: Chế tạo vật phẩm

## 🔍 **Troubleshooting**

### **Lỗi Database Connection**
- Kiểm tra `DATABASE_URL` có đúng không
- Đảm bảo database service đang chạy

### **Lỗi Build**
- Kiểm tra logs trong Railway Dashboard
- Đảm bảo tất cả Environment Variables đã được cấu hình

### **Lỗi 404**
- Kiểm tra `NUXT_PUBLIC_BASE_URL` có đúng không
- Đảm bảo URL không có dấu `/` ở cuối

## 📞 **Hỗ trợ**

Nếu gặp vấn đề, hãy kiểm tra:
1. Railway Dashboard → Logs
2. Environment Variables
3. Database connection
4. Build logs
