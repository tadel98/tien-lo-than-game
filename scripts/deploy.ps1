# Script deploy lên Cpanel hosting cho Windows
# Sử dụng: .\scripts\deploy.ps1

Write-Host "🚀 Bắt đầu deploy game lên Cpanel..." -ForegroundColor Green

# Kiểm tra Node.js version
Write-Host "📋 Kiểm tra Node.js version..." -ForegroundColor Yellow
node --version
npm --version

# Cài đặt dependencies
Write-Host "📦 Cài đặt dependencies..." -ForegroundColor Yellow
npm install

# Build ứng dụng
Write-Host "🔨 Building ứng dụng..." -ForegroundColor Yellow
npm run build

# Tạo thư mục output
Write-Host "📁 Tạo thư mục output..." -ForegroundColor Yellow
if (Test-Path "deploy") {
    Remove-Item -Recurse -Force "deploy"
}
New-Item -ItemType Directory -Path "deploy"

# Copy files cần thiết
Write-Host "📋 Copy files..." -ForegroundColor Yellow
Copy-Item -Recurse ".output\*" "deploy\"
Copy-Item "package.json" "deploy\"
Copy-Item "package-lock.json" "deploy\"

# Kiểm tra file .env.production
if (Test-Path ".env.production") {
    Copy-Item ".env.production" "deploy\.env"
    Write-Host "✅ Đã copy file .env.production" -ForegroundColor Green
} else {
    Write-Host "⚠️  File .env.production không tồn tại, hãy tạo thủ công" -ForegroundColor Red
}

# Tạo file .htaccess
Write-Host "⚙️  Tạo file .htaccess..." -ForegroundColor Yellow
$htaccessContent = @"
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
"@

$htaccessContent | Out-File -FilePath "deploy\.htaccess" -Encoding UTF8

# Tạo file hướng dẫn upload
Write-Host "📝 Tạo file hướng dẫn upload..." -ForegroundColor Yellow

$instructionsContent = @"
HUONG DAN UPLOAD LEN CPANEL:

1. Upload toan bo noi dung thu muc nay len: public_html/tutien/

2. Tao file .env trong thu muc goc voi noi dung:
DATABASE_URL="mysql://etnuv26mwylj_tu_tien_game:in=]$MWVEMbkpEL)@localhost:3306/etnuv26mwylj_tu_tien_game"
NUXT_PUBLIC_BASE_URL=https://tutien.thesunsymphony.vn
NUXT_PUBLIC_API_BASE_URL=https://tutien.thesunsymphony.vn/api
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
NODE_ENV=production

3. SSH vao server hoac su dung Terminal trong Cpanel:
   cd public_html/tutien
   npm install --production

4. Khoi tao database:
   npx prisma db push
   node scripts/seed.js
   node scripts/create-combat-power-resource.js

5. Cau hinh Node.js App trong Cpanel:
   - Application Root: public_html/tutien
   - Application URL: tutien.thesunsymphony.vn
   - Application Startup File: server/index.mjs
   - Start ung dung

6. Kiem tra: https://tutien.thesunsymphony.vn
"@

$instructionsContent | Out-File -FilePath "deploy\UPLOAD_INSTRUCTIONS.txt" -Encoding UTF8

Write-Host "✅ Deploy package đã sẵn sàng trong thư mục 'deploy\'" -ForegroundColor Green
Write-Host "📋 Xem file UPLOAD_INSTRUCTIONS.txt để biết cách upload lên Cpanel" -ForegroundColor Cyan
Write-Host "🎉 Hoàn tất!" -ForegroundColor Green
