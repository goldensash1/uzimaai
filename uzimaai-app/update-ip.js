#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get current IP address
const { execSync } = require('child_process');

function getCurrentIP() {
  try {
    // For macOS/Linux
    const ip = execSync("ifconfig | grep 'inet ' | grep -v 127.0.0.1 | awk '{print $2}' | head -1", { encoding: 'utf8' }).trim();
    return ip;
  } catch (error) {
    console.error('Could not determine IP address automatically');
    return null;
  }
}

function updateAPIConfig(newIP) {
  const apiConfigPath = path.join(__dirname, 'constants', 'api.ts');
  
  if (!fs.existsSync(apiConfigPath)) {
    console.error('API config file not found');
    return false;
  }

  let content = fs.readFileSync(apiConfigPath, 'utf8');
  
  // Update the main API_BASE_URL
  content = content.replace(
    /export const API_BASE_URL = 'http:\/\/[^']+'/,
    `export const API_BASE_URL = 'http://${newIP}/uzimaai/api/endpoints'`
  );
  
  // Update the fallback URLs
  content = content.replace(
    /'http:\/\/[^']+\/uzimaai\/api\/endpoints', \/\/ Current IP/,
    `'http://${newIP}/uzimaai/api/endpoints', // Current IP`
  );
  
  // Update the comment
  content = content.replace(
    /\/\/ Current IP: [^)]+\)/,
    `// Current IP: ${newIP} (updated on ${new Date().toISOString().split('T')[0]})`
  );
  
  fs.writeFileSync(apiConfigPath, content);
  return true;
}

// Main execution
const currentIP = getCurrentIP();

if (currentIP) {
  console.log(`Current IP address: ${currentIP}`);
  
  if (updateAPIConfig(currentIP)) {
    console.log('✅ API configuration updated successfully!');
    console.log(`📱 Your app should now work with IP: ${currentIP}`);
  } else {
    console.log('❌ Failed to update API configuration');
  }
} else {
  console.log('❌ Could not determine IP address');
  console.log('Please manually update the IP address in constants/api.ts');
} 