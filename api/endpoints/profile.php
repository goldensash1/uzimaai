<?php
require_once '../config/db.php';
require_once '../utils/response.php';

$userid = $_GET['userid'] ?? null;
if (!$userid) {
    send_json(['error' => 'Missing userid'], 400);
}

$stmt = $conn->prepare('SELECT userid, username, useremail, phone, emergencyphone, userstatus FROM users WHERE userid = ?');
$stmt->bind_param('i', $userid);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
if (!$user) {
    send_json(['error' => 'User not found'], 404);
}
send_json(['success' => true, 'user' => $user]); 