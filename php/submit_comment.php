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

// Simulate a user_id for demonstration (replace with actual user ID logic)
$user_id = 7;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['comment'])) {
    $comment = $conn->real_escape_string($_POST['comment']);
    $timestamp = date("Y-m-d H:i:s");

    // Insert comment into database
    $sql = "INSERT INTO product_reviews (user_id, review, timestamp) VALUES ('$user_id', '$comment', '$timestamp')";
    if ($conn->query($sql) === TRUE) {
        // Return the newly added comment
        echo "<div class='commented-section mt-2'>
                <div class='d-flex flex-row align-items-center commented-user'>
                    <h6 class='mr-2'>Your Name</h6> <!-- Replace with actual user name -->
                    <span class='mb-1 ml-2'>$timestamp</span>
                </div>
                <div class='comment-text-sm'>
                    <span>$comment</span>
                </div>
              </div>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
