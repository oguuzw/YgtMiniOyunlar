@echo off
echo ====================================
echo   YGT Mini Games - AI vs Real
echo   Sunucular Baslatiliyor...
echo ====================================
echo.

echo [1/2] Backend sunucusu baslatiliyor...
start "Backend Server" cmd /k "cd server && npm start"

timeout /t 2 /nobreak >nul

echo [2/2] Frontend sunucusu baslatiliyor...
start "Frontend Server" cmd /k "python -m http.server 8000"

timeout /t 3 /nobreak >nul

echo.
echo ====================================
echo   Sunucular Hazir!
echo ====================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:8000/docs/ai-vs-real.html
echo.
echo Tarayiciyi acmak icin bir tusa basin...
pause >nul

start http://localhost:8000/docs/ai-vs-real.html

echo.
echo Sunuculari durdurmak icin acilan terminal pencereleri kapatin.
