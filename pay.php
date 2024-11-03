<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get transaction reference from the URL
$tx_ref = isset($_GET['tx_ref']) ? $_GET['tx_ref'] : '';
$transaction_id = isset($_GET['transaction_id']) ? $_GET['transaction_id'] : '';

if (!isset($_SESSION['total_due'], $_SESSION['currency'], $_SESSION['customer_name'], $_SESSION['product_name'], $_SESSION['csrf_token'])) {
    die("Session variables not set.");
}

$total_due = $_SESSION['total_due'];
$currency = $_SESSION['currency'];
$customer_name = $_SESSION['customer_name'];
$product_name = $_SESSION['product_name'];
$csrf_token = $_SESSION['csrf_token'];

// Verify Monnify transaction via API
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://api.monnify.com/api/v1/transaction-status?transactionReference=" . urlencode($tx_ref),
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => array(
    "Authorization: Bearer UK1QQVE8Q6YF058ZS7W5VQ29775WF49D" 
  ),
));

$response = curl_exec($curl);
$http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

$response = json_decode($response, true);

if ($http_status === 200 && $response && isset($response['paymentStatus']) && $response['paymentStatus'] === 'PAID') {
    $stmt = $conn->prepare("INSERT INTO transactions (csrf_token, total_due, currency, customer_name, product_name, transaction_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    
    $status = 'successful';

    $stmt->bind_param("sdsssss", $csrf_token, $total_due, $currency, $customer_name, $product_name, $transaction_id, $status);
    
    if ($stmt->execute()) {
        header("Location: thank-you.html");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
} else {
    error_log("Monnify API error: HTTP Status $http_status - Response: " . json_encode($response));

    header("Location: failed.html");
    exit();
}

// Close database connection
$conn->close();
?>
