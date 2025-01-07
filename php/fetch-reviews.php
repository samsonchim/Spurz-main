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

// Fetch product ID from URL
$product_id = $_GET['id'] ?? '';

if (!empty($product_id)) {
    // Fetch reviews for the product ID
    $stmt = $conn->prepare("SELECT name, review, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }

    // Return reviews as JSON
    echo json_encode($reviews);
} else {
    echo json_encode(['error' => 'Product ID is required']);
}

// Close connection
$conn->close();
?>
