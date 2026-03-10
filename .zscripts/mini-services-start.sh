#!/bin/sh

# Configuration item
DIST_DIR="./mini-services-dist"

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
            echo "   close process $pid ($service_name)..."
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
                echo "   Force terminate process $pid..."
                kill -KILL "$pid" 2>/dev/null
            fi
        fi
    done
    
    echo "✅ All services are closed. Goodbye!"
}

main() {
    echo "🚀 Starting all mini services..."

    # Check if the dist directory exists
    if [ ! -d "$DIST_DIR" ]; then
        echo "ℹ️ Directory $DIST_DIR does not exist"
        return
    fi
    
    # Find all mini-service-*.js files
    service_files=""
    for file in "$DIST_DIR"/mini-service-*.js; do
        if [ -f "$file" ]; then
            if [ -z "$service_files" ]; then
                service_files="$file"
            else
                service_files="$service_files $file"
            fi
        fi
    done
    
    # Calculate the number of service files
    service_count=0
    for file in $service_files; do
        service_count=$((service_count + 1))
    done
    
    if [ $service_count -eq 0 ]; then
        echo "ℹ️ No mini service files found"
        return
    fi
    
    echo "📦 Found $service_count services, starting them..."
    echo ""
    
    # Start each service
    for file in $service_files; do
        service_name=$(basename "$file" .js | sed 's/mini-service-//')
        echo "▶️ Start service: $service_name..."
        
        # Use bun to run the service (run in the background)
        bun "$file" &
        pid=$!
        if [ -z "$pids" ]; then
            pids="$pid"
        else
            pids="$pids $pid"
        fi
        
        # Wait a short while to check if the process started successfully.
        sleep 0.5
        if ! kill -0 "$pid" 2>/dev/null; then
            echo "❌ $service_name failed to start"
            # Remove the failed PID from the string
            pids=$(echo "$pids" | sed "s/\b$pid\b//" | sed 's/  */ /g' | sed 's/^ *//' | sed 's/ *$//')
        else
            echo "✅ $service_name Started (PID: $pid)"
        fi
    done
    
    # Calculate the number of services in operation
    running_count=0
    for pid in $pids; do
        if kill -0 "$pid" 2>/dev/null; then
            running_count=$((running_count + 1))
        fi
    done
    
    echo ""
    echo "🎉 All services are started! A total of $running_count services are running."
    echo ""
    echo "💡 Press Ctrl+C to stop all services"
    echo ""
    
    # Wait for all background processes
    wait
}

main

