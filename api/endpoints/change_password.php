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

$userid = $data['userid'] ?? null;
$currentPassword = $data['currentPassword'] ?? null;
$newPassword = $data['newPassword'] ?? null;
$confirmPassword = $data['confirmPassword'] ?? null;

if (!$userid || !$currentPassword || !$newPassword || !$confirmPassword) {
    send_json(['error' => 'All fields are required'], 400);
}

if ($newPassword !== $confirmPassword) {
    send_json(['error' => 'New passwords do not match'], 400);
}

if (strlen($newPassword) < 6) {
    send_json(['error' => 'New password must be at least 6 characters'], 400);
}

try {
    // First, verify the current password
    $stmt = $conn->prepare('SELECT userpassword FROM users WHERE userid = ?');
    $stmt->bind_param('i', $userid);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        send_json(['error' => 'User not found'], 404);
    }
    
    $user = $result->fetch_assoc();
    
    // Verify current password
    if (!password_verify($currentPassword, $user['userpassword'])) {
        send_json(['error' => 'Current password is incorrect'], 400);
    }
    
    // Hash the new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update the password
    $updateStmt = $conn->prepare('UPDATE users SET userpassword = ? WHERE userid = ?');
    $updateStmt->bind_param('si', $hashedPassword, $userid);
    
    if ($updateStmt->execute()) {
        send_json([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    } else {
        send_json(['error' => 'Failed to update password'], 500);
    }
    
} catch (Exception $e) {
    send_json(['error' => 'Database error: ' . $e->getMessage()], 500);
}

$conn->close();
?> 