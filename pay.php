<?php
// Start session
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    file_put_contents("debug.log", "Database connection error: " . $conn->connect_error . PHP_EOL, FILE_APPEND);
    die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
}

// Fetch POST data
$tx_ref = $_POST['tx_ref'] ?? '';
$transaction_id = $_POST['transaction_id'] ?? '';
$total_due = $_POST['total_due'] ?? '';
$currency = $_POST['currency'] ?? '';
$customer_name = $_POST['customer_name'] ?? '';
$customer_email = $_POST['customer_email'] ?? '';
$phone_no = $_POST['phone_no'] ?? '';
$product_name = $_POST['product_name'] ?? '';

// Log POST data for debugging
file_put_contents("debug.log", "Received data: " . json_encode($_POST, JSON_PRETTY_PRINT) . PHP_EOL, FILE_APPEND);

// Validate required fields
if (empty($tx_ref) || empty($transaction_id) || empty($total_due) || empty($currency) || empty($customer_name) || empty($customer_email) || empty($phone_no) || empty($product_name)) {
    echo json_encode(['success' => false, 'message' => 'Invalid or incomplete data.']);
    exit();
}

// Prepare SQL statement
$stmt = $conn->prepare(
    "INSERT INTO transactions (tx_ref, transaction_id, total_due, currency, customer_name, customer_email, phone_no, product_name, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())"
);

if (!$stmt) {
    file_put_contents("debug.log", "Prepare failed: " . $conn->error . PHP_EOL, FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Database preparation failed.']);
    exit();
}

// Bind parameters
$stmt->bind_param(
    "ssdsssss",
    $tx_ref,
    $transaction_id,
    $total_due,
    $currency,
    $customer_name,
    $customer_email,
    $phone_no,
    $product_name
);

// Execute statement
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Transaction saved successfully.']);
} else {
    file_put_contents("debug.log", "SQL error: " . $stmt->error . PHP_EOL, FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Failed to save transaction.']);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
