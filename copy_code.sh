#!/bin/bash

find . \
  -type d \( -name node_modules -o -name .git -o -name dist -o -name build \) -prune -false \
  -o -type f \
  -print | sort | while read -r file; do
    echo "===== FILE: $file ====="
    cat "$file"
    echo -e "\n"
done | xclip -selection clipboard

echo "✅ Project code copied to clipboard"
