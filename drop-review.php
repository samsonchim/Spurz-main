<!DOCTYPE html>
<html lang="en">

<head>
	
    <!-- Title -->
	<title>Drop a Review</title>

	<!-- Meta -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, minimal-ui, viewport-fit=cover">
	<meta name="theme-color" content="#FE4487">
	<meta name="author" content="DexignZone">
	<meta name="robots" content="index, follow"> 
	<meta name="keywords" content="android, ios, mobile, application template, progressive web app, ui kit, multiple color, dark layout">
	<meta name="description" content="Revolutionize your online store with our Ecommerce App Template. Seamless shopping, secure payments, and personalized recommendations for an exceptional user experience">
	<meta property="og:title" content="Wedo - Ecommerce Mobile App Template ( Bootstrap + PWA )">
	<meta property="og:description" content="Revolutionize your online store with our Ecommerce App Template. Seamless shopping, secure payments, and personalized recommendations for an exceptional user experience.">
	<meta property="og:image" content="social-image.png">
	<meta name="format-detection" content="telephone=no">

	<!-- Favicons Icon -->
	<link rel="shortcut icon" type="image/x-icon" href="assets/images/favicon.png">
    
	<!-- Globle Stylesheets -->
    
	<!-- Stylesheets -->
    <link rel="stylesheet" class="main-css" type="text/css" href="assets/css/style.css">
    
    <!-- Google Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com/">
	<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&amp;family=Poppins:wght@100;200;300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet">

</head>   
<body>
<div class="page-wrapper">
	<!-- Preloader -->
	<div id="preloader">
		<div class="loader">
			<div class="load-circle"><div></div><div></div></div>
		</div>
	</div>
    <!-- Preloader end-->

    <!-- Page Content -->
    <div class="page-content">
		<div class="account-box">
			<div class="container">
				<div class="logo-area">
					<img class="logo-dark" src="assets/images/logo.png" alt="">
					<img class="logo-light" src="assets/images/logo-white.png" alt="">
				</div>
				<div class="section-head ps-0">
					<h2>Hello</h2>
					<p>Drop a review for this product!</p>
				</div>
				<div class="account-area">
					<form action="php/submit_review.php" method="POST">
						<div class="mb-3">
							<label class="form-label" for="name">Your Name</label>
							<input type="text" id="name" name="name" class="form-control" placeholder="Mark Jhonson" required>
						</div>
				
						<div class="mb-3">
							<label class="form-label" for="transaction_id">Transaction ID</label>
							<input type="text" id="transaction_id" name="transaction_id" class="form-control" placeholder="This will help us confirm you actually bought the product" required>
						</div>
				
						<div class="mb-3">
							<label class="form-label" for="review">Review</label>
							<textarea id="review" name="review" class="form-control" placeholder="What do you think about this product?" required></textarea>
						</div>
				
						<input type="hidden" name="product_id" value="<?php echo $_GET['id']; ?>">
				
						<button type="submit" class="btn mb-3 btn-primary w-100">Send</button>
					</form>  
				</div>
				
				</div>
			</div>
        </div>
    </div>
    <!-- Page Content End -->
    
</div>
<!--**********************************
    Scripts
***********************************-->
<script src="assets/js/jquery.js"></script>
<script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="assets/vendor/swiper/swiper-bundle.min.js"></script><!-- Swiper -->
<script src="assets/js/dz.carousel.js"></script><!-- Swiper -->
<script src="assets/js/settings.js"></script>
<script src="assets/js/custom.js"></script>
</body>

</html>