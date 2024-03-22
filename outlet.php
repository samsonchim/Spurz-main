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

// Close the database connection
$conn->close();
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
                        <p class="header-top-message">We deliver to <?php echo $location?>. <a href="index.php">Explore Marketplace</a></p>
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

                                <!-- Shopping Cart Header Action Button Start -->
                                <a href="javascript:void(0)" class="header-action-btn header-action-btn-cart">
                                    <i class="pe-7s-shopbag"></i>
                                    <span class="header-action-num">3</span>
                                </a>
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
                                <a href="#">Product</a>
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

      
        <!-- Offcanvas Search End -->

        <!-- Cart Offcanvas Start -->
        <div class="cart-offcanvas-wrapper">
            <div class="offcanvas-overlay"></div>

            <!-- Cart Offcanvas Inner Start -->
            <div class="cart-offcanvas-inner">

                <!-- Button Close Start -->
                <div class="offcanvas-btn-close">
                    <i class="pe-7s-close"></i>
                </div>
                <!-- Button Close End -->

                <!-- Offcanvas Cart Content Start -->
                <div class="offcanvas-cart-content">
                    <!-- Offcanvas Cart Title Start -->
                    <h2 class="offcanvas-cart-title mb-10">Shopping Cart</h2>
                    <!-- Offcanvas Cart Title End -->

                    <!-- Cart Product/Price Start -->
                    <div class="cart-product-wrapper mb-6">

                        <!-- Single Cart Product Start -->
                        <div class="single-cart-product">
                            <div class="cart-product-thumb">
                                <a href="single-product.html"><img src="outlet/assets/images/products/small-product/1.jpg" alt="Cart Product"></a>
                            </div>
                            <div class="cart-product-content">
                                <h3 class="title"><a href="single-product.html">Brother Hoddies in Grey</a></h3>
                                <span class="price">
								<span class="new">$38.50</span>
                                <span class="old">$40.00</span>
                                </span>
                            </div>
                        </div>
                        <!-- Single Cart Product End -->

                        <!-- Product Remove Start -->
                        <div class="cart-product-remove">
                            <a href="#"><i class="fa fa-trash"></i></a>
                        </div>
                        <!-- Product Remove End -->

                    </div>
                    <!-- Cart Product/Price End -->

                    <!-- Cart Product/Price Start -->
                    <div class="cart-product-wrapper mb-6">

                        <!-- Single Cart Product Start -->
                        <div class="single-cart-product">
                            <div class="cart-product-thumb">
                                <a href="single-product.html"><img src="outlet/assets/images/products/small-product/2.jpg" alt="Cart Product"></a>
                            </div>
                            <div class="cart-product-content">
                                <h3 class="title"><a href="single-product.html">Basic Jogging Shorts</a></h3>
                                <span class="price">
								<span class="new">$14.50</span>
                                <span class="old">$18.00</span>
                                </span>
                            </div>
                        </div>
                        <!-- Single Cart Product End -->

                        <!-- Product Remove Start -->
                        <div class="cart-product-remove">
                            <a href="#"><i class="fa fa-trash"></i></a>
                        </div>
                        <!-- Product Remove End -->

                    </div>
                    <!-- Cart Product/Price End -->

                    <!-- Cart Product/Price Start -->
                    <div class="cart-product-wrapper mb-6">

                        <!-- Single Cart Product Start -->
                        <div class="single-cart-product">
                            <div class="cart-product-thumb">
                                <a href="single-product.html"><img src="outlet/assets/images/products/small-product/3.jpg" alt="Cart Product"></a>
                            </div>
                            <div class="cart-product-content">
                                <h3 class="title"><a href="single-product.html">Enjoy The Rest T-Shirt</a></h3>
                                <span class="price">
								<span class="new">$20.00</span>
                                <span class="old">$21.00</span>
                                </span>
                            </div>
                        </div>
                        <!-- Single Cart Product End -->

                        <!-- Product Remove Start -->
                        <div class="cart-product-remove">
                            <a href="#"><i class="fa fa-trash"></i></a>
                        </div>
                        <!-- Product Remove End -->

                    </div>
                    <!-- Cart Product/Price End -->

                    <!-- Cart Product Total Start -->
                    <div class="cart-product-total">
                        <span class="value">Subtotal</span>
                        <span class="price">220$</span>
                    </div>
                    <!-- Cart Product Total End -->

                    <!-- Cart Product Button Start -->
                    <div class="cart-product-btn mt-4">
                        <a href="cart.html" class="btn btn-dark btn-hover-primary rounded-0 w-100">View cart</a>
                        <a href="checkout.html" class="btn btn-dark btn-hover-primary rounded-0 w-100 mt-4">Checkout</a>
                    </div>
                    <!-- Cart Product Button End -->

                </div>
                <!-- Offcanvas Cart Content End -->

            </div>
            <!-- Cart Offcanvas Inner End -->
        </div>
        <!-- Cart Offcanvas End -->

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
                                                    width: 300px; /* Adjust as needed */
                                                    height: 400px; /* Adjust as needed */
                                                    overflow: hidden;
                                                    }

                                                    .carousel img {
                                                    display: none;
                                                    width: 100%; /* Ensures images fill the container */
                                                    height: 100%; /* Ensures images fill the container */
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
                        <div class="col-lg-4 col-md-4 col-sm-6 product" data-aos="fade-up" data-aos-delay="200">
                            <div class="product-inner">
                                <div class="thumb">
                                    <div id="carousel" class="carousel">
                                    <img class="first-image" src="outlet/assets/images/products/medium-size/2.jpg" alt="Product" />
                                    <img class="second-image" src="outlet/assets/images/products/medium-size/3.jpg" alt="Product" />
                                    <img class="third-image" src="https://th.bing.com/th/id/OIP.edoBfWGEEdPvms3ztVBpqwHaE7?w=231&h=180&c=7&r=0&o=5&pid=1.7" alt="Product" />
                                </div>
                                    <div class="actions">
                                        <a href="" title="Like Product" class="action wishlist"><i class="pe-7s-like"></i></a>
                                        </div>
                                </div>
                                <div class="content">
                                    <h5 class="title">Studio Design</a></h5>
                                    <h6 class="sub-title">This will be the product sd</a></h6>
                                    <span class="ratings">
                                            <span class="rating-wrap">
                                                <span class="star" style="width: 100%"></span>
                                    </span>
                                    <span class="rating-num">(4)</span>
                                    </span>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere metus vitae arcu imperdiet, id aliquet ante scelerisque. Sed sit amet sem vitae urna fringilla tempus.</p>
                                    <span class="price">
                                            <span class="new">$40.50</span>
                                    <span class="old">$42.85</span>
                                    </span>
                                    <div class="shop-list-btn">
                                        <a title="Like Product" href="#" class="btn btn-sm btn-outline-dark btn-hover-primary wishlist"><i class="fa fa-heart"></i></a>
                                        <button class="btn btn-sm btn-outline-dark btn-hover-primary" title="Add To Cart">Add To Cart</button>
                                     </div>
                                </div>
                            </div>
                        </div>
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
                        <div class="shop-top-bar-right">
                            <nav>
                                <ul class="pagination">
                                    <li class="page-item disabled">
                                        <a class="page-link" href="#" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                    </li>
                                    <li class="page-item"><a class="page-link active" href="#">1</a></li>
                                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                                    <li class="page-item">
                                        <a class="page-link" href="#" aria-label="Next">
                                            <span aria-hidden="true">&raquo;</span>
                                        </a>
                                    </li>
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
                const carouselImages = document.querySelectorAll('.carousel img');

            // Set initial index and show the first image
            let currentIndex = 0;
            carouselImages[currentIndex].style.display = 'block';

            // Function to switch to the next image
            function showNextImage() {
                // Hide the current image
                carouselImages[currentIndex].style.display = 'none';
                // Increment the index
                currentIndex = (currentIndex + 1) % carouselImages.length;
                // Show the next image
                carouselImages[currentIndex].style.display = 'block';
            }

            // Automatically switch to the next image every 5 seconds
            setInterval(showNextImage, 5000);
        </script>

    <!--Main JS-->
    <script src="outlet/assets/js/main.js"></script>

</body>


<!-- Mirrored from htmldemo.net/destry/destry/shop-left-sidebar.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 09 Aug 2022 13:12:11 GMT -->
</html>