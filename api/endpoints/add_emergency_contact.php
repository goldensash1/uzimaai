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

$raw = file_get_contents('php://input');
if (!$raw) {
    send_json(['error' => 'Empty request body'], 400);
}
$data = json_decode($raw, true);
if (!is_array($data)) {
    send_json(['error' => 'Invalid JSON'], 400);
}

// Handle both old and new field names
$UserId = $data['UserId'] ?? $data['userid'] ?? null;
$PhoneNumber = $data['PhoneNumber'] ?? $data['phone'] ?? null;
$Relationship = $data['Relationship'] ?? $data['relationship'] ?? null;
$ContactName = $data['ContactName'] ?? $data['name'] ?? null;

if (!$UserId || !$PhoneNumber || !$Relationship || !$ContactName) {
    send_json(['error' => 'Missing required fields'], 400);
}

$updatedDate = date('Y-m-d H:i:s');
$contactStatus = 1;

$stmt = $conn->prepare('INSERT INTO emergencyContacts (UserId, PhoneNumber, Relationship, ContactName, updatedDate, contactStatus) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->bind_param('issssi', $UserId, $PhoneNumber, $Relationship, $ContactName, $updatedDate, $contactStatus);

if ($stmt->execute()) {
    send_json([
        'success' => true, 
        'contactId' => $stmt->insert_id,
        'message' => 'Contact added successfully'
    ]);
} else {
    send_json(['error' => 'Failed to add contact'], 500);
}
?> 