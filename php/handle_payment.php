<?php
// Include your database connection code here
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the JSON data from the POST request
$input = json_decode(file_get_contents('php://input'), true);

// Extract the necessary data
$product_id = $input['product_id'];
$tx_ref = $input['tx_ref'];
$transaction_id = $input['transaction_id'];
$status = $input['status'] === "successful" ? 1 : 0; // 1 for success, 0 for failure

// Store transaction in the database
$query = "INSERT INTO transactions (product_id, tx_ref, transaction_id, status)
          VALUES ('$product_id', '$tx_ref', '$transaction_id', '$status')";

if (mysqli_query($conn, $query)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
}
?>