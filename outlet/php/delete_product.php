<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

session_start();


if (!isset($_SESSION['id'])) {
    header("Location: outlet/signup.html");
    exit();
}

// Retrieve user ID from the session
$user_id = $_SESSION['id'];

// Get the JSON input data
$data = json_decode(file_get_contents("php://input"), true);

// Check if product_id is provided
if (isset($data['product_id'])) {
    $product_id = $data['product_id'];

    // SQL query to delete the product from the database
    $sql = "DELETE FROM products WHERE product_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $product_id);

    if ($stmt->execute()) {
        // If the query is successful
        echo json_encode(['success' => true]);
    } else {
        // If there was an error
        echo json_encode(['success' => false, 'message' => 'Failed to delete product']);
    }

    $stmt->close();
} else {
    // If product_id was not provided
    echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
}

$conn->close();
?>
