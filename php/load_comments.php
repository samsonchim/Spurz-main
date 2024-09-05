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

// Fetch all comments from the database
$sql = "SELECT product_reviews.review, product_reviews.timestamp, product_reviews.username 
        FROM product_reviews 
        ORDER BY product_reviews.timestamp DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output each comment
    while($row = $result->fetch_assoc()) {
        echo "<div class='commented-section mt-2'>
                <div class='d-flex flex-row align-items-center commented-user'>
                    <h6 class='mr-2'>" . htmlspecialchars($row['username']) .   "</h6><br>
                  <strong>  <p class='mb-1 ml-2'> (" . htmlspecialchars($row['timestamp']) . ")</p>
                </div> 
                <div class='comment-text-sm'>
                    <p>" . htmlspecialchars($row['review']) . "</p>
                </div>
              </div>";
    }
} else {
    echo "<div class='commented-section mt-2'><div class='comment-text-sm'>No comments yet. Be the first to comment!</div></div>";
}

$conn->close();
?>
