<?php
require_once '../config/db.php';
require_once '../utils/response.php';

data = json_decode(file_get_contents('php://input'), true);
$userId = $data['userId'] ?? null;
$message = $data['message'] ?? null;

if (!$userId || !$message) {
    send_json(['error' => 'Missing required fields'], 400);
}

$now = date('Y-m-d H:i:s');
$stmt = $conn->prepare('INSERT INTO userContext (userId, contextContent, contextTime) VALUES (?, ?, ?)');
$stmt->bind_param('iss', $userId, $message, $now);
if ($stmt->execute()) {
    send_json(['success' => true, 'contextId' => $stmt->insert_id]);
} else {
    send_json(['error' => 'Failed to save message'], 500);
} 