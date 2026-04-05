#!/bin/bash
MISSING=$(timeout 5 bun run run-cli.ts 2>&1 | grep -oP "Cannot find package '\K[^']+" | head -1)
if [ -n "$MISSING" ]; then
  echo "Installing: $MISSING"
  bun add "$MISSING" 2>&1 | tail -2
else
  echo "No more missing packages"
fi
