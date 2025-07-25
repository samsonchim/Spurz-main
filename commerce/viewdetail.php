<!--  -->
<?php include_once('./includes/headerNav.php'); ?>
<?php include_once('./includes/updateviews.php'); ?>
<?php require_once './includes/topheadactions.php'; ?>
<?php require_once './includes/mobilenav.php'; ?>

<!-- get tables data from db -->

<header>
  <!-- top head action, search etc in php -->
  <!-- inc/topheadactions.php -->
  <?php require_once './includes/topheadactions.php'; ?>
  <!-- desktop navigation -->
  <!-- inc/desktopnav.php -->
  <?php require_once './includes/desktopnav.php' ?>
  <!-- mobile nav in php -->
  <!-- inc/mobilenav.php -->
  <?php require_once './includes/mobilenav.php'; ?>

</header>

<!-- check for table and then get specific data from table -->
<?php
$product_ID = $_GET['id'];
$product_category = $_GET['category'];

$product_name = '';
$product_price = '';
$whatsapp_no = '';
$product_author = '';
$views = 0; // Initialize views count

if ($product_category == "deal_of_day") {
    $item = get_deal_of_day_by_id($product_ID);
} else {
    // Get specific item from table
    $item = get_product($product_ID);
}

// Get product data
$row = mysqli_fetch_assoc($item);

// Assign product name and price before creating the WhatsApp message
$product_name = $row['product_title'];
$product_price = $row['product_price'];
$discounted_price = $product_price + ($product_price * 0.15);

$discounted_price = number_format($discounted_price, 0, '.', '');

// Get product views count
$views = $row['views']; // Store views in a variable

// Get outlet_id associated with the product
$outlet_id = $row['outlet_id'];

// Fetch WhatsApp number and product_author from outlets table
$query = $conn->prepare("SELECT whatsapp_no, outlet_name FROM outlets WHERE id = ?");
$query->bind_param("i", $outlet_id);
$query->execute();
$query->bind_result($whatsapp_no, $product_author);
$query->fetch();
$query->close();

// Encode message for WhatsApp URL (after product_name is set)
$whatsapp_message = urlencode("Hello, $product_author, I am interested in the $product_name I found on Spurz.");
?>

<!-- Adding to cart -->
<div class="content">
    <form action="manage_cart.php" method="post" class='view-form'>

        <div class="product_deatail_container">

            <!-- Image is kept hidden for submission -->
            <input type="hidden" name="product_img" value="<?php echo $row['product_img'] ?>">

            <?php include_once './product.php'; ?>

            <div class="product_detail_box">
                <h3 class="product-detail-title">
                    <?php echo strtoupper($row['product_title']) ?>
                </h3><hr>
                <div class="product_views">
                    <i class="fas fa-eye"></i> 
                    <span><?php echo number_format($views); ?> Views</span>
                </div>

                <div class="prouduct_information">
                    <div class="product_description">
                        <div class="product_title"><strong>Name:</strong></div>
                        <div class="product_detail">
                            <?php 
                                $product_name = $row['product_title'];
                                $product_price = $row['product_price'];
                                echo ucfirst($product_name); 
                                $description = $row['product_desc'];
                            ?>
                            <input type="hidden" name='product_name' id='product_name' value="<?php echo $product_name; ?>">
                        </div>
                    </div>
                    <div class="product_description">
                       
                        <div class="product_detail">
                            <?php echo $description; ?>
                        </div>
                    </div>

                    <div class="product_description">
                        <div class="product_title"><strong>Price:</strong></div>
                        <div class="product_detail">
                            <div class="price-box">
                                <p class="price">N<?php echo $product_price; ?></p>
                                <input type="hidden" name="product_price" value="<?php echo $product_price; ?>">
                                <input type="hidden" id="product_identity" name="product_id" value="<?php echo $row['product_id']; ?>">
                                <input type="hidden" name="product_category" value="<?php echo $product_category; ?>">

                                <del>N<?php echo number_format($discounted_price, 0, '.', ''); ?></del>
                            </div>
                            
                        </div>
                    </div>
                </div>
                

                <div class="product_counter_box">
                    <div class="buy-and-cart-btn">
                        <?php if (!empty($whatsapp_no)): ?>
                            <a href="https://wa.me/<?php echo $whatsapp_no; ?>?text=<?php echo $whatsapp_message; ?>" target="_blank">
                                <button type="button" class="btn_product_cart">
                                    Buy Now
                                </button>
                            </a>
                        <?php else: ?>
                            <button type="button" class="btn_product_cart" disabled>
                                WhatsApp number not available
                            </button>
                        <?php endif; ?>
                       
                    </div>
                </div>
                <h5>Reviews</h5>
                <div id="reviewsContainer">
                    <p>Loading reviews...</p>
                </div>

            </div>
        </div>
    </form>
  
</div>


<style>
  .product_views {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #555;
    margin-top: 5px;
}

.product_views i {
    margin-right: 5px;
    color: #ff9800; /* Eye icon color */
}

</style>

<!--  -->

<!--  -->


<script>
    // Utility to escape HTML special characters
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Fetch and display reviews on page load
    document.addEventListener("DOMContentLoaded", function() {
        const productId = <?php echo json_encode($row['product_id']); ?>;
        fetchReviews(productId);
    });

    function fetchReviews(productId) {
        fetch(`includes/productReviews.php?product_id=${productId}`)
            .then(response => response.json())
            .then(data => {
                let reviewsContainer = document.getElementById("reviewsContainer");
                reviewsContainer.innerHTML = "";

                if (data.status === "success" && Array.isArray(data.reviews) && data.reviews.length > 0) {
                    data.reviews.forEach(review => {
                        let reviewItem = document.createElement("div");
                        reviewItem.classList.add("review-item");
                        reviewItem.innerHTML = `
                            <p><strong>${escapeHtml(review.customer_name)}</strong></p>
                            <p>${escapeHtml(review.review)}</p>
                            <hr>
                        `;
                        reviewsContainer.appendChild(reviewItem);
                    });
                } else {
                    reviewsContainer.innerHTML = `<p>No reviews available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
                document.getElementById("reviewsContainer").innerHTML = `<p>Error loading reviews.</p>`;
            });
    }
</script>
<?php require_once './includes/footer.php'; ?>