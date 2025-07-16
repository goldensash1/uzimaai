<?php
require_once '../config/db.php';
require_once '../utils/response.php';

$UserId = $_GET['UserId'] ?? null;
if (!$UserId) {
    send_json(['error' => 'Missing UserId'], 400);
}

$stmt = $conn->prepare('SELECT contactId, UserId, PhoneNumber, Relationship, ContactName, updatedDate, contactStatus FROM emergencyContacts WHERE UserId = ? ORDER BY updatedDate DESC');
$stmt->bind_param('i', $UserId);
$stmt->execute();
$result = $stmt->get_result();
$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}
send_json(['success' => true, 'contacts' => $contacts]); 