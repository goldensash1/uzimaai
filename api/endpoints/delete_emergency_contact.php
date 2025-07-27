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

if (!$contactId) {
    send_json(['error' => 'Missing contactId'], 400);
}

$stmt = $conn->prepare('DELETE FROM emergencyContacts WHERE contactId = ?');
$stmt->bind_param('i', $contactId);

if ($stmt->execute()) {
    send_json([
        'success' => true,
        'message' => 'Contact deleted successfully'
    ]);
} else {
    send_json(['error' => 'Failed to delete contact'], 500);
}
?> 