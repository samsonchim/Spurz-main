<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if ID parameter is set in the URL
if (isset($_GET['id'])) {
    // Sanitize the ID parameter
    $id = sanitize_input($_GET['id']);

    // Prepare SQL statement to fetch data based on ID
    $sql = "SELECT * FROM outlets WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if there is any data associated with the ID
    if ($result->num_rows > 0) {
        // Loop through the fetched data
        while ($row = $result->fetch_assoc()) {
            $businessName = $row['businessName'];
            $email = $row['email'];
            $businessType = $row['businessType'];
            $account_no = $row['account_no'];
            $account_name = $row['account_name'];
            $bank_name = $row['bank_name'];
            $phone_no = $row['phone_no'];
            $business_logo = $row['business_logo'];
            $location = $row['location'];
            // Construct the image path based on user ID
            $image_path = "outlet/php/logo/$id.png";
            $default_image_path = "outlet/php/logo/000m.png";

            // Check if the user image exists, otherwise use the default image
            $image_url = (file_exists($image_path)) ? $image_path : $default_image_path;

           }
    } else {
        echo "No data found for ID: " . $id;
    }

    // Close the prepared statement
    $stmt->close();
} else {
    echo "ID parameter not found in the URL.";
}


?>

<!DOCTYPE html>
<html lang="en">


<!-- Mirrored from htmldemo.net/destry/destry/shop-left-sidebar.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 09 Aug 2022 13:12:11 GMT -->
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo  $businessName?> </title>
    <!-- Favicons -->
    <link rel="shortcut icon" href="outlet/assetsimages/favicon.ico">

    <!-- Vendor CSS (Icon Font) -->

    <link rel="stylesheet" href="outlet/assets/css/vendor/fontawesome.min.css">
    <link rel="stylesheet" href="outlet/assets/css/vendor/pe-icon-7-stroke.min.css">


    <!-- Plugins CSS (All Plugins Files) -->

    <link rel="stylesheet" href="outlet/assets/css/plugins/swiper-bundle.min.css" />
    <link rel="stylesheet" href="outlet/assets/css/plugins/animate.min.css" />
    <link rel="stylesheet" href="outlet/assets/css/plugins/aos.min.css" />
    <link rel="stylesheet" href="outlet/assets/css/plugins/nice-select.min.css" />
    <link rel="stylesheet" href="outlet/assets/css/plugins/jquery-ui.min.css" />
    <link rel="stylesheet" href="outlet/assets/css/plugins/lightgallery.min.css" />


    <!-- Main Style CSS -->


    <link rel="stylesheet" href="outlet/assets/css/style.css" />



    <!-- Use the minified version files listed below for better performance and remove the files listed above -->


    <!-- 
    <link rel="stylesheet" href="outlet/assets/css/vendor.min.css">
    <link rel="stylesheet" href="outlet/assets/css/plugins.min.css">
    <link rel="stylesheet" href="outlet/assets/css/style.min.css"> 
    -->
</head>

