# 🚀 Hướng dẫn Deploy lên Vercel từ GitHub

## 📋 **Yêu cầu trước khi deploy:**

1. ✅ Code đã push lên GitHub repository
2. ✅ Database PostgreSQL đã setup trên Neon
3. ✅ Cấu hình Vercel đã sẵn sàng

## 🔧 **Các bước deploy:**

### **Bước 1: Tạo tài khoản Vercel**
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub account
3. Authorize Vercel truy cập repositories

### **Bước 2: Import Project từ GitHub**
1. Vào Vercel Dashboard
2. Click **"New Project"**
3. Chọn repository **"TienLoThan"** từ GitHub
4. Click **"Import"**

### **Bước 3: Cấu hình Environment Variables**
Trong Vercel Dashboard, vào **Settings > Environment Variables** và thêm:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_u5SXZm3yzvOl@ep-long-dust-a1cl7wyx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret (tạo secret mạnh)
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# Node Environment
NODE_ENV=production
```

**Lưu ý:** 
- `NUXT_PUBLIC_BASE_URL` và `NUXT_PUBLIC_API_BASE_URL` sẽ được Vercel tự động set
- Thay `your-super-secret-jwt-key-here-change-this-in-production` bằng secret mạnh

### **Bước 4: Cấu hình Build Settings**
Vercel sẽ tự động detect:
- **Framework Preset:** Nuxt.js
- **Build Command:** `npm run build`
- **Output Directory:** `.output`
- **Install Command:** `npm install`

### **Bước 5: Deploy**
1. Click **"Deploy"**
2. Vercel sẽ tự động:
   - Install dependencies
   - Build ứng dụng
   - Deploy lên CDN

### **Bước 6: Khởi tạo Database**
Sau khi deploy thành công, cần chạy migration:

**Option A: Sử dụng Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration
vercel env pull .env.local
npx prisma db push
npx prisma db seed
```

**Option B: Sử dụng Neon Console**
1. Truy cập Neon Dashboard
2. Vào **SQL Editor**
3. Chạy migration script (nếu có)

### **Bước 7: Seed dữ liệu**
```bash
# Chạy seed script
node scripts/seed.js
```

## 🔍 **Kiểm tra sau khi deploy:**

1. **Truy cập ứng dụng:** https://your-app-name.vercel.app
2. **Test API:** https://your-app-name.vercel.app/api/ranking/top-players
3. **Test đăng nhập/đăng ký**
4. **Kiểm tra database connection**

## 🛠️ **Troubleshooting:**

### **Lỗi Database Connection:**
- Kiểm tra `DATABASE_URL` trong Environment Variables
- Đảm bảo database đã được tạo trên Neon
- Kiểm tra network access trong Neon

### **Lỗi Build:**
- Kiểm tra logs trong Vercel Dashboard
- Đảm bảo tất cả dependencies đã được install
- Kiểm tra Node.js version compatibility

### **Lỗi 404:**
- Kiểm tra `vercel.json` configuration
- Đảm bảo API routes đúng path

## 📊 **Monitoring:**

1. **Vercel Dashboard:** Theo dõi performance và logs
2. **Neon Dashboard:** Monitor database usage
3. **GitHub:** Code changes sẽ auto-deploy

## 🔄 **Auto Deploy:**

- Mỗi khi push code lên `main` branch, Vercel sẽ tự động deploy
- Có thể setup preview deployments cho các branch khác

## 📝 **Lưu ý quan trọng:**

1. **Bảo mật:** Không commit `.env` file
2. **Performance:** Vercel có CDN global, tốc độ load nhanh
3. **Scaling:** Vercel tự động scale theo traffic
4. **Cost:** Free tier có giới hạn, monitor usage

## 🎯 **Kết quả mong đợi:**

Sau khi deploy thành công, bạn sẽ có:
- ✅ Website live tại: `https://your-app-name.vercel.app`
- ✅ API endpoints hoạt động
- ✅ Database kết nối thành công
- ✅ Auto-deploy từ GitHub
- ✅ SSL certificate tự động
- ✅ CDN global performance
