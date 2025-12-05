<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers to allow requests from your website
header('Access-Control-Allow-Origin: *'); // In production, replace * with your actual domain
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate inputs
if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit();
}

$name = strip_tags(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$message = strip_tags(trim($input['message']));

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit();
}

// Email configuration
$to = 'info@sylviasbasket.co.ke';
$subject = 'New Contact Form Submission from ' . $name;

// Email body (HTML)
$emailBody = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .info-box h2 { color: #374151; margin-top: 0; font-size: 18px; border-bottom: 2px solid #22c55e; padding-bottom: 10px; }
        .message-box { background: white; padding: 20px; border-radius: 8px; }
        .tip-box { margin-top: 20px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; }
        .footer { text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
            <div class="info-box">
                <h2>Contact Details</h2>
                <p><strong>Name:</strong> ' . htmlspecialchars($name) . '</p>
                <p><strong>Email:</strong> <a href="mailto:' . htmlspecialchars($email) . '">' . htmlspecialchars($email) . '</a></p>
            </div>
            <div class="message-box">
                <h2>Message</h2>
                <p>' . nl2br(htmlspecialchars($message)) . '</p>
            </div>
            <div class="tip-box">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                    💡 <strong>Tip:</strong> You can reply directly to ' . htmlspecialchars($email) . ' to respond to ' . htmlspecialchars($name) . '
                </p>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from the Sylvia\'s Basket contact form</p>
            <p>© ' . date('Y') . ' Sylvia\'s Basket. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
';

// Email headers
$headers = array(
    'From: Sylvias Basket Website <noreply@sylviasbasket.co.ke>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8'
);

// Send email
$success = mail($to, $subject, $emailBody, implode("\r\n", $headers));

if ($success) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send message. Please try again or email us directly at info@sylviasbasket.co.ke'
    ]);
}
?>
