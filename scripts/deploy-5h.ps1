# PowerShell script for 5-hour delayed deployment
Write-Host "🚀 Starting 5-hour delayed deployment..." -ForegroundColor Green
Write-Host "⏰ Will deploy after 5 hours" -ForegroundColor Yellow
Write-Host "🕐 Current time: $(Get-Date)" -ForegroundColor Cyan
Write-Host ""

Write-Host "⏳ Waiting 5 hours..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to cancel" -ForegroundColor Red
Write-Host ""

# Wait 5 hours (5 * 60 * 60 seconds)
Start-Sleep -Seconds 18000

Write-Host "⏰ 5 hours have passed!" -ForegroundColor Green
Write-Host "🔍 Checking if deployment is needed..." -ForegroundColor Yellow

# Run the deployment script
node scripts/deploy-now.js

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
