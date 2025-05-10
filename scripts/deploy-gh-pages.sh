#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Display commands being executed
set -x

# Build the project
bun run build

# Create .nojekyll file to bypass Jekyll processing
touch out/.nojekyll

# Check if the repository has a gh-pages branch
if git ls-remote --heads origin gh-pages | grep -q 'gh-pages'; then
  echo "Branch gh-pages already exists, updating it"
else
  echo "Creating gh-pages branch"
  git checkout --orphan gh-pages
  git reset --hard
  git commit --allow-empty -m "Initial gh-pages commit"
  git checkout main
fi

# Add the out directory to Git
git add out/ -f

# Commit the changes
git commit -m "Deploy to GitHub Pages"

# Push the subtree to the gh-pages branch
git subtree push --prefix out origin gh-pages

echo "Deployment complete! Your site should be available at https://yourusername.github.io/luca-portfolio/"
