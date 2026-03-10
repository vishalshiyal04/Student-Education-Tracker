#!/bin/sh

set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$SCRIPT_DIR"

# Store the PIDs of all child processes
pids=""

# Cleanup function: Gracefully shut down all services
cleanup() {
    echo ""
    echo "🛑 Shutting down all services..."
    
    # Send SIGTERM signal to all child processes
    for pid in $pids; do
        if kill -0 "$pid" 2>/dev/null; then
            service_name=$(ps -p "$pid" -o comm= 2>/dev/null || echo "unknown")
            echo "close process $pid ($service_name)..."
            kill -TERM "$pid" 2>/dev/null
        fi
    done
    
    # Wait for all processes to exit (maximum 5 seconds)
    sleep 1
    for pid in $pids; do
        if kill -0 "$pid" 2>/dev/null; then
            # If it's still running, wait a maximum of 4 seconds.
            timeout=4
            while [ $timeout -gt 0 ] && kill -0 "$pid" 2>/dev/null; do
                sleep 1
                timeout=$((timeout - 1))
            done
            # If it is still running, force shutdown
            if kill -0 "$pid" 2>/dev/null; then
                echo "force close process $pid..."
                kill -KILL "$pid" 2>/dev/null
            fi
        fi
    done
    
    echo "✅ All services are closed"
    exit 0
}

echo "🚀 Starting all services..."
echo ""

# Switch to the build director
cd "$BUILD_DIR" || exit 1

ls -lah

# Initialize the database (if it exists)
if [ -d "./next-service-dist/db" ] && [ "$(ls -A ./next-service-dist/db 2>/dev/null)" ] && [ -d "/db" ]; then
    echo "🗄️ Initializing the database from ./next-service-dist/db to /db..."
    cp -r ./next-service-dist/db/* /db/ 2>/dev/null || echo "⚠️ Unable to copy to /db, skipping database initialization"
    echo "✅ Database initialization complete"
fi

# Start the Next.js server
if [ -f "./next-service-dist/server.js" ]; then
    echo "🚀 Starting the Next.js server..."
    cd next-service-dist/ || exit 1
    
    # Set environment variabl
    export NODE_ENV=production
    export PORT=${PORT:-3000}
    export HOSTNAME=${HOSTNAME:-0.0.0.0}
    
    # Start in background Next.js
    bun server.js &
    NEXT_PID=$!
    pids="$NEXT_PID"
    
    # Wait a short while to check if the process started successfully
    sleep 1
    if ! kill -0 "$NEXT_PID" 2>/dev/null; then
        echo "❌ Next.js server failed to start"
        exit 1
    else
        echo "✅ Next.js Server started (PID: $NEXT_PID, Port: $PORT)"
    fi
    
    cd ../
else
    echo "⚠️ No Next.js server file found: ./next-service-dist/server.js"
fi

# Start mini-services
if [ -f "./mini-services-start.sh" ]; then
    echo "🚀 Start mini-services..."

    # Run the startup script (run from the root directory; the script will process the mini-services-dist directory internally)
    sh ./mini-services-start.sh &
    MINI_PID=$!
    pids="$pids $MINI_PID"
    
    #Wait a short while to check if the process started successfully.
    sleep 1
    if ! kill -0 "$MINI_PID" 2>/dev/null; then
        echo "⚠️ mini-services may fail to start, but continue running..."
    else
        echo "✅ mini-services started (PID: $MINI_PID)"
    fi
elif [ -d "./mini-services-dist" ]; then
    echo "⚠️ Mini-services startup script not found, but the directory exists"
else
    echo "ℹ️ mini-services directory does not exist, skipping"
fi

# Start Caddy (if Caddyfile exists)
echo "🚀 Start Caddy..."

# Caddy running as a foreground process (main process)
echo "✅ Caddy is started (running in the foreground)"
echo ""
echo "🎉 All services are started!"
echo ""
echo "💡 Press Ctrl+C to stop all services"
echo ""

# Caddy running as the main process
exec caddy run --config Caddyfile --adapter caddyfile