# Cấu hình Environment Variables

## Tạo file .env cho Production

Tạo file `.env` trong thư mục gốc với nội dung sau:

```env
# Database
DATABASE_URL="mysql://etnuv26mwylj_tu_tien_game:in=]$MWVEMbkpEL)@localhost:3306/etnuv26mwylj_tu_tien_game"

# Nuxt
NUXT_PUBLIC_BASE_URL=https://tutien.thesunsymphony.vn
NUXT_PUBLIC_API_BASE_URL=https://tutien.thesunsymphony.vn/api

# JWT Secret (thay đổi thành secret mạnh)
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# Node Environment
NODE_ENV=production
```

## Lưu ý quan trọng:

1. **JWT_SECRET**: Thay đổi thành một chuỗi bí mật mạnh (ít nhất 32 ký tự)
2. **DATABASE_URL**: Kiểm tra thông tin database trên Cpanel
3. **URLs**: Đảm bảo URLs đúng với subdomain của bạn

## Cách tạo JWT Secret mạnh:

```bash
# Sử dụng Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Hoặc sử dụng OpenSSL
openssl rand -hex 32
```

## Kiểm tra cấu hình:

Sau khi tạo file .env, chạy lệnh sau để kiểm tra:

```bash
# Kiểm tra kết nối database
npx prisma db push

# Test build
npm run build
```
