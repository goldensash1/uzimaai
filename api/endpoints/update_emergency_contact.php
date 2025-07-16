<?php
require_once '../config/db.php';
require_once '../utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'Only POST allowed'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
$contactId = $data['contactId'] ?? null;
$PhoneNumber = $data['PhoneNumber'] ?? null;
$Relationship = $data['Relationship'] ?? null;
$ContactName = $data['ContactName'] ?? null;

if (!$contactId || !$PhoneNumber || !$Relationship || !$ContactName) {
    send_json(['error' => 'Missing required fields'], 400);
}

$updatedDate = date('Y-m-d H:i:s');
$stmt = $conn->prepare('UPDATE emergencyContacts SET PhoneNumber = ?, Relationship = ?, ContactName = ?, updatedDate = ? WHERE contactId = ?');
$stmt->bind_param('ssssi', $PhoneNumber, $Relationship, $ContactName, $updatedDate, $contactId);
if ($stmt->execute()) {
    send_json(['success' => true]);
} else {
    send_json(['error' => 'Failed to update contact'], 500);
} 