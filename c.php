
<div class="divider border"></div>
    <h1>Product Reviews</h1>
    <div id="reviews-container">
        <?php
        // Database connection
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "spurz";

        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Fetch product ID from URL
        $product_id = $_GET['id'] ?? '';

        if (!empty($product_id)) {
            // Fetch reviews for the product ID
            $stmt = $conn->prepare("SELECT name, review, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC");
            $stmt->bind_param("i", $product_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo '<div class="review">';
                    echo '<h4>' . htmlspecialchars($row['name']) . '</h4>';
                    echo '<p>' . htmlspecialchars($row['review']) . '</p>';
                    echo '<small>Reviewed on: ' . date('F j, Y', strtotime($row['created_at'])) . '</small>';
                    echo '</div>';
                }
            } else {
                echo '<p>No reviews yet.</p>';
            }

            $stmt->close();
        } else {
            echo '<p>Invalid product ID.</p>';
        }

        // Close connection
        $conn->close();
        ?>
    </div>