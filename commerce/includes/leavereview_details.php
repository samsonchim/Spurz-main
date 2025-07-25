<?php
require "config.php"; 


if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $product_id = intval($_GET['id']); 


    $query = "SELECT product_title FROM products WHERE product_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $product_title = $row['product_title'];
        $product_img = "./admin/upload/" . $product_id . ".png"; 
        
    } else {
        die("Product not found.");
    }

    $stmt->close();
} else {
    die("Invalid or missing product ID.");
}

$conn->close();
?>
