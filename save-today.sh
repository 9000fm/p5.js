#!/bin/bash
# Save today's sketch to archive with auto-incrementing index
TODAY=$(date +%Y%m%d)
FOLDER="archive"
mkdir -p "$FOLDER"

# Find next index
LAST=$(ls "$FOLDER"/${TODAY}-*.js 2>/dev/null | sort -V | tail -1 | grep -oP '\d+(?=\.js$)')
NEXT=$((${LAST:-0} + 1))

DEST="$FOLDER/${TODAY}-${NEXT}.js"
cp sketch.js "$DEST"
echo "✅ Saved as $DEST"
