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


<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo  $businessName?> </title>
    <!-- Favicons -->
    <link rel="shortcut icon" href="outlet/assetsimages/favicon.ico">



    <link rel="stylesheet" href="outlet/assets/css/vendor/fontawesome.min.css">
    <link rel="stylesheet" href="outlet/assets/css/vendor/pe-icon-7-stroke.min.css">



    <link rel="stylesheet" href="outlet/assets/css/plugins/swiper-bundle.min.css" />
    <link rel="stylesheet" href="outlet/assets/css/plugins/animate.min.css" />
    <link rel="stylesheet" href="outlet/assets/css/plugins/aos.min.css" />
    <link rel="stylesheet" href="outlet/assets/css/plugins/nice-select.min.css" />
    <link rel="stylesheet" href="outlet/assets/css/plugins/jquery-ui.min.css" />
    <link rel="stylesheet" href="outlet/assets/css/plugins/lightgallery.min.css" />

    <link rel="stylesheet" href="outlet/assets/css/style.css" />


</head>

<body>
    <div class="header section">

        <!-- Header Top Start -->
        <div class="header-top bg-light">
            <div class="container">
                <div class="row row-cols-xl-2 align-items-center">
                    <div class="col d-none d-lg-block">
                        <div class="header-top-lan-curr-link">
                            <div class="header-top-links">
                                <span>Whatsapp Us</span><a href="https://wa.me/<?php echo $phone_no?>"> <?php echo $phone_no ?></a>
                            </div>
                        </div>
                    </div>

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

                             
                                <a href="login-register.html" class="header-action-btn d-none d-md-block"><i class="pe-7s-user"></i></a>
                           
                                <a href="wishlist.html" class="header-action-btn header-action-btn-wishlist d-none d-md-block">
                                    <i class="pe-7s-like"></i>
                                </a>
                               

                                <!-- Shopping Cart Header Action Button Start 
                                <a href="cart.php?id=<?php echo $id; ?>" class="header-action-btn header-action-btn-cart">
                                    <i class="pe-7s-shopbag"></i>
                                    <span class="header-action-num"></span>
                                </a>-->
                             
                                <a href="javascript:void(0)" class="header-action-btn header-action-btn-menu d-xl-none d-lg-block">
                                    <i class="fa fa-bars"></i>
                                </a>
                               

                            </div>
                        </div>
                       

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
             
                <div class="mt-auto">

                    <!-- Contact Links Start -->
                    <ul class="contact-links">
                        <li><i class="fa fa-phone"></i><a href="https://wa.me/<?php echo $phone_no?>"> <?php echo $phone_no?></a></li>
                        <li><i class="fa fa-envelope-o"></i><a href="mailto:<?php echo $email?>"> <?php echo $email?></a></li>
                        <li><i class="fa fa-marker"></i> <span><?php echo $location?></span> </li>
                    </ul>

                </div>
            </div>
        </div>

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

    </div>

    <div class="section section-margin">
        <div class="container">
            <div class="row flex-row-reverse">
                <div class="col-lg-9 col-12 col-custom">


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
                                                    object-fit: cover; 
                                                 }
                                                    .carousel img:first-child {
                                                    display: block;
                                                    }

                                            </style>
                        <div class="row shop_wrapper grid_3">
<?php

$itemsPerPage = 9; 

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

// Get current page number=
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
        $product_id = $row['product_id'];

        $old_price = $price * 1.3;

       ?>
        <div class="col-lg-4 col-md-4 col-sm-6 product" data-aos="fade-up" data-aos-delay="200">
            <div class="product-inner">
                <div class="thumb">
                    <div id="carousel-<?php echo $product_id; ?>" class="carousel">
                        <?php
                        for ($i = 1; $i <= 3; $i++) {
                            $image_path = "outlet/php/uploads/{$product_id}_({$i}).png";

                            if (file_exists($image_path)) {
                                echo '<img class="carousel-item" src="' . $image_path . '" alt="Product Image">';
                            }
                        }
                        ?>
                    </div>
                   66
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

                         
                            <!-- Social Link End -->
                        </div>
                    </div>
                  

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