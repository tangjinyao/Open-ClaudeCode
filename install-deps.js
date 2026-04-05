const { execSync } = require('child_process');
const fs = require('fs');

let lastError = '';
let iterations = 0;
const maxIterations = 50;

while (iterations < maxIterations) {
  iterations++;
  try {
    const result = execSync('bun run run-cli.ts --version 2>&1', { encoding: 'utf8', timeout: 5000 });
    console.log('SUCCESS:', result);
    break;
  } catch (e) {
    const output = e.stdout || e.stderr || '';
    const match = output.match(/Cannot find module '([^']+)'/);
    if (match) {
      const moduleName = match[1].replace(/['"]/g, '');
      console.log(`Installing missing: ${moduleName}`);
      try {
        execSync(`npm install ${moduleName.includes('/') ? moduleName.split('/')[0] : moduleName}`, { 
          encoding: 'utf8', stdio: 'pipe' 
        });
      } catch (installErr) {
        // Try with full module name
        try {
          execSync(`npm install "${moduleName}"`, { 
            encoding: 'utf8', stdio: 'pipe' 
          });
        } catch (installErr2) {
          console.log(`Failed to install ${moduleName}: ${installErr2.message}`);
        }
      }
    } else if (output.includes('error:')) {
      console.log('Error:', output.substring(0, 200));
      break;
    } else {
      console.log('Unknown error');
      break;
    }
  }
}

console.log(`Completed in ${iterations} iterations`);
