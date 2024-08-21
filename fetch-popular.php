<?php
// Database connection
$servername = "localhost"; 
$username = "root"; 
$password = ""; 
$dbname = "spurz"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch 3 random products
$sql = "SELECT product_id, product_name, product_description, price, items_in_stock, product_category 
        FROM products 
        ORDER BY RAND() 
        LIMIT 3";

$result = $conn->query($sql);

$products = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $product_id = $row['product_id'];
        $row['image'] = "outlet/php/uploads/{$product_id}_(1).png";
        $products[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($products);
?>