<body>
    <div class="header section">

        <!-- Header Top Start -->
        <div class="header-top bg-light">
            <div class="container">
                <div class="row row-cols-xl-2 align-items-center">

                    <!-- Header Top Language, Currency & Link Start -->
                    <div class="col d-none d-lg-block">
                        <div class="header-top-lan-curr-link">
                            <div class="header-top-links">
                                <span>Whatsapp Us</span><a href="https://wa.me/<?php echo $phone_no?>"> <?php echo $phone_no ?></a>
                            </div>
                        </div>
                    </div>
                    <!-- Header Top Language, Currency & Link End -->

                    <!-- Header Top Message Start -->
                    <div class="col">
                        <p class="header-top-message">We deliver to <?php echo $location?>. </p>
                    </div>
                    <!-- Header Top Message End -->

                </div>
            </div>
        </div>
        <!-- Header Top End -->

        <!-- Header Bottom Start -->
        <div class="header-bottom">
            <div class="header-sticky">
                <div class="container">
                    <div class="row align-items-center">

                        <!-- Header Logo Start -->
                        <div class="col-xl-2 col-6">
                            <div class="header-logo">
                                <style>
                                        .company_logo{
                                            height: 20%;
                                            width: 20%;
                                        }
                                </style>
                                <a href="index.html"><img class="company_logo"src="<?php echo $image_url?>" alt="Site Logo" /></a>
                            </div>
                        </div>
                        <!-- Header Logo End -->

                        <!-- Header Menu Start -->
                        <div class="col-xl-8 d-none d-xl-block">
                            <div class="main-menu position-relative">
                                    
                                       
                            </div>
                        </div>
                        <!-- Header Menu End -->

                        <!-- Header Action Start -->
                        <div class="col-xl-2 col-6">
                            <div class="header-actions">

                                <!-- User Account Header Action Button Start -->
                                <a href="login-register.html" class="header-action-btn d-none d-md-block"><i class="pe-7s-user"></i></a>
                                <!-- User Account Header Action Button End -->

                                <!-- Wishlist Header Action Button Start -->
                                <a href="wishlist.html" class="header-action-btn header-action-btn-wishlist d-none d-md-block">
                                    <i class="pe-7s-like"></i>
                                </a>
                                <!-- Wishlist Header Action Button End -->

                                <!-- Shopping Cart Header Action Button Start 
                                <a href="cart.php?id=<?php echo $id; ?>" class="header-action-btn header-action-btn-cart">
                                    <i class="pe-7s-shopbag"></i>
                                    <span class="header-action-num"></span>
                                </a>-->
                                <!-- Shopping Cart Header Action Button End -->

                                <!-- Mobile Menu Hambarger Action Button Start -->
                                <a href="javascript:void(0)" class="header-action-btn header-action-btn-menu d-xl-none d-lg-block">
                                    <i class="fa fa-bars"></i>
                                </a>
                                <!-- Mobile Menu Hambarger Action Button End -->

                            </div>
                        </div>
                        <!-- Header Action End -->

                    </div>
                </div>
            </div>
        </div>
        <!-- Header Bottom End -->

        <!-- Mobile Menu Start -->
        <div class="mobile-menu-wrapper">
            <div class="offcanvas-overlay"></div>

            <!-- Mobile Menu Inner Start -->
            <div class="mobile-menu-inner">

                <!-- Button Close Start -->
                <div class="offcanvas-btn-close">
                    <i class="pe-7s-close"></i>
                </div>
                <!-- Button Close End -->

                <!-- Mobile Menu Start -->
                <div class="mobile-navigation">
                    <nav>
                        <ul class="mobile-menu">
                            <li class="has-children">
                                <a href="#">Home</a>
                            </li>
                            <li class="has-children">
                                <a href="#">Explore Similiar Outlets</a>
                            </li>
                            <li class="has-children">
                                <a href="#">Review this Outlet</a>
                            </li>
                    </nav>
                </div>
                <!-- Mobile Menu End -->

                <!-- Language, Currency & Link Start -->
               

                <!-- Contact Links/Social Links Start -->
                <div class="mt-auto">

                    <!-- Contact Links Start -->
                    <ul class="contact-links">
                        <li><i class="fa fa-phone"></i><a href="https://wa.me/<?php echo $phone_no?>"> <?php echo $phone_no?></a></li>
                        <li><i class="fa fa-envelope-o"></i><a href="mailto:<?php echo $email?>"> <?php echo $email?></a></li>
                        <li><i class="fa fa-marker"></i> <span><?php echo $location?></span> </li>
                    </ul>
                    <!-- Contact Links End -->

                    <!-- Social Widget Start -->
                    <div class="widget-social">
                        <a title="Facebook" href="#"><i class="fa fa-facebook-f"></i></a>
                        <a title="Twitter" href="#"><i class="fa fa-twitter"></i></a>
                        <a title="Linkedin" href="#"><i class="fa fa-linkedin"></i></a>
                        <a title="Youtube" href="#"><i class="fa fa-youtube"></i></a>
                        <a title="Vimeo" href="#"><i class="fa fa-vimeo"></i></a>
                    </div>
                    <!-- Social Widget Ende -->
                </div>
                <!-- Contact Links/Social Links End -->
            </div>
            <!-- Mobile Menu Inner End -->
        </div>
        <!-- Mobile Menu End -->

      
    

    </div>


    <!-- Breadcrumb Section Start -->
    <div class="section">

        <!-- Breadcrumb Area Start -->
        <div class="breadcrumb-area bg-light">
            <div class="container-fluid">
                <div class="breadcrumb-content text-center">
                    <h1 class="title"><?php echo $businessName?></h1>
                    <ul>
                        <li>
                            <a href="index.php">Home </a>
                        </li>
                        <li class="active"> shop</li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- Breadcrumb Area End -->

    </div>
    <!-- Breadcrumb Section End -->

    <!-- Shop Section Start -->
    <div class="section section-margin">
        <div class="container">
            <div class="row flex-row-reverse">
                <div class="col-lg-9 col-12 col-custom">

                   
                        <!-- Shopt Top Bar Right End -->

                    </div>
                    <!--shop toolbar end-->
                                            <style>
                                                
                                            .carousel {
                                                    position: relative;
                                                    width: 320px;
                                                    height: 400px;
                                                    overflow: hidden;
                                                    }

                                                    .carousel img {
                                                    display: none;
                                                    width: 100%; 
                                                    height: 100%;
                                                    object-fit: cover; /* Ensures images maintain aspect ratio and cover the container */
                                                    }

                                                    /* Show the first image initially */
                                                    .carousel img:first-child {
                                                    display: block;
                                                    }

                                            </style>
                    <!-- Shop Wrapper Start -->
                    <div class="row shop_wrapper grid_3">

                        <!-- Single Product Start -->
                       <?php
