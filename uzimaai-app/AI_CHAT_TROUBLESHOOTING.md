# AI Chat Troubleshooting Guide

## Problem
The AI chat is not responding or showing errors.

## Solutions

### 1. Check AI Service Status
Test if the AI service is working:
```bash
curl "http://192.168.8.108/uzimaai/api/endpoints/ai_status.php"
```

Expected response:
```json
{
  "success": true,
  "status": {
    "ai_service": "online",
    "database": "connected", 
    "api_key": "configured",
    "timestamp": "2025-07-27 07:17:17"
  }
}
```

### 2. Test AI Chat Directly
Test the AI chat endpoint:
```bash
curl -X POST http://192.168.8.108/uzimaai/api/endpoints/ai_chat.php \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","userid":1,"type":"chat"}'
```

### 3. Check Database Tables
Verify the chat history table exists:
```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "DESCRIBE uzimaaidb.chatHistory;"
```

### 4. Common Issues & Fixes

#### Issue: "Cannot connect to server"
**Cause**: IP address changed or XAMPP not running
**Fix**: 
1. Update IP address: `node update-ip.js`
2. Start XAMPP (Apache + MySQL)

#### Issue: "Failed to get response from AI"
**Cause**: API key expired or rate limit reached
**Fix**: 
1. Check API key in `api/endpoints/ai_chat.php`
2. Verify Groq API service status

#### Issue: "Database connection failed"
**Cause**: MySQL not running or wrong credentials
**Fix**: 
1. Start MySQL in XAMPP
2. Check database credentials in `api/config/db.php`

#### Issue: Chat history not loading
**Cause**: Wrong table structure or missing data
**Fix**: 
1. Verify `chatHistory` table exists
2. Check table structure matches expected columns

### 5. Debug Steps

1. **Check PHP Error Log**:
   ```bash
   tail -20 /Applications/XAMPP/xamppfiles/logs/php_error_log
   ```

2. **Test Database Connection**:
   ```bash
   /Applications/XAMPP/xamppfiles/bin/mysql -u root -e "USE uzimaaidb; SELECT COUNT(*) FROM chatHistory;"
   ```

3. **Verify API Endpoints**:
   ```bash
   # Test login
   curl -I http://192.168.8.108/uzimaai/api/endpoints/login.php
   
   # Test AI chat
   curl -I http://192.168.8.108/uzimaai/api/endpoints/ai_chat.php
   ```

### 6. React Native App Debugging

1. **Check Console Logs**: Look for error messages in the app console
2. **Network Tab**: Check if requests are being sent correctly
3. **User Session**: Ensure user is logged in and `userid` is available

### 7. Quick Fixes

#### Reset Chat History Table:
```sql
DROP TABLE IF EXISTS chatHistory;
CREATE TABLE chatHistory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  timestamp DATETIME NOT NULL,
  type VARCHAR(20) DEFAULT 'chat',
  INDEX(userid),
  FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);
```

#### Test Complete Flow:
```bash
# 1. Check status
curl "http://192.168.8.108/uzimaai/api/endpoints/ai_status.php"

# 2. Send test message
curl -X POST http://192.168.8.108/uzimaai/api/endpoints/ai_chat.php \
  -H "Content-Type: application/json" \
  -d '{"message":"Test message","userid":1,"type":"chat"}'

# 3. Check history
curl "http://192.168.8.108/uzimaai/api/endpoints/get_chat_history.php?userId=1"
```

### 8. Current Configuration
- **AI Model**: llama-3.1-8b-instant (Groq)
- **API Key**: Configured and working
- **Database**: MySQL via XAMPP
- **Chat History**: Stored in `chatHistory` table
- **Rate Limiting**: 150 tokens max per response

### 9. Performance Tips
- Keep messages concise for faster responses
- AI responses are limited to 2-3 sentences
- Chat history is limited to 50 most recent messages
- Consider clearing old chat history if performance degrades

## Still Having Issues?
1. Check XAMPP is running (Apache + MySQL)
2. Verify IP address is correct
3. Test with the provided curl commands
4. Check PHP error logs for specific errors
5. Ensure user is logged in with valid userid 