#!/bin/bash


# Configuration items
ROOT_DIR="/home/z/my-project/mini-services"

main() {
    echo "🚀 Starting batch installation of dependencies..."
    
    # Check if rootdir exists
    if [ ! -d "$ROOT_DIR" ]; then
        echo "ℹ️ Directory $ROOT_DIR does not exist, skip installation"
        return
    fi
    
    # Statistical variables
    success_count=0
    fail_count=0
    failed_projects=""
    
    # Traverse all folders under the mini-services directory
    for dir in "$ROOT_DIR"/*; do
        # Check if it is a directory and contains package.json
        if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
            project_name=$(basename "$dir")
            echo ""
            echo "📦 Installing dependencies: $project_name..."
            
            # Enter the project directory and execute bun install
            if (cd "$dir" && bun install); then
                echo "✅ $project_name Dependencies installed successfully"
                success_count=$((success_count + 1))
            else
                echo "❌ $project_name Dependency installation failed."
                fail_count=$((fail_count + 1))
                if [ -z "$failed_projects" ]; then
                    failed_projects="$project_name"
                else
                    failed_projects="$failed_projects $project_name"
                fi
            fi
        fi
    done
    
    # Aggregate results
    echo ""
    echo "=================================================="
    if [ $success_count -gt 0 ] || [ $fail_count -gt 0 ]; then
        echo "🎉 Installation completed!"
        echo "✅ success: $success_count"
        if [ $fail_count -gt 0 ]; then
            echo "❌ fail: $fail_count"
            echo ""
            echo "Failed projects:"
            for project in $failed_projects; do
                echo "  - $project"
            done
        fi
    else
        echo "ℹ️ No projects containing package.json were found"
    fi
    echo "=================================================="
}

main

