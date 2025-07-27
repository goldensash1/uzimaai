<?php
require_once '../config/db.php';
require_once '../utils/response.php';

$userId = $_GET['userId'] ?? null;
if (!$userId) {
    send_json(['error' => 'Missing userId'], 400);
}

$stmt = $conn->prepare('SELECT id, message, response, timestamp, type FROM chatHistory WHERE userid = ? ORDER BY timestamp DESC LIMIT 50');
$stmt->bind_param('i', $userId);
$stmt->execute();
$result = $stmt->get_result();
$messages = [];
while ($row = $result->fetch_assoc()) {
    $messages[] = $row;
}
send_json(['success' => true, 'data' => $messages]); 