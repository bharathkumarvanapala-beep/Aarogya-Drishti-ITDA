@echo off
title AAROGYA DRISHTI - Platform Launcher
echo ========================================================
echo        STARTING AAROGYA DRISHTI PLATFORM
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/2] Starting NestJS Backend on Port 4000...
start "Aarogya Drishti Backend [Port 4000]" cmd /k "cd backend && node dist/src/main.js"

echo [2/2] Starting Frontend Vite Server on Port 3000...
start "Aarogya Drishti Frontend [Port 3000]" cmd /k "npm run dev"

echo.
echo ========================================================
echo  All services launched in independent Windows terminals!
echo  Backend:  http://localhost:4000/api/v1
echo  Swagger:  http://localhost:4000/api/docs
echo  Frontend: http://localhost:3000/
echo.
echo  The web application will open in your default browser.
echo ========================================================
timeout /t 3 >nul
start http://localhost:3000/
exit

