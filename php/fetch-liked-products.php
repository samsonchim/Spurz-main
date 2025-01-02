<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Get product IDs from the request
$data = json_decode(file_get_contents('php://input'), true);
$productIds = isset($data['productIds']) ? $data['productIds'] : [];

if (empty($productIds)) {
    echo json_encode(['error' => 'No product IDs provided']);
    exit;
}

// Fetch products from the database
$placeholders = implode(',', array_fill(0, count($productIds), '?'));
$sql = "SELECT * FROM products WHERE product_id IN ($placeholders)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}

// Bind parameters dynamically
$stmt->bind_param(str_repeat('i', count($productIds)), ...$productIds);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

// Output results as JSON
echo json_encode($products);

// Close connections
$stmt->close();
$conn->close();
?>
