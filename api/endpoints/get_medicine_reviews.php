<?php
require_once '../config/db.php';
require_once '../utils/response.php';

$medicineId = $_GET['medicineId'] ?? null;
if (!$medicineId) {
    send_json(['error' => 'Missing medicineId'], 400);
}

$stmt = $conn->prepare('SELECT r.riviewId, r.UserId, u.username, r.ReviewMessage, r.rating, r.reviewDate FROM medecineReviews r JOIN users u ON r.UserId = u.userid WHERE r.reviewStatus = 1 AND r.medicineId = ? ORDER BY r.reviewDate DESC');
$stmt->bind_param('i', $medicineId);
$stmt->execute();
$result = $stmt->get_result();
$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}
send_json(['success' => true, 'reviews' => $reviews]); 