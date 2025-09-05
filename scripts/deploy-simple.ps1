# Script deploy don gian
Write-Host "🚀 Bat dau deploy game..." -ForegroundColor Green

# Kiem tra Node.js
Write-Host "📋 Kiem tra Node.js..." -ForegroundColor Yellow
node --version
npm --version

# Cai dat dependencies
Write-Host "📦 Cai dat dependencies..." -ForegroundColor Yellow
npm install

# Build ung dung
Write-Host "🔨 Building ung dung..." -ForegroundColor Yellow
npm run build

# Tao thu muc output
Write-Host "📁 Tao thu muc output..." -ForegroundColor Yellow
if (Test-Path "deploy") {
    Remove-Item -Recurse -Force "deploy"
}
New-Item -ItemType Directory -Path "deploy"

# Copy files
Write-Host "📋 Copy files..." -ForegroundColor Yellow
Copy-Item -Recurse ".output\*" "deploy\"
Copy-Item "package.json" "deploy\"
Copy-Item "package-lock.json" "deploy\"

# Tao file .htaccess
Write-Host "⚙️ Tao file .htaccess..." -ForegroundColor Yellow
$htaccess = @"
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
"@
$htaccess | Out-File -FilePath "deploy\.htaccess" -Encoding UTF8

Write-Host "✅ Deploy package da san sang trong thu muc 'deploy\'" -ForegroundColor Green
Write-Host "📋 Upload toan bo noi dung thu muc 'deploy' len public_html/tutien/ tren Cpanel" -ForegroundColor Cyan
Write-Host "🎉 Hoan tat!" -ForegroundColor Green
