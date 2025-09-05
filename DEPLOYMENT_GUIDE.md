# Hướng dẫn Deploy Game lên Cpanel

## Thông tin Hosting
- **Subdomain**: tutien.thesunsymphony.vn
- **Database**: etnuv26mwylj_tu_tien_game
- **Username**: etnuv26mwylj_tu_tien_game
- **Password**: in=]$MWVEMbkpEL)

## Bước 1: Chuẩn bị Database MySQL

1. Đăng nhập Cpanel
2. Vào **MySQL Databases**
3. Tạo database: `etnuv26mwylj_tu_tien_game`
4. Tạo user: `etnuv26mwylj_tu_tien_game` với password: `in=]$MWVEMbkpEL)`
5. Cấp quyền cho user truy cập database

## Bước 2: Cập nhật cấu hình

### 2.1. Tạo file .env trong thư mục gốc:
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

### 2.2. Cập nhật nuxt.config.ts:
```typescript
export default defineNuxtConfig({
  // ... existing config
  nitro: {
    preset: 'node-server'
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    databaseUrl: process.env.DATABASE_URL,
    
    // Public keys (exposed to client-side)
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
    }
  }
})
```

## Bước 3: Build và Deploy

### 3.1. Build ứng dụng:
```bash
# Cài đặt dependencies
npm install

# Build cho production
npm run build

# Tạo file .output
npm run generate
```

### 3.2. Upload lên hosting:
1. Upload toàn bộ thư mục `.output` lên thư mục `public_html/tutien` trên Cpanel
2. Upload file `.env` vào thư mục gốc của ứng dụng
3. Upload file `package.json` và `package-lock.json`

### 3.3. Cài đặt dependencies trên server:
```bash
# SSH vào server hoặc sử dụng Terminal trong Cpanel
cd public_html/tutien
npm install --production
```

## Bước 4: Khởi tạo Database

### 4.1. Chạy migration:
```bash
# Tạo tables trong MySQL
npx prisma db push

# Hoặc chạy migration
npx prisma migrate deploy
```

### 4.2. Seed dữ liệu:
```bash
# Chạy script seed
node scripts/seed.js

# Tạo resource sức mạnh chiến đấu
node scripts/create-combat-power-resource.js
```

## Bước 5: Cấu hình Web Server

### 5.1. Tạo file .htaccess trong thư mục public_html/tutien:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

### 5.2. Cấu hình Node.js App trong Cpanel:
1. Vào **Node.js Selector** trong Cpanel
2. Chọn Node.js version (khuyến nghị 18.x hoặc 20.x)
3. Set **Application Root**: `public_html/tutien`
4. Set **Application URL**: `tutien.thesunsymphony.vn`
5. Set **Application Startup File**: `server/index.mjs`
6. **Start** ứng dụng

## Bước 6: Kiểm tra và Test

### 6.1. Kiểm tra ứng dụng:
- Truy cập: https://tutien.thesunsymphony.vn
- Kiểm tra API: https://tutien.thesunsymphony.vn/api/ranking/top-players

### 6.2. Kiểm tra database:
- Đăng nhập và tạo tài khoản mới
- Kiểm tra bảng xếp hạng có hoạt động không

## Bước 7: Cấu hình SSL và Domain

### 7.1. Cấu hình SSL:
1. Vào **SSL/TLS** trong Cpanel
2. Bật **Force HTTPS Redirect**
3. Cài đặt SSL certificate (Let's Encrypt hoặc Comodo)

### 7.2. Cấu hình Subdomain:
1. Vào **Subdomains** trong Cpanel
2. Tạo subdomain: `tutien` trỏ đến `public_html/tutien`

## Troubleshooting

### Lỗi thường gặp:

1. **Database connection error**:
   - Kiểm tra thông tin database trong .env
   - Kiểm tra user có quyền truy cập database

2. **Module not found**:
   - Chạy `npm install --production` trên server
   - Kiểm tra Node.js version

3. **404 error**:
   - Kiểm tra .htaccess file
   - Kiểm tra cấu hình Node.js App

4. **CORS error**:
   - Kiểm tra NUXT_PUBLIC_BASE_URL trong .env
   - Cập nhật CORS settings trong nuxt.config.ts

## Monitoring và Maintenance

### 7.1. Logs:
- Kiểm tra logs trong Cpanel Node.js App
- Monitor error logs trong Cpanel

### 7.2. Backup:
- Backup database định kỳ
- Backup source code

### 7.3. Updates:
- Cập nhật dependencies định kỳ
- Monitor security updates

## Lưu ý quan trọng:

1. **Bảo mật**: Thay đổi JWT_SECRET thành giá trị mạnh
2. **Performance**: Enable caching và compression
3. **Monitoring**: Theo dõi logs và performance
4. **Backup**: Backup database và code định kỳ
