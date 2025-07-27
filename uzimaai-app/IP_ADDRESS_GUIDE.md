# IP Address Management Guide

## Problem
When your computer's IP address changes (which can happen when you reconnect to WiFi or restart your router), the app can't connect to the API server because it's hardcoded to use a specific IP address.

## Solution

### Option 1: Automatic IP Update (Recommended)
Run the IP update script:
```bash
cd uzimaai-app
node update-ip.js
```

This script will:
- Automatically detect your current IP address
- Update the API configuration file
- Show you the new IP address

### Option 2: Manual Update
1. Find your current IP address:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
   ```

2. Update `constants/api.ts`:
   - Change the `API_BASE_URL` to use your new IP
   - Update the comment with the new IP and date
   - Update the first fallback URL

### Option 3: Use localhost (Development Only)
If you're testing on the same computer, you can temporarily use:
```typescript
export const API_BASE_URL = 'http://localhost/uzimaai/api/endpoints';
```

## Troubleshooting

### Login Still Fails?
1. **Check XAMPP**: Make sure Apache and MySQL are running
2. **Test API**: Try accessing `http://YOUR_IP/uzimaai/api/endpoints/login.php` in your browser
3. **Check Network**: Ensure your phone/device is on the same WiFi network
4. **Firewall**: Make sure your firewall allows connections on port 80

### Common Error Messages
- "Cannot connect to server" → IP address issue or XAMPP not running
- "Invalid credentials" → Username/password issue (API is working)
- "Missing required fields" → Form validation issue

## Current Configuration
- **API Base URL**: `http://192.168.8.108/uzimaai/api/endpoints`
- **Last Updated**: 2025-07-27
- **Fallback URLs**: Configured for previous IP and localhost

## Quick Commands
```bash
# Check current IP
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1

# Test API connection
curl -I http://YOUR_IP/uzimaai/api/endpoints/login.php

# Update IP automatically
node update-ip.js
``` 