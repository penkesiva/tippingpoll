#!/bin/bash

# TippingPoll - Local Development Server
# This script starts a local server on port 3000

echo "🚀 Starting TippingPoll local server..."
echo "📍 Port: 3000"
echo "🌐 URL: http://localhost:3000"
echo ""

# Check if port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3000 is already in use!"
    echo "💡 Please stop the existing service or use a different port."
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down server..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
    fi
    echo "✅ Server stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Try different server options in order of preference
echo "🔍 Starting server..."

# Option 1: Python 3 (most common)
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python 3 server..."
    python3 -m http.server 3000 &
    SERVER_PID=$!
    echo "✅ Python server started with PID: $SERVER_PID"
    
# Option 2: Python 2
elif command -v python &> /dev/null; then
    echo "🐍 Using Python 2 server..."
    python -m SimpleHTTPServer 3000 &
    SERVER_PID=$!
    echo "✅ Python server started with PID: $SERVER_PID"
    
# Option 3: Node.js (npx serve)
elif command -v npx &> /dev/null; then
    echo "🟢 Using Node.js serve..."
    npx serve . -p 3000 &
    SERVER_PID=$!
    echo "✅ Node.js server started with PID: $SERVER_PID"
    
# Option 4: PHP
elif command -v php &> /dev/null; then
    echo "🐘 Using PHP server..."
    php -S localhost:3000 &
    SERVER_PID=$!
    echo "✅ PHP server started with PID: $SERVER_PID"
    
# Option 5: Ruby
elif command -v ruby &> /dev/null; then
    echo "💎 Using Ruby server..."
    ruby -run -e httpd . -p 3000 &
    SERVER_PID=$!
    echo "✅ Ruby server started with PID: $SERVER_PID"
    
else
    echo "❌ No suitable server found!"
    echo ""
    echo "💡 Please install one of the following:"
    echo "   - Python 3: brew install python3 (macOS) or apt-get install python3 (Ubuntu)"
    echo "   - Node.js: brew install node (macOS) or apt-get install nodejs (Ubuntu)"
    echo "   - PHP: brew install php (macOS) or apt-get install php (Ubuntu)"
    echo ""
    echo "🔧 Or manually start a server:"
    echo "   - Python: python3 -m http.server 3000"
    echo "   - Node.js: npx serve . -p 3000"
    echo "   - PHP: php -S localhost:3000"
    exit 1
fi

echo ""
echo "🎉 TippingPoll is now running!"
echo "📱 Open your browser and go to: http://localhost:3000"
echo "🔄 The page will automatically reload when you make changes"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Wait for server to start
sleep 2

# Check if server is running
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Failed to start server on port 3000"
    exit 1
fi

# Open browser automatically (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 Opening browser automatically..."
    open http://localhost:3000
fi

# Keep script running and show server status
echo "📊 Server Status: RUNNING on port 3000"
echo "📁 Serving files from: $(pwd)"
echo ""

# Wait for user to stop the server
wait $SERVER_PID
