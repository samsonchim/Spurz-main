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
    // Redirect to signup page if not logged in
    header("Location: outlet/signup.html");
    exit();
}

// Retrieve user ID from the session
$user_id = $_SESSION['id'];

// Delete records related to the user's session ID
$deleteSql = "DELETE FROM outlets WHERE id = '$user_id'";

if ($conn->query($deleteSql) === TRUE) {
    // Redirect to signup page
    header("Location: outlet/signup.html");
    exit();
} else {
    echo "Error deleting records: " . $conn->error;
}

// Close the database connection
$conn->close();
?>
