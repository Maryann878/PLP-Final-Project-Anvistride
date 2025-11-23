#!/usr/bin/env node

/**
 * Simple script to wait for backend to be ready
 */

import http from 'http';

const maxAttempts = 30;
const delay = 2000;
const url = 'http://localhost:5000/health';

(async () => {
for (let i = 0; i < maxAttempts; i++) {
  try {
    const ready = await new Promise((resolve) => {
      const req = http.get(url, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(1000, () => {
        req.destroy();
        resolve(false);
      });
    });
    
    if (ready) {
      console.log('✅ Backend is ready!');
      process.exit(0);
    }
  } catch (error) {
    // Backend not ready yet
  }
  
  await new Promise(resolve => setTimeout(resolve, delay));
  process.stdout.write('.');
}

console.log('\n❌ Backend did not become ready');
process.exit(1);
})();

