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

$sql = 'SELECT medicineId, medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, updatedDate FROM medicine WHERE medicineStatus = 1';
$result = $conn->query($sql);
$medicines = [];
while ($row = $result->fetch_assoc()) {
    $medicines[] = $row;
}
send_json(['success' => true, 'medicines' => $medicines]); 