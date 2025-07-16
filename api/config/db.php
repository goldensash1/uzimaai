<?php
// Database configuration
$host = 'localhost';
$db   = 'uzimaaidb';
$user = 'root'; // Change as needed
$pass = '';     // Change as needed

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}
// Set charset
$conn->set_charset('utf8mb4'); 