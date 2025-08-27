<?php
// AI Configuration File
// Update these settings as needed

// Groq API Configuration
$GROQ_API_KEY = "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"; // Replace with your actual Groq API key

// Alternative AI Services (for fallback)
$OPENAI_API_KEY = "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"; // Optional: OpenAI API key as backup

// AI Model Settings
$DEFAULT_MODEL = "llama-3.1-8b-instant"; // Groq model
$FALLBACK_MODEL = "gpt-3.5-turbo"; // OpenAI model as fallback

// Response Settings
$MAX_TOKENS = 150;
$TEMPERATURE = 0.7;
$TOP_P = 1;

// Rate Limiting
$RATE_LIMIT_PER_MINUTE = 10;
$RATE_LIMIT_PER_HOUR = 100;

// Error Messages
$ERROR_MESSAGES = [
    'invalid_api_key' => 'AI service is temporarily unavailable. Please try again later.',
    'rate_limit_exceeded' => 'Too many requests. Please wait a moment before trying again.',
    'service_unavailable' => 'AI service is currently unavailable. Please try again later.',
    'network_error' => 'Network error. Please check your connection and try again.'
];

// Function to get API key with fallback
function getApiKey($service = 'groq') {
    global $GROQ_API_KEY, $OPENAI_API_KEY;
    
    if ($service === 'groq') {
        return $GROQ_API_KEY;
    } elseif ($service === 'openai') {
        return $OPENAI_API_KEY;
    }
    
    return null;
}

// Function to check if API key is valid
function isApiKeyValid($apiKey) {
    return !empty($apiKey) && $apiKey !== "YOUR_GROQ_API_KEY_HERE" && strlen($apiKey) > 20;
}
?> 