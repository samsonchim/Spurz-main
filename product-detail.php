
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

// Get the product ID from the URL
$product_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($product_id > 0) {
    // Fetch product details from the products table
    $sql_product = "SELECT product_id, product_name, product_description, product_category, price, items_in_stock, product_type, meta_tags, live, promote, user_id 
                    FROM products 
                    WHERE product_id = ?";
    
    $stmt = $conn->prepare($sql_product);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result_product = $stmt->get_result();

    if ($result_product->num_rows > 0) {
        $product = $result_product->fetch_assoc();
        $user_id = $product['user_id'];

        // Fetch phone number from the outlets table based on user_id
        $sql_outlet = "SELECT phone_no 
                       FROM outlets 
                       WHERE id = ?";
        
        $stmt_outlet = $conn->prepare($sql_outlet);
        $stmt_outlet->bind_param("i", $user_id);
        $stmt_outlet->execute();
        $result_outlet = $stmt_outlet->get_result();

        if ($result_outlet->num_rows > 0) {
            $outlet = $result_outlet->fetch_assoc();
            $phone_no = $outlet['phone_no'];
        } else {
            $phone_no = "Phone number not found";
        }

    } else {
        echo "Product not found";
        exit;
    }

  

} else {
    echo "Invalid product ID";
}

$conn->close();
?>


<!DOCTYPE html>
<html lang="en">

<head>
	
	<!-- Title -->
	<title>Spurz - Product Details</title>

	<!-- Meta -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, minimal-ui, viewport-fit=cover">
	<meta name="theme-color" content="#FE4487">
	<meta name="author" content="DexignZone">
	<meta name="robots" content="index, follow"> 
	<meta name="keywords" content="android, ios, mobile, application template, progressive web app, ui kit, multiple color, dark layout">
	<meta name="description" content="Revolutionize your online store with our Ecommerce App Template. Seamless shopping, secure payments, and personalized recommendations for an exceptional user experience">
	<meta property="og:title" content="Spurz: Buy Cheap">
	<meta property="og:description" content="Revolutionize your online store with our Ecommerce App Template. Seamless shopping, secure payments, and personalized recommendations for an exceptional user experience.">
	<meta property="og:image" content="https://wedo.dexignzone.com/xhtml/social-image.png">
	<meta name="format-detection" content="telephone=no">

	<!-- Favicons Icon -->
	<link rel="shortcut icon" type="image/x-icon" href="assets/images/favicon.png">
	
	<!-- PWA Version -->
	<link rel="manifest" href="manifest.json">
    
    <!-- Global CSS -->
	<link href="assets/vendor/bootstrap-select/dist/css/bootstrap-select.min.css" rel="stylesheet">
	<link rel="stylesheet" href="assets/vendor/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css">
	<link rel="stylesheet" href="assets/vendor/swiper/swiper-bundle.min.css">
    
	<!-- Stylesheets -->
    <link rel="stylesheet" class="main-css" type="text/css" href="assets/css/style.css">
	
    <!-- Google Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">


</head>   
<body class="bg-white">
<div class="page-wrapper">
    
	<!-- Preloader -->
	<div id="preloader">
		<div class="loader">
			<div class="cart"></div><div></div></div>
		</div>
	</div> 
    <!-- Preloader end-->
	
	<!-- Header -->
	<header class="header transparent header-fixed">
    <div class="container">
        <div class="header-content">
            <div class="left-content">
                <a href="javascript:void(0);" class="back-btn">
                    <i class="icon feather icon-chevron-left"></i>
                </a>
            </div>
            <div class="mid-content">
            </div>
            <div class="right-content">
                <a href="javascript:void(0);" class="item-bookmark" id="likeButton">
                    <svg id="heartIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</header>
	<!-- Header -->
	
	<!-- Page Content Start -->
	<div class="page-content p-b50">
		<div class="container p-0">
			<div class="dz-product-preview">
				<div class="swiper product-detail-swiper">
					<div class="swiper-wrapper">
						<div class="swiper-slide">
							<div class="dz-media">
							<img src="<?= "outlet/php/uploads/{$product_id}_(1).png"; ?>" alt="">
							</div>
						</div>
						<div class="swiper-slide">
							<div class="dz-media">
							<img src="<?= "outlet/php/uploads/{$product_id}_(2).png"; ?>" alt="">
							</div>
						</div>
						<div class="swiper-slide">
							<div class="dz-media">
							<img src="<?= "outlet/php/uploads/{$product_id}_(3).png"; ?>" alt="">
							</div>
						</div>
						
					</div>
					<div class="swiper-pagination"></div>
				</div>
			</div>
			<div class="container">
    <div class="dz-product-detail">
        <div class="detail-content">
            <span class="brand-tag"><?= isset($product['product_category']) ? $product['product_category'] : ''; ?></span>
            <h6><?= isset($product['product_name']) ? $product['product_name'] : 'Product name not available'; ?></h6>
        </div>
        <div class="dz-review-meta mb-3">
          </div>
        <div class="divider border"></div>
        <h6>Description</h6>
        <p><?= isset($product['product_description']) ? $product['product_description'] : 'No description available.'; ?></p>
    </div>

