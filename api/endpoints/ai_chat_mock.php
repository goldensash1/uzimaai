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

    $message = strtolower(trim($input_data['message']));
    $userid = $input_data['userid'];
    $message_type = isset($input_data['type']) ? $input_data['type'] : 'chat';

    // Mock AI responses based on keywords
    $ai_response = "I'm here to help with your health questions. Please provide more details about your concern.";

    // Health-related responses
    if (strpos($message, 'headache') !== false) {
        $ai_response = "Headaches can be caused by stress, dehydration, or lack of sleep. Try resting in a quiet, dark room, staying hydrated, and managing stress. If severe or persistent, consult a healthcare provider.";
    } elseif (strpos($message, 'fever') !== false) {
        $ai_response = "A fever is often a sign of infection. Rest, stay hydrated, and monitor your temperature. Seek medical attention if fever is high (above 103°F/39.4°C) or persists for more than 3 days.";
    } elseif (strpos($message, 'cold') !== false || strpos($message, 'flu') !== false) {
        $ai_response = "Common cold and flu symptoms include runny nose, sore throat, cough, and fatigue. Rest, drink plenty of fluids, and consider over-the-counter medications for symptom relief. See a doctor if symptoms are severe.";
    } elseif (strpos($message, 'pain') !== false) {
        $ai_response = "Pain can have many causes. Rest the affected area, apply ice or heat as appropriate, and consider over-the-counter pain relievers. If pain is severe or persistent, consult a healthcare professional.";
    } elseif (strpos($message, 'sleep') !== false) {
        $ai_response = "Good sleep is essential for health. Maintain a regular sleep schedule, create a relaxing bedtime routine, avoid screens before bed, and ensure your sleep environment is comfortable and dark.";
    } elseif (strpos($message, 'diet') !== false || strpos($message, 'nutrition') !== false) {
        $ai_response = "A balanced diet with fruits, vegetables, lean proteins, and whole grains supports good health. Stay hydrated and limit processed foods, sugar, and excessive salt. Consider consulting a nutritionist for personalized advice.";
    } elseif (strpos($message, 'exercise') !== false || strpos($message, 'workout') !== false) {
        $ai_response = "Regular exercise benefits both physical and mental health. Aim for at least 150 minutes of moderate activity weekly. Start gradually and choose activities you enjoy. Consult your doctor before starting a new exercise program.";
    } elseif (strpos($message, 'stress') !== false || strpos($message, 'anxiety') !== false) {
        $ai_response = "Stress and anxiety are common. Try deep breathing, meditation, regular exercise, and maintaining a healthy sleep schedule. Talk to friends or family, and consider professional help if symptoms persist.";
    } elseif (strpos($message, 'hello') !== false || strpos($message, 'hi') !== false) {
        $ai_response = "Hello! I'm your medical assistant. I can help you with general health information and guidance. How can I assist you today? Remember, I provide general information only - always consult healthcare professionals for medical advice.";
    } elseif (strpos($message, 'thank') !== false) {
        $ai_response = "You're welcome! I'm here to help with your health questions. Feel free to ask anything else.";
    } elseif (strpos($message, 'emergency') !== false) {
        $ai_response = "If you're experiencing a medical emergency, call emergency services immediately (911 in the US). Don't wait for online advice in life-threatening situations.";
    }

    // Save the conversation to database
    $timestamp = date('Y-m-d H:i:s');
    
    // Save user message
    $stmt = $conn->prepare("INSERT INTO chatHistory (userid, message, response, timestamp, type) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $userid, $input_data['message'], $ai_response, $timestamp, $message_type);
    
    if ($stmt->execute()) {
        send_json([
            'success' => true,
            'message' => $input_data['message'],
            'response' => $ai_response,
            'timestamp' => $timestamp,
            'type' => $message_type,
            'note' => 'This is a mock response for testing. In production, this would be replaced with actual AI processing.'
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