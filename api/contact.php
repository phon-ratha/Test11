<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$required = ['firstName', 'lastName', 'email', 'subject', 'message'];
foreach ($required as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => ucfirst($field) . ' is required']);
        exit;
    }
}

// Validate email
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, ?, 'new')");
    $stmt->execute([
        sanitizeInput($input['firstName']),
        sanitizeInput($input['lastName']),
        $input['email'],
        sanitizeInput($input['phone'] ?? ''),
        sanitizeInput($input['subject']),
        sanitizeInput($input['message'])
    ]);
    
    // Send email notification (optional)
    $to = 'admin@stylehub.com';
    $subject = 'New Contact Form Submission: ' . $input['subject'];
    $message = "Name: " . $input['firstName'] . " " . $input['lastName'] . "\n";
    $message .= "Email: " . $input['email'] . "\n";
    $message .= "Phone: " . ($input['phone'] ?? 'Not provided') . "\n";
    $message .= "Subject: " . $input['subject'] . "\n\n";
    $message .= "Message:\n" . $input['message'];
    
    $headers = "From: " . $input['email'] . "\r\n";
    $headers .= "Reply-To: " . $input['email'] . "\r\n";
    
    mail($to, $subject, $message, $headers);
    
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
