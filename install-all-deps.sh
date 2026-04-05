#!/bin/bash
while true; do
  OUTPUT=$(timeout 5 bun run run-cli.ts 2>&1)
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -eq 0 ]; then
    echo "SUCCESS"
    echo "$OUTPUT"
    break
  fi
  
  # Extract missing package name
  MISSING=$(echo "$OUTPUT" | grep -oP "Cannot find package '\K[^']+" | head -1)
  
  if [ -z "$MISSING" ]; then
    echo "Unknown error or no more missing packages:"
    echo "$OUTPUT" | head -20
    break
  fi
  
  echo "Installing: $MISSING"
  npm install "$MISSING" 2>&1 | tail -2
done
