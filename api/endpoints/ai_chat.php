<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/db.php';
require_once '../utils/response.php';

// Configuration
$groq_api_key = "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";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get input data
    $input_data = [];
    $content_type = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';

    if (strpos($content_type, 'application/json') !== false) {
        $json_data = file_get_contents('php://input');
        $input_data = json_decode($json_data, true);
    } else {
        $input_data = $_POST;
    }

    // Validate input
    if (!isset($input_data['message']) || empty($input_data['message'])) {
        send_json(['error' => 'Message is required'], 400);
        exit;
    }

    if (!isset($input_data['userid']) || empty($input_data['userid'])) {
        send_json(['error' => 'User ID is required'], 400);
        exit;
    }

    $message = $input_data['message'];
    $userid = $input_data['userid'];
    $message_type = isset($input_data['type']) ? $input_data['type'] : 'chat'; // 'chat' or 'symptom'

    // Determine system message based on type
    if ($message_type === 'symptom') {
        $system_message = [
            "role" => "system",
            "content" => "You are a medical AI assistant. Analyze the symptoms described and provide a brief assessment. Keep responses concise (2-3 sentences maximum) as this is a free trial. Focus on common causes and when to seek medical attention. Do not provide definitive diagnoses."
        ];
    } else {
        $system_message = [
            "role" => "system",
            "content" => "You are a helpful medical AI assistant. Provide brief, informative responses to medical questions. Keep responses concise (2-3 sentences maximum) as this is a free trial. Focus on general health information and when to consult healthcare professionals."
        ];
    }

    // Prepare the API request to Groq
    $messages = [
        $system_message,
        [
            "role" => "user",
            "content" => $message
        ]
    ];

    $request_data = [
        "model" => "llama-3.1-8b-instant",
        "messages" => $messages,
        "temperature" => 0.7,
        "max_tokens" => 150, // Limit tokens for concise responses
        "top_p" => 1,
        "stream" => false
    ];

    // Initialize cURL session
    $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($request_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $groq_api_key
    ]);

    // Execute the request
    $response = curl_exec($ch);
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    // Handle errors
    if ($response === false) {
        send_json(['error' => 'cURL error: ' . $curl_error], 500);
        exit;
    }

    // Process response
    $response_data = json_decode($response, true);
    if ($http_status != 200 || !isset($response_data['choices'][0]['message']['content'])) {
        send_json(['error' => 'API error', 'details' => $response_data], $http_status ?: 500);
        exit;
    }

    $ai_response = $response_data['choices'][0]['message']['content'];

    // Save the conversation to database
    $timestamp = date('Y-m-d H:i:s');
    
    // Save user message
    $stmt = $conn->prepare("INSERT INTO chatHistory (userid, message, response, timestamp, type) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $userid, $message, $ai_response, $timestamp, $message_type);
    
    if ($stmt->execute()) {
        send_json([
            'success' => true,
            'message' => $message,
            'response' => $ai_response,
            'timestamp' => $timestamp,
            'type' => $message_type
        ]);
    } else {
        send_json(['error' => 'Failed to save conversation'], 500);
    }
    
    $stmt->close();
} else {
    send_json(['error' => 'Method not allowed'], 405);
}

$conn->close();
?> 