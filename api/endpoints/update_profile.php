<?php
require_once '../config/db.php';
require_once '../utils/response.php';

$data = json_decode(file_get_contents('php://input'), true);
$userid = $data['userid'] ?? null;
$username = $data['username'] ?? null;
$useremail = $data['useremail'] ?? null;
$phone = $data['phone'] ?? null;
$emergencyphone = $data['emergencyphone'] ?? null;

if (!$userid || !$username || !$useremail || !$phone) {
    send_json(['error' => 'Missing required fields'], 400);
}

$stmt = $conn->prepare('UPDATE users SET username = ?, useremail = ?, phone = ?, emergencyphone = ? WHERE userid = ?');
$stmt->bind_param('ssssi', $username, $useremail, $phone, $emergencyphone, $userid);
if ($stmt->execute()) {
    send_json(['success' => true]);
} else {
    send_json(['error' => 'Failed to update profile'], 500);
} 