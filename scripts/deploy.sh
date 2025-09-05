#!/bin/bash

# Script deploy lên Cpanel hosting
# Sử dụng: ./scripts/deploy.sh

echo "🚀 Bắt đầu deploy game lên Cpanel..."

# Kiểm tra Node.js version
echo "📋 Kiểm tra Node.js version..."
node --version
npm --version

# Cài đặt dependencies
echo "📦 Cài đặt dependencies..."
npm install

# Build ứng dụng
echo "🔨 Building ứng dụng..."
npm run build

# Tạo thư mục output
echo "📁 Tạo thư mục output..."
mkdir -p deploy

# Copy files cần thiết
echo "📋 Copy files..."
cp -r .output/* deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp .env.production deploy/.env 2>/dev/null || echo "⚠️  File .env.production không tồn tại, hãy tạo thủ công"

# Tạo file .htaccess
echo "⚙️  Tạo file .htaccess..."
cat > deploy/.htaccess << 'EOF'
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
EOF

# Tạo file hướng dẫn upload
echo "📝 Tạo file hướng dẫn upload..."
cat > deploy/UPLOAD_INSTRUCTIONS.txt << 'EOF'
HƯỚNG DẪN UPLOAD LÊN CPANEL:

1. Upload toàn bộ nội dung thư mục này lên: public_html/tutien/

2. Tạo file .env trong thư mục gốc với nội dung:
DATABASE_URL="mysql://etnuv26mwylj_tu_tien_game:in=]$MWVEMbkpEL)@localhost:3306/etnuv26mwylj_tu_tien_game"
NUXT_PUBLIC_BASE_URL=https://tutien.thesunsymphony.vn
NUXT_PUBLIC_API_BASE_URL=https://tutien.thesunsymphony.vn/api
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
NODE_ENV=production

3. SSH vào server hoặc sử dụng Terminal trong Cpanel:
   cd public_html/tutien
   npm install --production

4. Khởi tạo database:
   npx prisma db push
   node scripts/seed.js
   node scripts/create-combat-power-resource.js

5. Cấu hình Node.js App trong Cpanel:
   - Application Root: public_html/tutien
   - Application URL: tutien.thesunsymphony.vn
   - Application Startup File: server/index.mjs
   - Start ứng dụng

6. Kiểm tra: https://tutien.thesunsymphony.vn
EOF

echo "✅ Deploy package đã sẵn sàng trong thư mục 'deploy/'"
echo "📋 Xem file UPLOAD_INSTRUCTIONS.txt để biết cách upload lên Cpanel"
echo "🎉 Hoàn tất!"
