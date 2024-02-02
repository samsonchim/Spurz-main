<?php
// Include your database connection code here
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Sellbizzhub";

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

// Fetch the first two recent products for the logged-in user
$sql = "SELECT product_name, product_category, price FROM products WHERE user_id = ? ORDER BY product_id DESC LIMIT 2";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Create an array to store product information
    $products = [];

    // Add product information to the array
    while ($row = $result->fetch_assoc()) {
        $products[] = [
            'product_name' => $row['product_name'],
            'product_category' => $row['product_category'],
            'price' => $row['price'],
        ];
    }

    // Output JSON response for debugging
    header('Content-Type: application/json');
    echo json_encode($products, JSON_PRETTY_PRINT);

    // Close the statement
    $stmt->close();
} else {
    echo "Error preparing the statement: " . $conn->error;
}

// Close the database connection
$conn->close();
?>
