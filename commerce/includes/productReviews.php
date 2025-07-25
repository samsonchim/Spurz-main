<?php
require_once 'config.php';

// Get product_id from 'product_id' parameter in GET
$product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;

header('Content-Type: application/json');

if ($product_id > 0) {
    $stmt = $conn->prepare("SELECT name, review FROM reviews WHERE product_id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = [
            'customer_name' => $row['name'],
            'review' => $row['review']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'reviews' => $reviews
    ]);
    $stmt->close();
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid product_id'
    ]);
}

$conn->close();
?>