#!/usr/bin/env node

import { exec, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🌬️  Wind App - Starting...');

// First run the scraper
console.log('📊 Running wind data scraper...');
exec('node --experimental-modules --es-module-specifier-resolution=node scrape_wind_puppeteer.js', { cwd: __dirname }, (error, stdout, stderr) => {
  if (error) {
    console.error('Error running scraper:', error);
    return;
  }
  
  console.log(stdout);
  
  if (stderr) {
    console.error(stderr);
  }
  
  console.log('✅ Wind data scraping complete!');
  console.log('📊 Note: Fetched 24 hours of data, visualization focused on 2am-7am window');
  console.log('🚀 Starting HTTP server...');
  
  // Start the HTTP server - try ports 8080, 8081, 8082 in sequence
  let port = 8080;
  const tryServer = () => {
    console.log(`Attempting to start server on port ${port}...`);
    const server = spawn('npx', ['http-server', '.', '-p', port.toString(), '--silent'], { 
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    server.on('error', (err) => {
      console.error(`Server error: ${err}`);
    });
    
    // Listen for port-in-use errors
    server.stderr.on('data', (data) => {
      const output = data.toString();
      console.error(`Server error: ${output}`);
      
      if (output.includes('EADDRINUSE') && port < 8083) {
        port++;
        console.log(`Port ${port-1} is in use, trying port ${port}...`);
        server.kill();
        tryServer();
      }
    });
    
    return server;
  };
  
  const server = tryServer();
  
  // Listen for the server to start
  server.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(output);
    
    // Look for the server started message
    if (output.includes('Available on:')) {
      // Extract the actual port from the output (in case it changed)
      let actualPort = port;
      const portMatch = output.match(/http:\/\/.*:(\d+)/);
      if (portMatch && portMatch[1]) {
        actualPort = portMatch[1];
      }
      const url = `http://localhost:${actualPort}/wind_visualization_dark_mode.html`;
      console.log(`🌐 Opening wind visualization at ${url}`);
      // Open the browser
      open(url);
    }
  });
  
  server.stderr.on('data', (data) => {
    console.error(`Server error: ${data}`);
  });
  
  console.log('💡 Press Ctrl+C to stop the server');
  
  // Handle termination
  process.on('SIGINT', () => {
    console.log('👋 Shutting down server...');
    server.kill();
    process.exit();
  });
});
