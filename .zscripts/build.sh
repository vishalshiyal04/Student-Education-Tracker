#!/bin/bash

# Redirect stderr to stdout to prevent execute_command from throwing errors due to stderr output.
exec 2>&1

set -e

# Get the directory where the script is located (the .zscripts directory, i.e., workspace-agent/.zscripts)
# Use $0 to get the script path (compatible with sh and bash)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Next.js project path
NEXTJS_PROJECT_DIR="/home/z/my-project"

# Check if the Next.js project directory exists
if [ ! -d "$NEXTJS_PROJECT_DIR" ]; then
    echo "❌ Error: Next.js project directory does not exist: $NEXTJS_PROJECT_DIR"
    exit 1
fi

echo "🚀 Starting to build the Next.js application and mini-services..."
echo "📁 Next.js project path: $NEXTJS_PROJECT_DIR"

# Switch to the Next.js project directory
cd "$NEXTJS_PROJECT_DIR" || exit 1

# Set environment variables
export NEXT_TELEMETRY_DISABLED=1

BUILD_DIR="/tmp/build_fullstack_$BUILD_ID"
echo "📁 Clean up and create the build directory: $BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Install dependencies
echo "📦 Install dependencies..."
bun install

# Building a Next.js application
echo "🔨 Building a Next.js application..."
bun run build

# Build mini-services
# Check if the mini-services directory exists in the Next.js project directory
if [ -d "$NEXTJS_PROJECT_DIR/mini-services" ]; then
    echo "🔨 Building mini-services..."
    # Using the mini-services script in the workspace-agent directory
    sh "$SCRIPT_DIR/mini-services-install.sh"
    sh "$SCRIPT_DIR/mini-services-build.sh"

    # Copy mini-services-start.sh to the mini-services-dist directory
    echo " - Copy mini-services-start.sh to $BUILD_DIR"
    cp "$SCRIPT_DIR/mini-services-start.sh" "$BUILD_DIR/mini-services-start.sh"
    chmod +x "$BUILD_DIR/mini-services-start.sh"
else
    echo "ℹ️ mini-services directory does not exist, skipping"
fi

# Copy all build artifacts to the temporary build directory
echo "📦 Collect build artifacts to $BUILD_DIR..."

# Copy Next.js standalone build output
if [ -d ".next/standalone" ]; then
    echo "  - copy .next/standalone"
    cp -r .next/standalone "$BUILD_DIR/next-service-dist/"
fi

# Copy Next.js static fil
if [ -d ".next/static" ]; then
    echo "  - Copy  .next/static"
    mkdir -p "$BUILD_DIR/next-service-dist/.next"
    cp -r .next/static "$BUILD_DIR/next-service-dist/.next/"
fi

# Copy public director
if [ -d "public" ]; then
    echo " - Copy public"
    cp -r public "$BUILD_DIR/next-service-dist/"
fi

# Finally, migrate the database to BUILD_DIR/db
if [ "$(ls -A ./db 2>/dev/null)" ]; then
    echo "🗄️ Database file detected, running database migration..."
    DATABASE_URL=file:$BUILD_DIR/db/custom.db bun run db:push
    echo "✅ Database migration complete"
    ls -lah $BUILD_DIR/db
else
    echo "ℹ️ db directory is empty, skip database migration"
fi

# Copy Caddyfile (if it exists)
if [ -f "Caddyfile" ]; then
    echo " - copy Caddyfile"
    cp Caddyfile "$BUILD_DIR/"
else
echo "ℹ️ Caddyfile does not exist, skip"
fi

# Copy the start.sh script
echo "  - Copy start.sh to $BUILD_DIR"
cp "$SCRIPT_DIR/start.sh" "$BUILD_DIR/start.sh"
chmod +x "$BUILD_DIR/start.sh"

# 打包到 $BUILD_DIR.tar.gz
PACKAGE_FILE="${BUILD_DIR}.tar.gz"
echo ""
echo "📦 Package build artifacts to $PACKAGE_FILE..."
cd "$BUILD_DIR" || exit 1
tar -czf "$PACKAGE_FILE" .
cd - > /dev/null || exit 1

# # Clean up temporary directories
# rm -rf "$BUILD_DIR"

echo ""
echo "✅ Build complete! All artifacts have been packaged. $PACKAGE_FILE"
echo "📊 Package file size:"
ls -lh "$PACKAGE_FILE"
