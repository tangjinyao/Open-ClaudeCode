#!/bin/bash
while true; do
  OUTPUT=$(timeout 5 bun run run-cli.ts 2>&1)
  
  # Extract missing module path
  MISSING=$(echo "$OUTPUT" | grep -oP 'Cannot find module "[^"]+"' | head -1)
  
  if [ -z "$MISSING" ]; then
    echo "Done or error:"
    echo "$OUTPUT" | head -10
    break
  fi
  
  # Parse module path
  MODULE=$(echo "$MISSING" | sed 's/Cannot find module "//g;s/"//g')
  echo "Missing: $MODULE"
  
  # Check if it's a source file we can stub
  if [[ "$MODULE" == *.js ]]; then
    # Convert module path to file path
    # Handle relative paths like ./xxx or ../xxx
    if [[ "$MODULE" == @* ]]; then
      # npm package - skip
      echo "Skipping npm package: $MODULE"
      break
    fi
    
    # Extract just the path without extensions
    FILE_PATH=$(echo "$MODULE" | sed 's/\.js$//')
    mkdir -p "$(dirname "src/$FILE_PATH")"
    
    if [ ! -f "src/$FILE_PATH.ts" ] && [ ! -f "src/$FILE_PATH.tsx" ]; then
      echo "// Stub" > "src/$FILE_PATH.js"
      echo "Created stub: src/$FILE_PATH.js"
    else
      echo "File already exists as .ts/.tsx"
    fi
  else
    echo "Skipping: $MODULE"
    break
  fi
done
