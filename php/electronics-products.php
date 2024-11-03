<?php
header('Content-Type: application/json');

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

// Fetch products from the database with category containing 'Home'
$sql = "SELECT * FROM products WHERE product_category LIKE '%Electronics%' ORDER BY RAND()"; // Randomize order
$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $product_id = $row['product_id'];
        $products[] = [
            'product_id' => $row['product_id'],
            'product_name' => $row['product_name'],
            'product_description' => $row['product_description'],
            'product_category' => $row['product_category'],
            'price' => $row['price'],
            'items_in_stock' => $row['items_in_stock'],
            'product_type' => $row['product_type'],
            'meta_tags' => $row['meta_tags'],
            'live' => $row['live'],
            'promote' => $row['promote'],
            'user_id' => $row['user_id'],
            'image' => "outlet/php/uploads/{$product_id}_(1).png"
        ];
    }
}

$conn->close();
echo json_encode($products);
?>
