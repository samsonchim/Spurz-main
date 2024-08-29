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

// Get the product ID and user ID from the POST request
$product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;

if ($product_id > 0 && $user_id > 0) {
    // Check if the product is already liked by the user
    $sql_check = "SELECT likes FROM product_likes WHERE product_id = ? AND user_id = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("ii", $product_id, $user_id);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows > 0) {
        // Update the existing like count
        $sql_update = "UPDATE product_likes SET likes = likes + 1, timestamp = NOW() WHERE product_id = ? AND user_id = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("ii", $product_id, $user_id);
        $stmt_update->execute();
    } else {
        // Insert a new like record
        $sql_insert = "INSERT INTO product_likes (product_id, likes, user_id, timestamp) VALUES (?, 1, ?, NOW())";
        $stmt_insert = $conn->prepare($sql_insert);
        $stmt_insert->bind_param("ii", $product_id, $user_id);
        $stmt_insert->execute();
    }

    echo "Like recorded successfully.";
} else {
    echo "Invalid product ID or user ID.";
}

$conn->close();
?>
