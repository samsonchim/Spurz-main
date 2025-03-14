<?php
include_once('config.php');
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $product_id = intval($_POST['id']);
    $user_id = $_SESSION['outlet_id']; 

    $query = "DELETE FROM products WHERE product_id = ? AND outlet_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $product_id, $user_id);
    
    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "error";
    }
}
?>
