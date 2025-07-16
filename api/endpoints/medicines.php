<?php
require_once '../config/db.php';
require_once '../utils/response.php';

$sql = 'SELECT medicineId, medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, updatedDate FROM medecines WHERE medicineStatus = 1';
$result = $conn->query($sql);
$medicines = [];
while ($row = $result->fetch_assoc()) {
    $medicines[] = $row;
}
send_json(['success' => true, 'medicines' => $medicines]); 