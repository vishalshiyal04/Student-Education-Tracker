#!/bin/bash

# Configuration items
ROOT_DIR="/home/z/my-project/mini-services"
DIST_DIR="/tmp/build_fullstack_$BUILD_ID/mini-services-dist"

main() {
    echo "🚀 Start batch build..."

    # Check if rootdir exists
    if [ ! -d "$ROOT_DIR" ]; then
    echo "ℹ️ Directory $ROOT_DIR does not exist, skip build"
        return
    fi
    
    # Create the output directory (if it does not exist)
    mkdir -p "$DIST_DIR"
    
    # Statistical variables
    success_count=0
    fail_count=0
    
    # Traverse all folders under the mini-services directory
    for dir in "$ROOT_DIR"/*; do
        # Check if it is a directory and contains package.json
        if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
            project_name=$(basename "$dir")
            
            # Intelligent search for entry files (search by priority)
            entry_path=""
            for entry in "src/index.ts" "index.ts" "src/index.js" "index.js"; do
                if [ -f "$dir/$entry" ]; then
                    entry_path="$dir/$entry"
                    break
                fi
            done
            
            if [ -z "$entry_path" ]; then
                echo "⚠️ Skip $project_name: Entry file (index.ts/js) not found"
                continue
            fi
            
            echo ""
            echo "📦 Building: $project_name..."
            
            # Build using the bun build CLI
            output_file="$DIST_DIR/mini-service-$project_name.js"
            
            if bun build "$entry_path" \
                --outfile "$output_file" \
                --target bun \
                --minify; then
                echo "✅ $project_name build successful -> $output_file"
                success_count=$((success_count + 1))
            else
                echo "❌ $project_name build failed"
                fail_count=$((fail_count + 1))
            fi
        fi
    done
    
    if [ -f ./.zscripts/mini-services-start.sh ]; then
        cp ./.zscripts/mini-services-start.sh "$DIST_DIR/mini-services-start.sh"
        chmod +x "$DIST_DIR/mini-services-start.sh"
    fi
    
    echo ""
    echo "🎉 All tasks completed!"
    if [ $success_count -gt 0 ] || [ $fail_count -gt 0 ]; then
        echo "✅ Success: $success_count"
        if [ $fail_count -gt 0 ]; then
            echo "❌ Failures: $fail_count"
        fi
    fi
}

main

