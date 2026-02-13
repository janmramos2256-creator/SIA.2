#!/bin/bash

echo "========================================"
echo "SmartWash Laundry Management System"
echo "========================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "[ERROR] Node.js is not installed!"
    echo "Please download and install Node.js from: https://nodejs.org/"
    echo ""
    exit 1
fi

echo "[OK] Node.js found:"
node --version
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    echo "This may take 5-10 minutes..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies!"
        exit 1
    fi
    echo ""
    echo "[OK] Dependencies installed successfully!"
    echo ""
fi

echo "========================================"
echo "Starting development server..."
echo "========================================"
echo ""
echo "The app will open at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

npm run dev
