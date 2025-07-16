<?php
require_once '../config/db.php';
require_once '../utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'Only POST allowed'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
$identifier = $data['identifier'] ?? null; // email or phone
$password = $data['password'] ?? null;

if (!$identifier || !$password) {
    send_json(['error' => 'Missing required fields'], 400);
}

$stmt = $conn->prepare('SELECT userid, username, useremail, phone, userpassword, userstatus FROM users WHERE useremail = ? OR phone = ?');
$stmt->bind_param('ss', $identifier, $identifier);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
if (!$user || !password_verify($password, $user['userpassword'])) {
    send_json(['error' => 'Invalid credentials'], 401);
}
// Remove password from response
unset($user['userpassword']);
send_json(['success' => true, 'user' => $user]); 