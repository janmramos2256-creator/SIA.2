@echo off
echo ========================================
echo SmartWash Laundry Management System
echo ========================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    echo This may take 5-10 minutes...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully!
    echo.
)

echo ========================================
echo Starting development server...
echo ========================================
echo.
echo The app will open at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev

pause
