@echo off
echo 🚀 Starting 5-hour delayed deployment...
echo ⏰ Will deploy after 5 hours
echo 🕐 Current time: %date% %time%
echo.

echo ⏳ Waiting 5 hours...
echo Press Ctrl+C to cancel

timeout /t 18000 /nobreak >nul

echo ⏰ 5 hours have passed!
echo 🔍 Checking if deployment is needed...

node scripts/deploy-now.js

pause
