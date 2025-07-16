<?php
require_once '../config/db.php';
require_once '../utils/response.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'Only POST allowed'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? null;
$useremail = $data['useremail'] ?? null;
$phone = $data['phone'] ?? null;
$password = $data['password'] ?? null;

if (!$username || !$useremail || !$phone || !$password) {
    send_json(['error' => 'Missing required fields'], 400);
}

// Check if user exists
$stmt = $conn->prepare('SELECT userid FROM users WHERE useremail = ? OR phone = ?');
$stmt->bind_param('ss', $useremail, $phone);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    send_json(['error' => 'User already exists'], 409);
}
$stmt->close();

$hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $conn->prepare('INSERT INTO users (username, useremail, phone, userpassword, userstatus) VALUES (?, ?, ?, ?, ?)');
$status = 'active';
$stmt->bind_param('sssss', $username, $useremail, $phone, $hash, $status);
if ($stmt->execute()) {
    send_json(['success' => true, 'userid' => $stmt->insert_id]);
} else {
    send_json(['error' => 'Registration failed'], 500);
} 