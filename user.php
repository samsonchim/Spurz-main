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
if (!isset($_SESSION['user_id'])) {
    // Redirect to the login page if not logged in
    header("Location: login.html");
    exit();
}

// Retrieve user data from the database
$user_id = $_SESSION['user_id'];

$sql = "SELECT * FROM users WHERE user_id = ?";
$stmt = mysqli_prepare($conn, $sql);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "i", $user_id);

    if (mysqli_stmt_execute($stmt)) {
        $result = mysqli_stmt_get_result($stmt);

        // Fetch and display user records
        while ($row = mysqli_fetch_assoc($result)) {
            $username = $row['username'];
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
?>

<!DOCTYPE html>
<html lang="en">

<head>
	
	<!-- Title -->
	<title>Spurz - User Section</title>

	<!-- Meta -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, minimal-ui, viewport-fit=cover">
	<meta name="theme-color" content="#453ac3">
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
	
    
    <!-- Global CSS -->
	<link href="assets/vendor/bootstrap-select/dist/css/bootstrap-select.min.css" rel="stylesheet">
	<link rel="stylesheet" href="assets/vendor/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css">
	<link rel="stylesheet" href="assets/vendor/swiper/swiper-bundle.min.css">
    
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
	
	<!-- Header -->
		<header class="header header-fixed">
			<div class="container">
				<div class="header-content">
					<div class="left-content">
						<a href="javascript:void(0);" class="back-btn">
							<i class="icon feather icon-chevron-left"></i>
						</a>
					</div>
					<div class="mid-content">
						<h6 class="title">User Section</h6>
					</div>
					<div class="right-content">
						<a href="javascript:void(0);">
							<i class="icon feather icon-more-vertical-"></i>
						</a>
					</div>
				</div>
			</div>
		</header>
	<!-- Header -->
	
	<!-- Page Content Start -->
	<div class="page-content space-top">
		<div class="container">
			<div class="profile-area">
				<div class="main-profile">
					
					<div class="profile-detail">
						<h6 class="name"><?php echo $username?></h6>
					<!--	<span class="font-12">ID 02123141</span> -->
					</div>
					<a href="edit-profile.html" class="edit-profile">
						<i class="icon feather icon-edit-2"></i>
					</a>
				</div>
				<div class="content-box">
					<ul class="row g-2">
						<li class="col-6">							
							<a href="order.html">
								<div class="dz-icon-box">
									<i class="icon feather icon-package"></i>
								</div>
								<span>Orders</span>
							</a>
						</li>
						<li class="col-6">							
							<a href="cart.html">
								<div class="dz-icon-box">
									<i class="icon feather icon-shopping-cart"></i>
								</div>
								<span>My Cart</span>
							</a>
						</li>
						<li class="col-6">							
							<a href="coupon.html">
								<div class="dz-icon-box">
									<i class="icon feather icon-dollar-sign"></i>
								</div>
								<span> Payments</span>
							</a>
						</li>
						<li class="col-6">							
							<a href="help.html">
								<div class="dz-icon-box">
									<i class="icon feather icon-headphones"></i>
								</div>
								<span>Help Center</span>
							</a>
						</li>
					</ul>
				</div>
				<div class="title-bar">
					<h6 class="title mb-0">Account Settings</h6>
				</div>
				<div class="dz-list style-1">
					<ul>
						<li>
							<a href="edit-profile.html" class="item-content item-link">
								<div class="dz-icon">
									<i class="icon feather icon-user"></i>
								</div>
								<div class="dz-inner">
									<span class="title">Edit Profile</span>
								</div>
							</a>
						</li>
						<li>
							<a href="address.html" class="item-content item-link">
								<div class="dz-icon">
									<i class="icon feather icon-map-pin"></i>
								</div>
								<div class="dz-inner">
									<span class="title">Saved Addresses</span>
								</div>
							</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="item-content item-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLang" aria-controls="offcanvasLang">
								<div class="dz-icon">
									<i class="icon feather icon-type"></i>
								</div>
								<div class="dz-inner">
									<span class="title select-lang">Select Language</span>
								</div>
							</a>
						</li>
						<li>
							<a href="notification.html" class="item-content item-link">
								<div class="dz-icon">
									<i class="icon feather icon-bell"></i>
								</div>
								<div class="dz-inner me-2">
									<span class="title">Notification</span>
								</div>
								<div class="badge badge-primary">5</div>
							</a>
						</li>
						<li>
							<a href="welcome.html" class="item-content item-link">
								<div class="dz-icon">
									<i class="icon feather icon-log-out"></i>
								</div>
								<div class="dz-inner">
									<span class="title">Log Out</span>
								</div>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<!-- Page Content End -->
	
	<!-- Menubar -->
	<div class="menubar-area footer-fixed rounded-0 border-top">
		<div class="toolbar-inner menubar-nav">
			<a href="index.html" class="nav-link">
				<i class="icon feather icon-home"></i>
				<span>Home</span>
			</a>
			<a href="category.html" class="nav-link">
				<i class="icon feather icon-grid"></i>
				<span>Categories</span>
			</a>
			<a href="wishlist.html" class="nav-link">
				<i class="icon feather icon-dollar-sign"></i>
				<span>Payments</span>
			</a>
			<a href="profile.html" class="nav-link active">
				<i class="icon feather icon-user"></i>
				<span>User Section</span>
			</a>
		</div>
	</div>
	<!-- Menubar -->
	
	<!-- langauage picker -->
	<div class="offcanvas offcanvas-bottom m-3 rounded"  tabindex="-1" id="offcanvasLang">
		<div class="offcanvas-header border-0 pb-0">
			<h5 class="offcanvas-title" id="offcanvasExampleLabel">Language</h5>
			<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
		</div>
        <div class="offcanvas-body small">
			<div class="dz-list">
				<ul class="mb-2 confirm-lang">
					<li data-lang="indian">
						<a href="javascript:void(0);" class="item-content py-2 item-link">
							<div class="media media-30 me-3">
								<img src="assets/images/flags/india.svg" alt="/">
							</div>
							<div class="dz-inner">
								<span class="title">Indian</span>
							</div>
						</a>
					</li>
					<li data-lang="English">
						<a href="javascript:void(0);" class="item-content py-2 item-link">
							<div class="media media-30 me-3">
								<img src="assets/images/flags/united-states.svg" alt="/">
							</div>
							<div class="dz-inner">
								<span class="title">English</span>
							</div>
						</a>
					</li>
					<li data-lang="German">
						<a href="javascript:void(0);" class="item-content py-2 item-link">
							<div class="media media-30 me-3">
								<img src="assets/images/flags/germany.svg" alt="/">
							</div>
							<div class="dz-inner">
								<span class="title">German</span>
							</div>
						</a>
					</li>
					<li data-lang="Italian">
						<a href="javascript:void(0);" class="item-content py-2 item-link">
							<div class="media media-30 me-3">
								<img src="assets/images/flags/italy.svg" alt="/">
							</div>
							<div class="dz-inner">
								<span class="title">Italian</span>
							</div>
						</a>
					</li>	
					<li class="border-0" data-lang="Spainsh">
						<a href="javascript:void(0);" class="item-content py-2 item-link">
							<div class="media media-30 me-3">
								<img src="assets/images/flags/spain.svg" alt="/">
							</div>
							<div class="dz-inner">
								<span class="title">Spainsh</span>
							</div>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<!-- langauage picker -->
</div>  
<!--**********************************
    Scripts
***********************************-->
<script src="assets/js/jquery.js"></script>
<script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="assets/vendor/swiper/swiper-bundle.min.js"></script><!-- Swiper -->
<script src="assets/vendor/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js"></script><!-- Swiper -->
<script src="assets/js/dz.carousel.js"></script><!-- Swiper -->
<script src="assets/js/settings.js"></script>
<script src="assets/js/custom.js"></script>
</body>

<!-- Mirrored from wedo.dexignzone.com/xhtml/profile.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 19 Feb 2024 21:20:03 GMT -->
</html>