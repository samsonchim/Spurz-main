<?php
// Include your database connection code here
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

// Start session
session_start();

// Check if the user is logged in
if (isset($_SESSION['id'])) {
    $userid = $_SESSION['id'];

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM outlets WHERE id = ?";
    $stmt = mysqli_prepare($conn, $sql);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "i", $userid);

        if (mysqli_stmt_execute($stmt)) {
            $result = mysqli_stmt_get_result($stmt);

            // Fetch and display user records
            while ($row = mysqli_fetch_assoc($result)) {
                $name = $row['name'];
                $email = $row['email'];
            }
        } else {
            echo "Error executing the statement: " . mysqli_error($conn);
        }

        // Close the statement
        mysqli_stmt_close($stmt);
    } else {
        echo "Error preparing the statement: " . mysqli_error($conn);
    }

    // Close the database connection
    mysqli_close($conn);
} else {

    $name = "";
    $email = "";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	
	<!-- Title -->
	<title>Spurz - Buy Cheap</title>

	<!-- Meta -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, minimal-ui, viewport-fit=cover">
	<meta name="theme-color" content="#81D5CC">
	<meta name="author" content="Spurz">
	<meta name="robots" content="index, follow"> 
	<meta name="keywords" content="Buy cheap, buy nearby, sell your products, sell on whatsapp, social media seller, cheap marketplace">
	<meta name="description" content="Spurz functions as an online marketplace facilitating the seamless sale of products for businesses of varying sizes, ranging from small enterprises to larger corporations. Our platform serves as a nexus connecting sellers with potential buyers, streamlining the entire process of commerce.">
	<meta property="og:title" content="Spurz - Sell Effortlessly, Buy Cheaper">
	<meta property="og:description" content="Spurz is an online marketplace where sellers of all sizes can effortlessly connect with buyers, streamlining the buying and selling process.">
	<meta property="og:image" content="assets/images/og-image.png">
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
<body>
<div class="page-wrapper">
    
	<!-- Preloader -->
	<div id="preloader">
		<div class="loader">
			</div><div></div></div>
		</div>
	</div> 
    <!-- Preloader end-->
	
	<!-- Header -->
		<header class="header header-fixed">
			<div class="container">
				<div class="header-content">
					<div class="left-content">
						<a href="javascript:void(0);" class="menu-toggler">
							<i class="icon feather icon-menu"></i>
						</a>
						<h6 class="title font-14">Spurz</h6>
					</div>
					<div class="mid-content header-logo">
					</div>
					<div class="right-content dz-meta">
						<a href="search.html" class="icon">
							<i class="icon feather icon-search"></i>
						</a>
						
						<a href="cart.html" class="icon shopping-cart">
						<i class="icon feather icon-heart"></i>
							<span class="badge badge-primary">3</span>
						</a>
					</div>
				</div>
			</div>
		</header>
	<!-- Header -->
	
	<!-- Sidebar -->
    <div class="dark-overlay"></div>
	<div class="sidebar">
		<div class="inner-sidebar">
			<a href="profile.html" class="author-box">
			
				<div class="dz-info">
					<h5 class="name"><?php echo $name ?></h5>
					<span><?php echo $email?></span>
				</div>
			</a>
			<ul class="nav navbar-nav">	
				<li>
					<a class="nav-link active" href="index.html">
						<span class="dz-icon">
							<i class="icon feather icon-home"></i>
						</span>
						<span>Home</span>
					</a>
				</li>
				<li>
					<a class="nav-link" href="product-list.html">
						<span class="dz-icon">
							<i class="icon feather icon-layers"></i>
						</span>
						<span>Products</span>
					</a>
				</li>
				<li>
					<a class="nav-link" href="featured.html">
						<span class="dz-icon">
							<i class="icon feather icon-list"></i>
						</span>
						<span>Featured</span>
					</a>
				</li>
				<li>
					<a class="nav-link" href="wishlist.html">
						<span class="dz-icon">
							<i class="icon feather icon-heart"></i>
						</span>
						<span>Wishlist</span>
					</a>
				</li>
				<li>
					<a class="nav-link" href="order.html">
						<span class="dz-icon">
							<i class="icon feather icon-repeat"></i>
						</span>
						<span>Orders</span>
					</a>
				</li>

				<li>
					<a class="nav-link" href="onboarding.html">
						<span class="dz-icon">
							<i class="icon feather icon-log-out"></i>
						</span>
						<span>Logout</span>
					</a>
				</li>
			</ul>
			<div class="sidebar-bottom">
				<ul class="app-setting">
				
					<li>
						<div class="mode">
							<span class="dz-icon">                        
								<i class="icon feather icon-moon"></i>
							</span>					
							<span>Dark Mode</span>
							<div class="custom-switch">
								<input type="checkbox" class="switch-input theme-btn" id="toggle-dark-menu">
								<label class="custom-switch-label" for="toggle-dark-menu"></label>
							</div>					
						</div>
					</li>
					
				</ul>
				<div class="app-info">
					<h6 class="name">Spurz</h6>
					<span class="ver-info">issue@spurz.domain</span>
				</div>
			</div>
		</div>
	</div>
    <!-- Sidebar End -->
	
	<!-- Page Content Start -->
	<div class="page-content space-top p-b65">
		<div class="container py-0">
			<!-- Banner 
			<div class="dz-banner">
				<div class="swiper banner-swiper">
					<div class="swiper-wrapper">
						<div class="swiper-slide">
							<div class="dz-media">
								<img src="assets/images/banner/pic1.png" alt="">
							</div>	
						</div>
						<div class="swiper-slide">
							<div class="dz-media">
								<img src="assets/images/banner/pic2.png" alt="">
							</div>	
						</div>
						<div class="swiper-slide">
							<div class="dz-media">
								<img src="assets/images/banner/pic3.png" alt="">
							</div>	
						</div>
					</div>
					<div class="swiper-pagination style-2"></div>
				</div>
			</div>
			 Banner End -->
			
			<!-- Catagory Start -->
			<div class="category-area">
				<ul class="row g-3">
					<li class="category-item col-3">
						<a href="category.html">
							<div class="media media-55">
								<img src="assets/images/category/fashion.png" alt="">
							</div>
							<span>Fashion</span>
						</a>
					</li>
					<li class="category-item col-3">
						<a href="category.html">
							<div class="media media-55">
								<img src="assets/images/category/electronics.png" alt="">
							</div>
							<span>Electronics</span>
						</a>
					</li>
					<li class="category-item col-3">
						<a href="category.html">
							<div class="media media-55">
								<img src="assets/images/category/fashion.png" alt="">
							</div>
							<span>Fashion</span>
						</a>
					</li>
					<li class="category-item col-3">
						<a href="category.html">
							<div class="media media-55">
								<img src="assets/images/category/furniture.png" alt="">
							</div>
							<span>Furniture</span>
						</a>
					</li>
					<li class="category-item col-3">
						<a href="category.html">
							<div class="media media-55">
								<img src="assets/images/category/grocery.png" alt="">
							</div>
							<span>Grocery</span>
						</a>
					</li>
					<li class="category-item col-3">
						<a href="category.html">
							<div class="media media-55">
								<img src="assets/images/category/appliances.png" alt="">
							</div>
							<span>Appliances</span>
						</a>
					</li>
					<li class="category-item col-3">
						<a href="category.html">
							<div class="media media-55">
								<img src="assets/images/category/toys.png" alt="">
							</div>
							<span>Toys</span>
						</a>
					</li>
					<li class="category-item col-3">
						<a href="category.html">
							<div class="media media-55 icon justify-content-center">
								<i class="fa-solid fa-ellipsis"></i>
							</div>
							<span>More</span>
						</a>
					</li>
				</ul>
			</div>
			<!-- Catagory End -->
			
			<!-- ComingSoon start -->
			<div class="dz-coming-soon" style="background-image: url('assets/images/background/bg2.png'); background-position: center; background-size: cover;">
				<div class="media media-55 me-5">
					<img src="assets/images/offer/pic1.png" alt="">	
				</div>
				<div class="offer-content">
					<span class="text-white">Sales end in</span>
					<div class="countdown-timer">
						<div class="countdown">
							<div class="date">
								<span class="time" id="hour">00</span>
								<span class="text">hrs</span>
							</div>
							<div class="date">
								<span class="time" id="min">00</span>
								<span class="text">Mins</span>
							</div>
							<div class="date">
								<div class="time lost" id="second">00</div>
								<span class="text">Secs</span>
							</div>
						</div>
					</div>
				</div>	
			</div>	
			<!-- ComingSoon End -->
			
			<div class="title-bar">
				<h6 class="title mb-0">Most Popular</h6>
				<a href="product.html">View all <i class="icon feather icon-chevron-right"></i></a>
			</div>
			
			<!-- Shop Section Strat -->
			<div class="swiper product-swiper">
				<div class="swiper-wrapper">
					<div class="swiper-slide">
						<div class="shop-card">
							<div class="dz-media">
								<a href="product-detail.html">
									<img src="assets/images/product/pic1.jpg" alt="image">	
								</a>
							</div>
							<div class="dz-content">
								<h6 class="title font-12"><a href="product-detail.html">Peter England cassual</a></h6>
								<h6 class="price">$45.00<del>$50.15</del></h6>
							</div>
						</div>
					</div>
					<div class="swiper-slide">
						<div class="shop-card">
							<div class="dz-media">
								<a href="product-detail.html">
									<img src="assets/images/product/pic2.jpg" alt="image">	
								</a>
							</div>
							<div class="dz-content">
								<h6 class="title title font-12"><a href="product-detail.html">Zip-Front Track Jacket</a></h6>
								<h6 class="price">$23.12<del>$30.15</del></h6>
							</div>
						</div>
					</div>
					<div class="swiper-slide">
						<div class="shop-card">
							<div class="dz-media">
								<a href="product-detail.html">
									<img src="assets/images/product/pic3.jpg" alt="image">	
								</a>
							</div>
							<div class="dz-content">
								<h6 class="title font-12"><a href="product-detail.html">Louis Vuitton Jacket..</a></h6>
								<h6 class="price">$155.30<del>$200.12</del></h6>
							</div>
						</div>
					</div>
					<div class="swiper-slide">
						<div class="shop-card">
							<div class="dz-media">
								<a href="product-detail.html">
									<img src="assets/images/product/pic4.jpg" alt="image">	
								</a>
							</div>
							<div class="dz-content">
								<h6 class="title font-12 "><a href="product-detail.html">Zip-Front Track Jacket</a></h6>
								<h6 class="price">$250.00<del>$300.25</del></h6>
							</div>
						</div>
					</div>
					<div class="swiper-slide">
						<div class="shop-card">
							<div class="dz-media">
								<a href="product-detail.html">
									<img src="assets/images/product/pic5.jpg" alt="image">	
								</a>
							</div>
							<div class="dz-content">
								<h6 class="title font-12"><a href="product-detail.html">Peter England cassual</a></h6>
								<h6 class="price">$25.15<del>$30.15</del></h6>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Shop Section End -->
			
			<!-- Product offer Start -->
			<div class="product-offer">
				<div class="row g-3">
					<div class="col-4">
						<a href="product-detail.html">
							<div class="shop-card style-3">
								<div class="dz-media">
									<img src="assets/images/product/pic9.png" alt="image">	
								</div>
								<div class="dz-content">
									<span class="offer">Headphones</span>
									<h6 class="title">Up to 80% off</h6>
								</div>
							</div>
						</a>
					</div>
					<div class="col-4">
						<a href="product-detail.html">
							<div class="shop-card style-3">
								<div class="dz-media">
									<img src="assets/images/product/pic10.png" alt="image">	
								</div>
								<div class="dz-content">
									<span class="offer">Mobile Phones</span>
									<h6 class="title">From $1999</h6>
								</div>
							</div>
						</a>
					</div>
					<div class="col-4">
						<a href="product-detail.html">
							<div class="shop-card style-3">
								<div class="dz-media">
									<img src="assets/images/product/pic11.png" alt="image">	
								</div>
								<div class="dz-content">
									<span class="offer">Laptops</span>
									<h6 class="title">Up to 50% off</h6>
								</div>
							</div>
						</a>	
					</div>
				</div>	
			</div>	
			<!-- Product offer End -->
			
			<div class="title-bar">
				<h6 class="title mb-0">Popular Items</h6>
				<a href="product.html">View all <i class="icon feather icon-chevron-right"></i></a>
			</div>
			
			<!-- Product Item list Start -->
			<div class="product-items-list">
				<ul>
					<li>
						<div class="product-items">
							<a href="cart.html">
								<div class="media media-80 me-2">
									<img src="assets/images/product/pic12.png" alt="">
								</div>
							</a>
							<a href="cart.html">	
								<div class="product-content">
									<h6 class="title">Havells Swing Fan</h6>
									<div class="desc">400mm , Blue tone</div>
									<div class="product-footer">
										<span class="offer">20% off</span>
										<span class="price">
											<del>$1500</del>
											$1,299
										</span>
									</div>
								</div>
							</a>
							<a href="cart.html" class="dz-icon"><i class="icon feather icon-shopping-cart"></i></a>
						</div>
					</li>
					<li>
						<div class="product-items">
							<a href="cart.html">
								<div class="media media-80 me-2">
									<img src="assets/images/product/pic13.png" alt="">
								</div>
							</a>
							<a href="cart.html">
								<div class="product-content">
									<h6 class="title">OnePlus Nord 2T 5G</h6>
									<div class="desc">8GB RAM, 128GB Storage</div>
									<div class="product-footer">
										<span class="offer">50% off</span>
										<span class="price">
											<del>$1,500</del>
											$999
										</span>
									</div>
								</div>
							</a>
							<a href="cart.html" class="dz-icon"><i class="icon feather icon-shopping-cart"></i></a>
						</div>
					</li>
					<li>
						<div class="product-items">
							<a href="cart.html">	
								<div class="media media-80 me-2">
									<img src="assets/images/product/pic14.png" alt="">
								</div>
							</a>
							<a href="cart.html">	
								<div class="product-content">
									<h6 class="title">ThinkPad L13 Yoga Gen 3</h6>
									<div class="desc">Dual core , Red tone</div>
									<div class="product-footer">
										<span class="offer">20% off</span>
										<span class="price">
											<del>$2500</del>
											$2299
										</span>
									</div>
								</div>
							</a>
							<a href="cart.html" class="dz-icon"><i class="icon feather icon-shopping-cart"></i></a>
						</div>
					</li>
				</ul>
			</div>
			<!-- Product Item list End -->
			
			<!-- Top Selection Start -->
			<div class="top-selection">
				<div class="title-bar mt-0">
					<h6 class="title text-white">Top Seleciton</h6>
				</div>
				<div class="row g-3">
					<div class="col-6">
						<div class="shop-card">
							<div class="dz-media">
								<a href="product.html">
									<img src="assets/images/product/pic15.png" alt="image">	
								</a>
							</div>
							<div class="dz-content">
								<h6 class="title"><a href="product.html">Wired Earphones</a></h6>
								<span class="offer">upto 50% off</span>
							</div>
						</div>
					</div>
					<div class="col-6">
						<div class="shop-card">
							<div class="dz-media">
								<a href="product.html">
									<img src="assets/images/product/pic10.png" alt="image">	
								</a>
							</div>
							<div class="dz-content">
								<h6 class="title"><a href="product.html">Top Mobiles</a></h6>
								<span class="offer">upto 50% off</span>
							</div>
						</div>
					</div>
					<div class="col-6">
						<div class="shop-card">
							<div class="dz-media">
								<a href="product.html">
									<img src="assets/images/product/pic9.png" alt="image">	
								</a>
							</div>
							<div class="dz-content">
								<h6 class="title"><a href="product.html">Headphones</a></h6>
								<span class="offer">upto 50% off</span>
							</div>
						</div>
					</div>
					<div class="col-6">
						<div class="shop-card">
							<div class="dz-media">
								<a href="product.html">
									<img src="assets/images/product/pic11.png" alt="image">	
								</a>
							</div>
							<div class="dz-content">
								<h6 class="title"><a href="product.html">Best Laptops</a></h6>
								<span class="offer">upto 50% off</span>
							</div>
						</div>
					</div>
				</div>	
			</div>	
			<!-- Top Selection End -->
		</div>
	</div>
	<!-- Page Content End -->
	
	<!-- Menubar -->
	<div class="menubar-area footer-fixed rounded-0 border-top">
		<div class="toolbar-inner menubar-nav">
			<a href="index.html" class="nav-link active">
				<i class="icon feather icon-home"></i>
				<span>Home</span>
			</a>
			<a href="category.html" class="nav-link">
				<i class="icon feather icon-grid"></i>
				<span>Categories</span>
			</a>
			<a href="wishlist.html" class="nav-link">
				<i class="icon feather icon-heart"></i>
				<span>Wishlist</span>
			</a>
			<a href="profile.html" class="nav-link">
				<i class="icon feather icon-user"></i>
				<span>Profile</span>
			</a>
		</div>
	</div>
	<!-- Menubar -->
	<!-- PWA Offcanvas -->
	<div class="offcanvas offcanvas-bottom pwa-offcanvas">
		<div class="container">
			<div class="offcanvas-body small">
				<img class="logo dark" src="A-removebg-preview.png" alt="">
				<img class="logo light" src="A__1_-removebg-preview.png" alt="">
				<h5 class="title">Ajama.ng</h5>
				<p class="pwa-text">Install "Ajama.ng" to your home screen for easy access, just like any other app</p>
				<button type="button" class="btn btn-sm btn-primary pwa-btn">Add to Home Screen</button>
				<button type="button" class="btn btn-sm pwa-close btn-secondary ms-2 text-white">Maybe later</button>
			</div>
		</div>
	</div>
	<div class="offcanvas-backdrop pwa-backdrop"></div>
	<!-- PWA Offcanvas End --> 
	
	
	<!-- Multicolor Canvas Start --> 
	<div class="offcanvas offcanvas-bottom m-3 rounded"  tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
		<div class="offcanvas-body small">
			<ul class="theme-color-settings">
				<li>
					<input class="filled-in" id="primary_color_1" name="theme_color" type="radio" value="color-primary">
					<label for="primary_color_1"></label>
					<span>Default</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_2" name="theme_color" type="radio" value="color-green">
					<label for="primary_color_2"></label>
					<span>Green</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_3" name="theme_color" type="radio" value="color-blue">
					<label for="primary_color_3"></label>
					<span>Blue</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_4" name="theme_color" type="radio" value="color-pink">
					<label for="primary_color_4"></label>
					<span>Pink</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_5" name="theme_color" type="radio" value="color-yellow">
					<label for="primary_color_5"></label>
					<span>Yellow</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_6" name="theme_color" type="radio" value="color-orange">
					<label for="primary_color_6"></label>
					<span>Orange</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_7" name="theme_color" type="radio" value="color-purple">
					<label for="primary_color_7"></label>
					<span>Purple</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_8" name="theme_color" type="radio" value="color-red">
					<label for="primary_color_8"></label>
					<span>Red</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_9" name="theme_color" type="radio" value="color-lightblue">
					<label for="primary_color_9"></label>
					<span>Lightblue</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_10" name="theme_color" type="radio" value="color-teal">
					<label for="primary_color_10"></label>
					<span>Teal</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_11" name="theme_color" type="radio" value="color-lime">
					<label for="primary_color_11"></label>
					<span>Lime</span>
				</li>
				<li>
					<input class="filled-in" id="primary_color_12" name="theme_color" type="radio" value="color-deeporange">
					<label for="primary_color_12"></label>
					<span>Deeporange</span>
				</li>
			</ul>
		</div>
	</div>
	<!-- Multicolor Canvas Start --> 
	
</div>  
<!--**********************************
    Scripts
***********************************-->
<script src="assets/js/jquery.js"></script>
<script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="assets/vendor/swiper/swiper-bundle.min.js"></script><!-- Swiper -->
<script src="assets/vendor/countdown/jquery.countdown.js"></script><!-- COUNTDOWN FUCTIONS  -->
<script src="assets/vendor/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js"></script><!-- Swiper -->
<script src="assets/js/dz.carousel.js"></script><!-- Swiper -->
<script src="assets/js/settings.js"></script>
<script src="assets/js/custom.js"></script>
<script src="index.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js" integrity="sha512-Ysw1DcK1P+uYLqprEAzNQJP+J4hTx4t/3X2nbVwszao8wD+9afLjBQYjz7Uk4ADP+Er++mJoScI42ueGtQOzEA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</body>
</html>