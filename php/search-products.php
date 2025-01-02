<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz"; 

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Get search query from URL
$searchQuery = isset($_GET['query']) ? $conn->real_escape_string($_GET['query']) : '';

if (empty($searchQuery)) {
    echo json_encode(['error' => 'Search query is empty']);
    exit;
}

// SQL query to search all columns
$sql = "
    SELECT * FROM products
    WHERE 
        product_name LIKE ? OR
        product_description LIKE ? OR
        product_category LIKE ? OR
        product_type LIKE ? OR
        meta_tags LIKE ? OR
        promote LIKE ? OR
        CAST(price AS CHAR) LIKE ? OR
        CAST(items_in_stock AS CHAR) LIKE ? OR
        CAST(user_id AS CHAR) LIKE ?
    ORDER BY product_name ASC
";

// Prepare and bind parameters
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}

// Add wildcards for fuzzy matching
$likeQuery = '%' . $searchQuery . '%';
$stmt->bind_param(
    'sssssssss',
    $likeQuery, $likeQuery, $likeQuery, $likeQuery, $likeQuery,
    $likeQuery, $likeQuery, $likeQuery, $likeQuery
);

// Execute the query
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
