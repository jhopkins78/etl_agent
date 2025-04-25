#!/bin/bash

set -e

ARCHIVE_DIR="__archive__"
mkdir -p "$ARCHIVE_DIR"

echo "Archiving .DS_Store files..."
find . -name ".DS_Store" -exec mv {} "$ARCHIVE_DIR"/ \;

echo "Archiving legacy and sample files/folders..."
# Move App.js and App.test.tsx if they exist
if [ -f frontend/src/App.js ]; then
  mv frontend/src/App.js "$ARCHIVE_DIR"/
fi
if [ -f frontend/src/App.test.tsx ]; then
  mv frontend/src/App.test.tsx "$ARCHIVE_DIR"/
fi

# Move dashboard-source/
if [ -d dashboard-source ]; then
  mv dashboard-source "$ARCHIVE_DIR"/
fi

# Move sample/mock data folders if they exist
for folder in abalone data_copy enriched; do
  if [ -d "$folder" ]; then
    mv "$folder" "$ARCHIVE_DIR"/
  fi
done

echo "Identifying unused components in frontend/src/components/ (manual review required)..."
echo "To archive unused components, move them manually to $ARCHIVE_DIR after review."

echo "Restructuring frontend/src/..."
# Ensure required folders exist
for dir in components context pages utils styles; do
  mkdir -p frontend/src/$dir
done

echo "Cleanup complete. Please review $ARCHIVE_DIR before permanent deletion."
echo "Run 'npm run build' in frontend/ to verify the build after cleanup."
