# AI Setup Guide for UzimaAI

## 🔍 Issues Found

The AI functionality is not working due to the following issues:

1. **Invalid API Key**: The Groq API key is invalid or expired
2. **Missing Database Table**: The `chatHistory` table is missing from the database
3. **Configuration Issues**: API keys are hardcoded instead of being configurable

## 🛠️ Solutions

### Step 1: Set Up the Database Table

Run this SQL command to create the missing `chatHistory` table:

```sql
-- Connect to your MySQL database and run:
mysql -u root -p uzimaaidb < database/chat_history_table.sql
```

Or manually execute the SQL from `database/chat_history_table.sql`.

### Step 2: Get a Valid Groq API Key

1. **Sign up for Groq**: Go to [https://console.groq.com/](https://console.groq.com/)
2. **Create an account** and verify your email
3. **Generate an API key** from the console
4. **Copy the API key** (starts with `gsk_`)

### Step 3: Update the API Configuration

Edit the file `api/config/ai_config.php`:

```php
// Replace this line:
$GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE";

// With your actual API key:
$GROQ_API_KEY = "gsk_your_actual_api_key_here";
```

### Step 4: Test the AI Service

After updating the API key, test the service:

```bash
# Test AI status
curl -X GET "http://172.17.224.138/uzimaai/api/endpoints/ai_status.php"

# Test AI chat
curl -X POST "http://172.17.224.138/uzimaai/api/endpoints/ai_chat.php" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","userid":1,"type":"chat"}'
```

## 🔧 Alternative Solutions

### Option 1: Use OpenAI API (Alternative)

If you prefer to use OpenAI instead of Groq:

1. Get an OpenAI API key from [https://platform.openai.com/](https://platform.openai.com/)
2. Update `api/config/ai_config.php`:
   ```php
   $OPENAI_API_KEY = "your_openai_api_key_here";
   ```
3. Modify the AI endpoints to use OpenAI instead of Groq

### Option 2: Mock AI Responses (For Testing)

For development/testing without API costs, you can create a mock AI service:

```php
// In ai_chat.php, replace the API call with:
$ai_response = "This is a mock AI response for testing purposes. In production, this would be replaced with actual AI processing.";
```

## 📊 Current Status

After running the setup:

- ✅ **Database**: `chatHistory` table will be created
- ✅ **Configuration**: API keys will be properly managed
- ✅ **Error Handling**: Better error messages for users
- ✅ **Fallback Options**: Multiple AI service support

## 🚀 Quick Fix Commands

```bash
# 1. Create the database table
mysql -u root -p uzimaaidb < database/chat_history_table.sql

# 2. Update API key in config file
# Edit: api/config/ai_config.php

# 3. Test the service
curl -X GET "http://172.17.224.138/uzimaai/api/endpoints/ai_status.php"
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid API Key"**: Update the API key in `api/config/ai_config.php`
2. **"Table doesn't exist"**: Run the database setup script
3. **"Network error"**: Check if XAMPP is running
4. **"Rate limit exceeded"**: Wait a few minutes before trying again

### Debug Commands:

```bash
# Check database table exists
mysql -u root -p -e "USE uzimaaidb; SHOW TABLES LIKE 'chatHistory';"

# Check API key configuration
grep -n "GROQ_API_KEY" api/config/ai_config.php

# Test API connectivity
curl -I "https://api.groq.com/openai/v1/chat/completions"
```

## 💡 Tips

- **Free Tier**: Groq offers free API calls for testing
- **Rate Limits**: Be aware of API rate limits
- **Error Logs**: Check XAMPP error logs for PHP errors
- **Backup**: Keep a backup of your API keys

After completing these steps, the AI functionality should work properly in your UzimaAI app! 