</div>
<!---
<div class="divider border"></div>
  <div class="container mt-5 mb-5">
    <div class="d-flex justify-content-center row">
        <div class="d-flex flex-column col-md-8">
			 <h6 class="review"><i class="fa-solid fa-star me-1"></i>46 Likes <span>(5 review(s))</span></h6>
             <div class="d-flex flex-row align-items-center text-left comment-top p-2 bg-white border-bottom px-1">
                 Comment input section 
                <input type="text" id="comment-input" class="form-control mr-4" placeholder="Add comment">
            </div>
            <button class="btn btn-primary" id="submit-comment" type="button">Comment</button>

            <div class="coment-bottom bg-white p-2 px-4">
                <h4>Comments</h4><br>
                    <div id="comment-section">
                        <?php include 'php/load_comments.php'; ?>
                        Comments will be dynamically added here -->
                    </div>
                </div>

                <!-- Additional comments go here -->
            </div>
        </div>
    </div>
</div>

 <br><br>       
<!-- Footer Start -->
<div class="footer fixed bg-white border-top">
    <div class="container py-2">
        <div class="total-cart">
            <div class="price-area">
			<h3 class="price">
				<?= isset($product['price']) ? '₦' . $product['price'] : 'Invalid Price, Contact Vendor.'; ?>
				<del>₦<?= isset($product['price']) ? ($product['price'] * 1.2) : 'Invalid'; ?></del>
			</h3>
			<a href="outlet.php?id=<?= $user_id; ?>">Open Vendors Outlets</a>
            </div>
            <a href="https://api.whatsapp.com/send?phone=<?= urlencode($phone_no); ?>&text=Hello,I%20am%20interested%20in%20the%20<?= urlencode($product['product_name']); ?>%20listed%20on%20Spurz" class="btn btn-primary">Buy on WhatsApp</a>
        </div>
    </div>
</div>

	<!-- Footer End -->
</div>  
<!--**********************************
    Scripts
***********************************-->

<script>

    //Product Like
    document.getElementById('likeButton').addEventListener('click', function () {
        const productId = <?php echo $product['product_id']; ?>;
        const userId = <?php echo $product['user_id']; ?>;

        // Check if the like is already stored in local storage
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];

        if (!likedProducts.includes(productId)) {
            // Make AJAX request to update the like
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "php/like_product.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // Add the product ID to local storage to prevent multiple likes
                    likedProducts.push(productId);
                    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));

                    // Change the heart icon to filled
                    document.getElementById('heartIcon').style.fill = 'red';
                }
            };
            xhr.send(`product_id=${productId}&user_id=${userId}`);
        } else {
            alert('You have already liked this product.');
        }
    });

    // Check on page load if the product is already liked
    window.onload = function () {
        const productId = <?php echo $product['product_id']; ?>;
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];

        if (likedProducts.includes(productId)) {
            document.getElementById('heartIcon').style.fill = 'red';
        }
    };

//Product Review
    document.getElementById('submit-comment').addEventListener('click', function () {
    var comment = document.getElementById('comment-input').value;
    if (comment.trim() !== "") {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "php/submit_comment.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById('comment-input').value = ''; // Clear input field
                document.getElementById('comment-section').innerHTML += xhr.responseText; // Append the new comment
            }
        };
        xhr.send("comment=" + encodeURIComponent(comment));
    } else {
        alert("Please enter a comment.");
    }
});

</script>
<script src="assets/js/jquery.js"></script>
<script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="assets/vendor/swiper/swiper-bundle.min.js"></script><!-- Swiper -->
<script src="assets/vendor/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js"></script><!-- Swiper -->
<script src="assets/js/dz.carousel.js"></script><!-- Swiper -->
<script src="assets/js/settings.js"></script>
<script src="assets/js/custom.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js" integrity="sha512-Ysw1DcK1P+uYLqprEAzNQJP+J4hTx4t/3X2nbVwszao8wD+9afLjBQYjz7Uk4ADP+Er++mJoScI42ueGtQOzEA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</body>

</html>