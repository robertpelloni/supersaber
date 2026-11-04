@echo off
setlocal
title SuperSaber
cd /d "%~dp0"

echo [SuperSaber] Starting...
where npm >nul 2>nul
if errorlevel 1 (
    echo [SuperSaber] npm not found. Please install it.
    pause
    exit /b 1
)

echo [SuperSaber] Checking server & tray status...
python tray_control.py status

echo [SuperSaber] Starting multiplayer relay server (port 3001) in background...
start /b node relay_server.js

npm start

if errorlevel 1 (
    echo [SuperSaber] Exited with error code %errorlevel%.
    pause
)
endlocal