// Assuming $id contains the user_id you want to filter products for

// Define pagination parameters
$itemsPerPage = 9; // Number of products per page

// Fetch products from the database based on user_id
$sql = "SELECT COUNT(*) AS total FROM products WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$totalProducts = $row['total'];

// Calculate total number of pages
$totalPages = ceil($totalProducts / $itemsPerPage);

// Get current page number (default to 1 if not provided)
$page = isset($_GET['page']) ? $_GET['page'] : 1;

// Calculate the offset for pagination
$offset = ($page - 1) * $itemsPerPage;

// Fetch products for the current page
$sql = "SELECT * FROM products WHERE user_id = ? LIMIT ?, ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iii", $id, $offset, $itemsPerPage);
$stmt->execute();
$result = $stmt->get_result();

// Check if there are products
if ($result->num_rows > 0) {
    // Loop through each product
    while ($row = $result->fetch_assoc()) {
        $product_name = htmlspecialchars($row['product_name']);
        $product_description = htmlspecialchars($row['product_description']);
        $price = $row['price'];
        $product_id = $row['product_id']; // Assuming you have product_id in your database

        // Calculate the old price (20% less than the new price)
        $old_price = $price * 1.3;

        // Output HTML structure with fetched product details
        ?>
        <div class="col-lg-4 col-md-4 col-sm-6 product" data-aos="fade-up" data-aos-delay="200">
            <div class="product-inner">
                <div class="thumb">
                    <div id="carousel-<?php echo $product_id; ?>" class="carousel">
                        <?php
                        // Output images here for this product
                        for ($i = 1; $i <= 3; $i++) {
                            $image_path = "outlet/php/uploads/{$product_id}_({$i}).png";
                            // Check if the image file exists
                            if (file_exists($image_path)) {
                                echo '<img class="carousel-item" src="' . $image_path . '" alt="Product Image">';
                            }
                        }
                        ?>
                    </div>
                    <div class="actions">
                        <a href="" title="Like Product" class="action wishlist"><i class="pe-7s-like"></i></a>
                    </div>
                </div>
                <div class="content">
                    <h5 class="title"><a href="single-product.html"><?php echo $product_name; ?></a></h5>
                    <h4 class="sub-title"><a href="single-product.html"><?php echo $product_description; ?></a></h4>
                    <span class="price">
                        <span class="new">₦<?php echo number_format($price, 2); ?></span> <!-- Display new price -->
                        <span class="old">₦<?php echo number_format($old_price, 2); ?></span> <!-- Display old price -->
                    </span>
                    <div class="shop-list-btn">
                        <a title="Like Product" href="#" class="btn btn-sm btn-outline-dark btn-hover-primary wishlist"><i class="fa fa-heart"></i></a>
                        <a href="https://api.whatsapp.com/send?phone=<?php echo urlencode($phone_no); ?>&text=I%20am%20interested%20in%20the%20<?php echo urlencode($product_name); ?>%20listed%20on%20your%20Spurz%20outlet" class="btn btn-sm btn-outline-dark btn-hover-primary btn-add-to-cart">Buy on WhatsApp</a>

                    </div>
                </div>
            </div>
        </div>
        <?php
    }
} else {
    echo 'No products found.';
}

