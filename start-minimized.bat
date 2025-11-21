@echo off
cd /d C:\Users\oguuz\OneDrive\Desktop\YGT\ygt-mini-games
start /min cmd /c "cd server && npm start"
timeout /t 2 /nobreak >nul
start /min cmd /c "python -m http.server 8000"
