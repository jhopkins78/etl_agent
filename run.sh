#!/bin/bash

# Navigate to the project root (etl_agent)
cd "$(dirname "$0")"

echo "🧠 Starting Backend..."
# Start the backend in a new Terminal tab (MacOS only)
osascript <<EOF
tell application "Terminal"
    do script "cd \"$(pwd)\" && source venv/bin/activate && flask run"
end tell
EOF

sleep 2

echo "🎨 Starting Frontend..."
# Start the frontend in a second Terminal tab
osascript <<EOF
tell application "Terminal"
    do script "cd \"$(pwd)/frontend\" && npm run dev"
end tell
EOF
