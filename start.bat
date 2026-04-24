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

npm start

if errorlevel 1 (
    echo [SuperSaber] Exited with error code %errorlevel%.
    pause
)
endlocal
