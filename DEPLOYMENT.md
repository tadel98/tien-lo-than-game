# 🚀 Hướng dẫn Deploy

## ⚠️ Giới hạn Vercel Free Plan
- **100 deployments/ngày**
- **5 giờ chờ** nếu vượt quá giới hạn

## 🔧 Cách tối ưu hóa

### 1. **Kiểm tra trước khi deploy**
```bash
npm run deploy:check
```

### 2. **Chỉ deploy khi cần thiết**
- ✅ **Deploy khi có thay đổi**: pages, components, stores, server, composables, utils, prisma
- ❌ **Không deploy khi**: README, docs, test files, logs

### 3. **Sử dụng GitHub Actions**
- Tự động deploy khi push vào `main` branch
- Chỉ deploy khi có thay đổi quan trọng

### 4. **Manual Deploy**
```bash
# Preview
npm run deploy:preview

# Production
npm run deploy:production
```

## 📁 Files được ignore
- `.vercel/` - Vercel cache
- `node_modules/` - Dependencies
- `.nuxt/` - Nuxt build cache
- `*.log` - Log files
- `test/` - Test files
- `docs/` - Documentation
- `scripts/` - Build scripts

## 🎯 Best Practices
1. **Commit thường xuyên** nhưng **deploy ít**
2. **Test local** trước khi deploy
3. **Sử dụng preview** trước khi production
4. **Monitor** số lượng deployments

## ⏰ Khi gặp lỗi "Resource is limited"
1. **Chờ 5 giờ** để reset counter
2. **Kiểm tra** xem có deploy không cần thiết không
3. **Tối ưu hóa** code trước khi deploy
