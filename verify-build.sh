#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🔍 Verifying build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out

# Build the project
echo "🏗️ Building the project..."
bun run build

# Verify output directory exists
if [ -d "out" ]; then
  echo "✅ Build directory 'out' exists."
else
  echo "❌ Build failed! Directory 'out' not found."
  exit 1
fi

# Verify index.html exists
if [ -f "out/index.html" ]; then
  echo "✅ index.html exists."
else
  echo "❌ Build incomplete! index.html not found."
  exit 1
fi

# Check for common asset directories
if [ -d "out/_next" ]; then
  echo "✅ Assets directory '_next' exists."
else
  echo "⚠️ Warning: Assets directory '_next' not found."
fi

echo "🎉 Build verification completed successfully!"
echo "📋 You can now:"
echo "  - Run 'bun run start' to serve the static files locally"
echo "  - Run './deploy-gh-pages.sh' to deploy to GitHub Pages"
echo "  - Deploy manually to Netlify or other hosting services"
