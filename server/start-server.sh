#!/bin/bash

echo "🚀 Starting CampusCore Backend Server..."
echo ""

# Kill any process using port 5000
echo "1️⃣ Checking port 5000..."
PORT_PID=$(lsof -ti:5000)
if [ ! -z "$PORT_PID" ]; then
    echo "   Killing process $PORT_PID using port 5000..."
    kill -9 $PORT_PID 2>/dev/null
    sleep 1
fi

# Change to server directory
cd "$(dirname "$0")"

echo "2️⃣ Starting server..."
echo ""

# Use node directly instead of nodemon to avoid permission issues
export NODE_ENV=development
node server.js
