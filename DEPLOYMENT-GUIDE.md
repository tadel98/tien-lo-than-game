# 🚀 Hướng dẫn Deploy Tự Động

## ⏰ **Deploy sau 5 giờ (Khuyến nghị)**

### Cách 1: Sử dụng npm script
```bash
npm run deploy:5h
```

### Cách 2: Sử dụng Windows Batch
```cmd
scripts\deploy-5h.bat
```

### Cách 3: Sử dụng PowerShell
```powershell
.\scripts\deploy-5h.ps1
```

## 🚀 **Deploy ngay lập tức**

```bash
npm run deploy:now
```

## ⏰ **Deploy với delay tùy chỉnh**

```bash
# Deploy sau 2 giờ
node scripts/deploy-delayed.js 2

# Deploy sau 10 giờ
node scripts/deploy-delayed.js 10

# Deploy sau 30 phút (0.5 giờ)
node scripts/deploy-delayed.js 0.5
```

## 🔍 **Kiểm tra trước khi deploy**

```bash
npm run deploy:check
```

## 📋 **Các lệnh deploy có sẵn**

| Lệnh | Mô tả |
|------|-------|
| `npm run deploy:5h` | Deploy sau 5 giờ |
| `npm run deploy:now` | Deploy ngay lập tức |
| `npm run deploy:delayed` | Deploy với delay tùy chỉnh |
| `npm run deploy:check` | Kiểm tra có cần deploy không |
| `npm run deploy:preview` | Deploy preview |
| `npm run deploy:production` | Deploy production |

## ⚠️ **Lưu ý quan trọng**

1. **Vercel Free Plan**: Chỉ 100 deployments/ngày
2. **Chờ 5 giờ**: Nếu vượt quá giới hạn
3. **Kiểm tra trước**: Sử dụng `deploy:check` trước khi deploy
4. **Cancel**: Nhấn Ctrl+C để hủy deploy

## 🎯 **Khi nào nên deploy**

### ✅ **Deploy khi có thay đổi:**
- `pages/` - Trang mới
- `components/` - Component mới
- `stores/` - State management
- `server/` - API endpoints
- `composables/` - Logic tái sử dụng
- `utils/` - Utility functions
- `prisma/` - Database schema
- `nuxt.config.ts` - Cấu hình Nuxt
- `package.json` - Dependencies
- `vercel.json` - Cấu hình Vercel

### ❌ **Không deploy khi:**
- Chỉ thay đổi README
- Chỉ thay đổi documentation
- Chỉ thay đổi test files
- Chỉ thay đổi logs

## 🔧 **Troubleshooting**

### Lỗi "Resource is limited"
```bash
# Chờ 5 giờ rồi chạy lại
npm run deploy:5h
```

### Lỗi build
```bash
# Kiểm tra local trước
npm run build
npm run dev
```

### Lỗi Vercel
```bash
# Kiểm tra cấu hình
vercel --version
vercel login
```

## 📊 **Monitor deployments**

- **Logs**: `deployment-log.json`
- **Errors**: `deployment-error.json`
- **Vercel Dashboard**: https://vercel.com/dashboard
