<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/db.php';
require_once '../utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'Only POST allowed'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);

// Handle both UserId and userid parameters
$UserId = $data['UserId'] ?? $data['userid'] ?? null;
$contactId = $data['contactId'] ?? null;

if (!$UserId || !$contactId) {
    send_json(['error' => 'Missing required fields'], 400);
}

// Set all contacts for this user to status 1 (not primary)
$stmt = $conn->prepare('UPDATE emergencyContacts SET contactStatus = 1 WHERE UserId = ?');
$stmt->bind_param('i', $UserId);
$stmt->execute();

// Set selected contact to status 2 (primary)
$stmt = $conn->prepare('UPDATE emergencyContacts SET contactStatus = 2 WHERE contactId = ? AND UserId = ?');
$stmt->bind_param('ii', $contactId, $UserId);

if ($stmt->execute()) {
    send_json([
        'success' => true,
        'message' => 'Primary contact updated successfully'
    ]);
} else {
    send_json(['error' => 'Failed to set primary contact'], 500);
}
?> 