<?php
// Include your database connection code here
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Start session
session_start();

// Check if the user is logged in
if (!isset($_SESSION['id'])) {
    // Redirect to the login page if not logged in
    header("Location: login.html");
    exit();
}

// Retrieve user ID from the session
$user_id = $_SESSION['id'];

if (isset($_GET['product_id'])) {
    $product_id = $_GET['product_id'];

    // Verify that the product belongs to the logged-in user
    $sql = "SELECT * FROM products WHERE product_id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $product_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Delete the product
        $sql = "DELETE FROM products WHERE product_id = ? AND user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $product_id, $user_id);
        if ($stmt->execute()) {
            echo "Product deleted successfully.";
        } else {
            echo "Error deleting product: " . $conn->error;
        }
    } else {
        echo "Product not found or you do not have permission to delete this product.";
    }

    $stmt->close();
} else {
    echo "No product ID provided.";
}

// Close the database connection
$conn->close();
?>
