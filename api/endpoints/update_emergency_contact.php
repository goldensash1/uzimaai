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
$contactId = $data['contactId'] ?? null;

// Handle both old and new field names
$PhoneNumber = $data['PhoneNumber'] ?? $data['phone'] ?? null;
$Relationship = $data['Relationship'] ?? $data['relationship'] ?? null;
$ContactName = $data['ContactName'] ?? $data['name'] ?? null;

if (!$contactId || !$PhoneNumber || !$Relationship || !$ContactName) {
    send_json(['error' => 'Missing required fields'], 400);
}

$updatedDate = date('Y-m-d H:i:s');
$stmt = $conn->prepare('UPDATE emergencyContacts SET PhoneNumber = ?, Relationship = ?, ContactName = ?, updatedDate = ? WHERE contactId = ?');
$stmt->bind_param('ssssi', $PhoneNumber, $Relationship, $ContactName, $updatedDate, $contactId);

if ($stmt->execute()) {
    send_json([
        'success' => true,
        'message' => 'Contact updated successfully'
    ]);
} else {
    send_json(['error' => 'Failed to update contact'], 500);
}
?> 