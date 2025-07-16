<?php
require_once '../config/db.php';
require_once '../utils/response.php';

$userid = $_GET['userid'] ?? null;
if (!$userid) {
    send_json(['error' => 'Missing userid'], 400);
}

$stmt = $conn->prepare('SELECT searchId, searchContent, searchTime FROM searchHistory WHERE userid = ? ORDER BY searchTime DESC');
$stmt->bind_param('i', $userid);
$stmt->execute();
$result = $stmt->get_result();
$history = [];
while ($row = $result->fetch_assoc()) {
    $history[] = $row;
}
send_json(['success' => true, 'history' => $history]); 