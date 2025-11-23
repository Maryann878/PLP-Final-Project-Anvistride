#!/usr/bin/env node

/**
 * Development script that:
 * 1. Starts Docker containers (backend + MongoDB)
 * 2. Waits for backend to be ready
 * 3. Starts frontend dev server
 * 4. Handles cleanup on exit
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

let dockerComposeProcess = null;
let frontendProcess = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if Docker is running
async function checkDocker() {
  try {
    await execAsync('docker ps');
    return true;
  } catch (error) {
    return false;
  }
}

// Wait for backend to be healthy
async function waitForBackend(maxAttempts = 30, delay = 2000) {
  log('⏳ Waiting for backend to be ready...', 'yellow');
  
  const http = await import('http');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const ready = await new Promise((resolve) => {
        const req = http.get('http://localhost:5000/health', (res) => {
          resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(1000, () => {
          req.destroy();
          resolve(false);
        });
      });
      
      if (ready) {
        log('✅ Backend is ready!', 'green');
        return true;
      }
    } catch (error) {
      // Backend not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    process.stdout.write('.');
  }
  
  log('\n❌ Backend did not become ready in time', 'red');
  return false;
}

// Start Docker containers
async function startDocker() {
  log('🐳 Starting Docker containers...', 'blue');
  
  return new Promise((resolve, reject) => {
    dockerComposeProcess = spawn('docker', ['compose', 'up', '-d'], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
    });

    dockerComposeProcess.on('close', (code) => {
      if (code === 0) {
        log('✅ Docker containers started', 'green');
        resolve();
      } else {
        log(`❌ Docker compose failed with code ${code}`, 'red');
        reject(new Error(`Docker compose exited with code ${code}`));
      }
    });

    dockerComposeProcess.on('error', (error) => {
      log(`❌ Failed to start Docker: ${error.message}`, 'red');
      reject(error);
    });
  });
}

// Start frontend
function startFrontend() {
  log('🚀 Starting frontend dev server...', 'blue');
  
  frontendProcess = spawn('npm', ['run', 'dev', '-w', 'client'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  frontendProcess.on('error', (error) => {
    log(`❌ Failed to start frontend: ${error.message}`, 'red');
  });

  frontendProcess.on('close', async (code) => {
    if (code !== null && code !== 0 && code !== 130 && code !== 143) {
      // Code 130 = SIGINT (Ctrl+C), 143 = SIGTERM - these are expected
      log(`\nFrontend process exited with code ${code}`, 'yellow');
    }
    // Cleanup when frontend exits
    await cleanup();
  });
}

// Cleanup function
async function cleanup() {
  log('\n🛑 Shutting down...', 'yellow');
  
  if (frontendProcess && !frontendProcess.killed) {
    frontendProcess.kill('SIGTERM');
    // Give it a moment to clean up
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!frontendProcess.killed) {
      frontendProcess.kill('SIGKILL');
    }
  }
  
  // Always stop Docker containers
  log('🐳 Stopping Docker containers...', 'yellow');
  try {
    await execAsync('docker compose down', { cwd: rootDir });
    log('✅ Docker containers stopped', 'green');
  } catch (error) {
    log(`⚠️  Error stopping Docker: ${error.message}`, 'yellow');
  }
  
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (error) => {
  log(`❌ Uncaught exception: ${error.message}`, 'red');
  cleanup();
});

// Main function
async function main() {
  log('🎯 Starting development environment...', 'blue');
  log('   Backend: Docker (localhost:5000)', 'blue');
  log('   Frontend: Local (localhost:5173)', 'blue');
  log('');

  // Check Docker
  const dockerRunning = await checkDocker();
  if (!dockerRunning) {
    log('❌ Docker is not running. Please start Docker Desktop first.', 'red');
    process.exit(1);
  }

  try {
    // Start Docker containers
    await startDocker();
    
    // Wait for backend to be ready
    const backendReady = await waitForBackend();
    if (!backendReady) {
      log('\n❌ Backend failed to start. Check Docker logs.', 'red');
      await cleanup();
      process.exit(1);
    }
    
    log('');
    
    // Start frontend
    startFrontend();
    
    log('');
    log('✨ Development environment is ready!', 'green');
    log('   Frontend: http://localhost:5173', 'green');
    log('   Backend:  http://localhost:5000', 'green');
    log('');
    log('Press Ctrl+C to stop all services', 'yellow');
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    await cleanup();
    process.exit(1);
  }
}

main();

