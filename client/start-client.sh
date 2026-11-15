#!/bin/bash

echo "🎨 Starting CampusCore Frontend..."
echo ""

# Change to client directory
cd "$(dirname "$0")"

echo "1️⃣ Fixing permissions..."
# Fix vite permissions
if [ -f "node_modules/.bin/vite" ]; then
    chmod +x node_modules/.bin/vite
fi

echo "2️⃣ Starting Vite dev server..."
echo ""

# Use npx to run vite directly
npx vite
