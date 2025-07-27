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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $category = $_GET['category'] ?? null;
    $severity = $_GET['severity'] ?? null;
    
    $query = 'SELECT id, title, description, steps, category, severity, image_url, created_at FROM firstAidPractices';
    $params = [];
    $types = '';
    
    // Add filters if provided
    if ($category) {
        $query .= ' WHERE category = ?';
        $params[] = $category;
        $types .= 's';
    }
    
    if ($severity) {
        if ($category) {
            $query .= ' AND severity = ?';
        } else {
            $query .= ' WHERE severity = ?';
        }
        $params[] = $severity;
        $types .= 's';
    }
    
    $query .= ' ORDER BY CASE severity 
                WHEN "Critical" THEN 1 
                WHEN "High" THEN 2 
                WHEN "Medium" THEN 3 
                WHEN "Low" THEN 4 
                END, title ASC';
    
    $stmt = $conn->prepare($query);
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $practices = [];
    while ($row = $result->fetch_assoc()) {
        // Convert steps string to array
        $row['steps'] = explode('\n', $row['steps']);
        $practices[] = $row;
    }
    
    send_json([
        'success' => true,
        'data' => $practices,
        'count' => count($practices)
    ]);
} else {
    send_json(['error' => 'Method not allowed'], 405);
}

$conn->close();
?> 