// Close the prepared statement and the database connection
$stmt->close();
$conn->close();
?>


                        <!-- Single Product End -->

                     
                    </div>
                    <!-- Shop Wrapper End -->

                    <!--shop toolbar start-->
                    <div class="shop_toolbar_wrapper mt-10">

                        <!-- Shop Top Bar Left start -->
                        <div class="shop-top-bar-left">
                            <div class="shop-short-by mr-4">
                              
                            </div>
                        </div>
                        <!-- Shop Top Bar Left end -->

                        <!-- Shopt Top Bar Right Start -->
                   
                          <!-- Pagination -->
                        <div class="shop-top-bar-right">
                            <nav>
                                <ul class="pagination">
                                    <?php if ($page > 1) : ?>
                                        <li class="page-item">
                                            <a class="page-link" href="?id=<?php echo $id; ?>&page=<?php echo $page - 1; ?>" aria-label="Previous">
                                                <span aria-hidden="true">&laquo;</span>
                                            </a>
                                        </li>
                                    <?php endif; ?>
                                    <?php for ($i = 1; $i <= $totalPages; $i++) : ?>
                                        <li class="page-item <?php echo $i == $page ? 'active' : ''; ?>">
                                            <a class="page-link" href="?id=<?php echo $id; ?>&page=<?php echo $i; ?>"><?php echo $i; ?></a>
                                        </li>
                                    <?php endfor; ?>
                                    <?php if ($page < $totalPages) : ?>
                                        <li class="page-item">
                                            <a class="page-link" href="?id=<?php echo $id; ?>&page=<?php echo $page + 1; ?>" aria-label="Next">
                                                <span aria-hidden="true">&raquo;</span>
                                            </a>
                                        </li>
                                    <?php endif; ?>
                                </ul>
                            </nav>
                        </div>

                        <!-- Shopt Top Bar Right End -->

                    </div>
                    <!--shop toolbar end-->

                </div>
              
                                    <!-- Single Product List End -->
                                </div>
                            </div>
                        </div>
                    </aside>
                    <!-- Sidebar Widget End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Shop Section End -->

    <!-- Footer Section Start -->
    <footer class="section footer-section">
        <!-- Footer Top Start -->
        <div class="footer-top section-padding">
            <div class="container">
                <div class="row mb-n10">
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-4 mb-10" data-aos="fade-up" data-aos-delay="200">
                        <div class="single-footer-widget">
                            <h2 class="widget-title">About this Business</h2>
                            <p class="desc-content"><?php //echo $businessDescription ?></p>
                            <!-- Contact Address Start -->
                            <ul class="widget-address">
                                <li><span>We deliver to: </span> <?php echo $location?></li>
                                <li><span>Whatsapp us: </span> <a href="https://wa.me/<?php echo $phone_no?>"> <?php echo $phone_no ?></a></li>
                                <li><span>Mail to: </span> <a href="mailto:<?php echo $email?>"> <?php echo $email?></a></li>
                            </ul>
                            <!-- Contact Address End -->

                            <!-- Soclial Link Start -->
                            <div class="widget-social justify-content-start mt-4">
                                <a title="Facebook" href="#"><i class="fa fa-facebook-f"></i></a>
                                <a title="Twitter" href="#"><i class="fa fa-twitter"></i></a>
                                <a title="Linkedin" href="#"><i class="fa fa-linkedin"></i></a>
                                <a title="Youtube" href="#"><i class="fa fa-youtube"></i></a>
                                <a title="Vimeo" href="#"><i class="fa fa-vimeo"></i></a>
                            </div>
                            <!-- Social Link End -->
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-2 col-xl-2 mb-10" data-aos="fade-up" data-aos-delay="300">
                        <div class="single-footer-widget">
                            <h2 class="widget-title">Information</h2>
                            <ul class="widget-list">
                                <li><a href="about.html">Privacy Policy</a></li>
                                <li><a href="about.html">Terms & Conditions</a></li>
                                <li><a href="about.html">Customer Service</a></li>
                                <li><a href="about.html">Return Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-2 col-xl-2 mb-10" data-aos="fade-up" data-aos-delay="400">
                        <div class="single-footer-widget aos-init aos-animate">
                            <h2 class="widget-title">My Account</h2>
                            <ul class="widget-list">
                                <li><a href="account.html">My Account</a></li>
                                <li><a href="wishlist.html">Wishlist</a></li>
                                <li><a href="contact.html">Help Center</a></li>
                                <li><a href="contact.html">Terms and Condition</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-4 mb-10" data-aos="fade-up" data-aos-delay="500">
                        <div class="single-footer-widget">
                            <h2 class="widget-title">Newsletter</h2>
                            <div class="widget-body">
                                <p class="desc-content mb-0">Get E-mail updates about our latest shop and special offers.</p>

                                <!-- Newsletter Form Start -->
                                <div class="newsletter-form-wrap pt-4">
                                    <form id="mc-form" class="mc-form">
                                        <input type="email" id="mc-email" class="form-control email-box mb-4" placeholder="Enter your email here.." name="EMAIL">
                                        <button id="mc-submit" class="newsletter-btn btn btn-primary btn-hover-dark" type="submit">Subscribe</button>
                                    </form>
                                    <!-- mailchimp-alerts Start -->
                                    <div class="mailchimp-alerts text-centre">
                                        <div class="mailchimp-submitting"></div><!-- mailchimp-submitting end -->
                                        <div class="mailchimp-success text-success"></div><!-- mailchimp-success end -->
                                        <div class="mailchimp-error text-danger"></div><!-- mailchimp-error end -->
                                    </div>
                                    <!-- mailchimp-alerts end -->
                                </div>
                                <!-- Newsletter Form End -->

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer Top End -->

        <!-- Footer Bottom Start -->
        <div class="footer-bottom">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-12 text-center">
                        <div class="copyright-content">
                            <p class="mb-0">© 2024 <strong>Spurz </strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer Bottom End -->
    </footer>
    <!-- Footer Section End -->

    <!-- Scroll Top Start -->
    <a href="#" class="scroll-top" id="scroll-top">
        <i class="arrow-top fa fa-long-arrow-up"></i>
        <i class="arrow-bottom fa fa-long-arrow-up"></i>
    </a>
    <!-- Scroll Top End -->


    <!-- Scripts -->
    <!-- Scripts -->
    <!-- Global Vendor, plugins JS -->

    <!-- Vendors JS -->


    <script src="outlet/assets/js/vendor/bootstrap.bundle.min.js"></script>
    <script src="outlet/assets/js/vendor/jquery-3.6.0.min.js"></script>
    <script src="outlet/assets/js/vendor/jquery-migrate-3.3.2.min.js"></script>
    <script src="outlet/assets/js/vendor/modernizr-3.11.2.min.js"></script>


    <!-- Plugins JS -->


    <script src="outlet/assets/js/plugins/countdown.min.js"></script>
    <script src="outlet/assets/js/plugins/aos.min.js"></script>
    <script src="outlet/assets/js/plugins/swiper-bundle.min.js"></script>
    <script src="outlet/assets/js/plugins/nice-select.min.js"></script>
    <script src="outlet/assets/js/plugins/jquery.ajaxchimp.min.js"></script>
    <script src="outlet/assets/js/plugins/jquery-ui.min.js"></script>
    <script src="outlet/assets/js/plugins/lightgallery-all.min.js"></script>
    <script src="outlet/assets/js/plugins/thia-sticky-sidebar.min.js"></script>


    <!-- Use the minified version files listed below for better performance and remove the files listed above -->


    <!-- 
   <script src="outlet/assetsjs/vendor.min.js"></script>
   <script src="outlet/assetsjs/plugins.min.js"></script> 
   -->

        <script>
                        // Get all carousel images
                        document.addEventListener('DOMContentLoaded', function () {
    // Select all carousel containers
    const carousels = document.querySelectorAll('.carousel');

    // Iterate over each carousel container
    carousels.forEach(function (carousel) {
        // Select images within the current carousel container
        const carouselImages = carousel.querySelectorAll('img');

        // Set initial index and show the first image for the current carousel
        let currentIndex = 0;
        carouselImages[currentIndex].style.display = 'block';

        // Function to switch to the next image for the current carousel
        function showNextImage() {
            // Hide the current image
            carouselImages[currentIndex].style.display = 'none';
            // Increment the index
            currentIndex = (currentIndex + 1) % carouselImages.length;
            // Show the next image
            carouselImages[currentIndex].style.display = 'block';
        }

        // Automatically switch to the next image every 5 seconds for the current carousel
        setInterval(showNextImage, 5000);
    });
});



        </script>

    <!--Main JS-->
    <script src="outlet/assets/js/main.js"></script>

</body>


<!-- Mirrored from htmldemo.net/destry/destry/shop-left-sidebar.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 09 Aug 2022 13:12:11 GMT -->
</html>