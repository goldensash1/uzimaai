<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/db.php';
require_once '../utils/response.php';

// Configuration
$groq_api_key = "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";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $status = [
        'ai_service' => 'unknown',
        'database' => 'unknown',
        'api_key' => 'unknown',
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    // Check database connection
    if ($conn && !$conn->connect_error) {
        $status['database'] = 'connected';
    } else {
        $status['database'] = 'error';
    }
    
    // Check API key
    if (!empty($groq_api_key)) {
        $status['api_key'] = 'configured';
    } else {
        $status['api_key'] = 'missing';
    }
    
    // Test AI service with a simple request
    try {
        $test_data = [
            "model" => "llama-3.1-8b-instant",
            "messages" => [
                [
                    "role" => "user",
                    "content" => "Hello"
                ]
            ],
            "max_tokens" => 10
        ];
        
        $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($test_data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $groq_api_key
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($http_status === 200) {
            $status['ai_service'] = 'online';
        } else {
            $status['ai_service'] = 'error';
        }
    } catch (Exception $e) {
        $status['ai_service'] = 'error';
    }
    
    send_json([
        'success' => true,
        'status' => $status,
        'message' => 'AI service status check completed'
    ]);
} else {
    send_json(['error' => 'Method not allowed'], 405);
}

$conn->close();
?> 