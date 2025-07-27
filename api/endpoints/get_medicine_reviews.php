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

$medicineId = $_GET['medicineId'] ?? null;
if (!$medicineId) {
    send_json(['error' => 'Missing medicineId'], 400);
}

$stmt = $conn->prepare('SELECT r.riviewId, r.UserId, u.username, r.ReviewMessage, r.rating, r.reviewDate FROM medicineReviews r JOIN users u ON r.UserId = u.userid WHERE r.reviewStatus = 1 AND r.medicineId = ? ORDER BY r.reviewDate DESC');
$stmt->bind_param('i', $medicineId);
$stmt->execute();
$result = $stmt->get_result();
$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = [
        'reviewId' => $row['riviewId'],
        'userId' => $row['UserId'],
        'username' => $row['username'],
        'message' => $row['ReviewMessage'],
        'rating' => (int)$row['rating'],
        'reviewDate' => $row['reviewDate']
    ];
}
send_json(['success' => true, 'reviews' => $reviews]); 