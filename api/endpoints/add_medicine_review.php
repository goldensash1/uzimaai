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

$data = json_decode(file_get_contents('php://input'), true);
$UserId = $data['UserId'] ?? null;
$medicineId = $data['medicineId'] ?? null;
$ReviewMessage = $data['ReviewMessage'] ?? null;
$rating = $data['rating'] ?? null;

if (!$UserId || !$medicineId || !$ReviewMessage || !$rating) {
    send_json(['error' => 'Missing required fields'], 400);
}

$reviewStatus = 1;
$reviewDate = date('Y-m-d H:i:s');
$stmt = $conn->prepare('INSERT INTO medicineReviews (UserId, medicineId, ReviewMessage, rating, reviewStatus, reviewDate) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->bind_param('iisiss', $UserId, $medicineId, $ReviewMessage, $rating, $reviewStatus, $reviewDate);
if ($stmt->execute()) {
    send_json(['success' => true, 'riviewId' => $stmt->insert_id]);
} else {
    send_json(['error' => 'Failed to add review'], 500);
} 