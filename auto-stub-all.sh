#!/bin/bash
count=0
while true; do
  count=$((count + 1))
  if [ $count -gt 200 ]; then
    echo "Too many iterations, stopping"
    break
  fi
  
  ERROR_LINE=$(timeout 5 bun run ./run-cli.ts 2>&1 | grep "Cannot find")
  
  if [ -z "$ERROR_LINE" ]; then
    echo "No more missing modules"
    break
  fi
  
  MODULE=$(echo "$ERROR_LINE" | sed "s/error: Cannot find module '//;s/' from.*//")
  echo "Missing: $MODULE (count: $count)"
  
  # Create directory and stub file
  DIR=$(dirname "$MODULE")
  mkdir -p "src/$DIR"
  
  if [[ "$MODULE" == *.md ]]; then
    echo "# Stub" > "src/$MODULE"
    echo "  Created: src/$MODULE"
  elif [[ "$MODULE" == *.js ]]; then
    echo "// Stub" > "src/$MODULE"
    echo "  Created: src/$MODULE"
  elif [[ "$MODULE" == *.ts ]]; then
    echo "// Stub" > "src/$MODULE"
    echo "  Created: src/$MODULE"
  elif [[ "$MODULE" == *.tsx ]]; then
    echo "// Stub" > "src/$MODULE"
    echo "  Created: src/$MODULE"
  else
    echo "  Skipping: $MODULE"
    break
  fi
done
echo "Completed $count iterations"
