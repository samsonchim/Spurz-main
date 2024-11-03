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

// Fetch the search term from the AJAX request
$searchTerm = $_POST['search'];

// Search query to look for the term in each column of the products table
$sql = "SELECT * FROM products WHERE 
        product_name LIKE '%$searchTerm%' 
        OR product_description LIKE '%$searchTerm%' 
        OR product_category LIKE '%$searchTerm%' 
        OR price LIKE '%$searchTerm%' 
        OR items_in_stock LIKE '%$searchTerm%' 
        OR product_type LIKE '%$searchTerm%' 
        OR meta_tags LIKE '%$searchTerm%' 
        OR user_id LIKE '%$searchTerm%'";

// Execute the query and check for results
$result = $conn->query($sql);

// If matches are found, output them; otherwise, fetch the 15 most recent products
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo '
        <div class="col-6">
            <div class="shop-card">
                <div class="dz-media">
                    <img src="' . $row['image_url'] . '" alt="image">    
                    <a href="javascript:void(0);" class="item-bookmark">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </a>
                </div>
                <div class="dz-content">
                    <h6 class="title mb-1"><a href="product-detail.html?id=' . $row['product_id'] . '">' . $row['product_name'] . '</a></h6>
                    <span class="font-12 brand-tag">' . $row['product_category'] . '</span>
                    <h6 class="price mb-2">$' . $row['price'] . '<del>$' . ($row['price'] * 1.5) . '</del></h6> <!-- Adjust this for the original price if necessary -->
                    <div class="dz-review-meta">
                        <h6 class="review">4.5<i class="fa-solid fa-star ms-1"></i><span>(265 Review)</span></h6> <!-- Placeholder review -->
                    </div>
                </div>
            </div>
        </div>
        ';
    }
} else {
    // Fetch the 15 most recent products if no matches are found
    $sql_recent = "SELECT * FROM products ORDER BY product_id DESC LIMIT 15";
    $result_recent = $conn->query($sql_recent);

    if ($result_recent->num_rows > 0) {
        while ($row = $result_recent->fetch_assoc()) {
            echo '
            <div class="col-6">
                <div class="shop-card">
                    <div class="dz-media">
                        <img src="' . $row['image_url'] . '" alt="image">    
                        <a href="javascript:void(0);" class="item-bookmark">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </a>
                    </div>
                    <div class="dz-content">
                        <h6 class="title mb-1"><a href="product-detail.html?id=' . $row['product_id'] . '">' . $row['product_name'] . '</a></h6>
                        <span class="font-12 brand-tag">' . $row['product_category'] . '</span>
                        <h6 class="price mb-2">$' . $row['price'] . '<del>$' . ($row['price'] * 1.5) . '</del></h6> <!-- Adjust this for the original price if necessary -->
                        <div class="dz-review-meta">
                            <h6 class="review">4.5<i class="fa-solid fa-star ms-1"></i><span>(265 Review)</span></h6> <!-- Placeholder review -->
                        </div>
                    </div>
                </div>
            </div>
            ';
        }
    } else {
        echo "<p>No products found.</p>";
    }
}

$conn->close();
?>
