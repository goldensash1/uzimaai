<?php
function send_json($data, $code = 200) {
    http_response_code($code);
   
    echo json_encode($data);
    exit;
} 