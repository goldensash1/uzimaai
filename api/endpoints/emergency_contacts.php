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

// Handle both UserId and userid parameters
$UserId = $_GET['UserId'] ?? $_GET['userid'] ?? null;

if (!$UserId) {
    send_json(['error' => 'Missing UserId'], 400);
}

$stmt = $conn->prepare('SELECT contactId, UserId, PhoneNumber, Relationship, ContactName, updatedDate, contactStatus FROM emergencyContacts WHERE UserId = ? ORDER BY updatedDate DESC');
$stmt->bind_param('i', $UserId);
$stmt->execute();
$result = $stmt->get_result();
$contacts = [];

while ($row = $result->fetch_assoc()) {
    // Transform the data to match the frontend expectations
    $contacts[] = [
        'contactId' => $row['contactId'],
        'name' => $row['ContactName'],
        'phone' => $row['PhoneNumber'],
        'relationship' => $row['Relationship'],
        'isPrimary' => $row['contactStatus'] == 2, // 2 means primary contact
        'updatedDate' => $row['updatedDate']
    ];
}

send_json([
    'success' => true, 
    'data' => $contacts,
    'count' => count($contacts)
]);
?> 