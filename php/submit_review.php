<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch form data
$name = $_POST['name'] ?? '';
$transaction_id = $_POST['transaction_id'] ?? '';
$review = $_POST['review'] ?? '';
$product_id = $_POST['product_id'] ?? '';

// Validate required fields
if (empty($name) || empty($transaction_id) || empty($review) || empty($product_id)) {
    echo "All fields are required.";
    exit();
}

// Prepare SQL statement
$stmt = $conn->prepare(
    "INSERT INTO reviews (product_id, name, transaction_id, review, created_at) 
     VALUES (?, ?, ?, ?, NOW())"
);

if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

// Bind parameters
$stmt->bind_param("isss", $product_id, $name, $transaction_id, $review);

// Execute statement
if ($stmt->execute()) {
    echo "Review submitted successfully!";
    header("Location: thank-you.html");
    exit();
} else {
    echo "Error: " . $stmt->error;
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
