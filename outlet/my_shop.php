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
if (!isset($_SESSION['id'])) {
    // Redirect to the login page if not logged in
    header("Location: login.html");
    exit();
}

// Retrieve user ID from the session
$user_id = $_SESSION['id'];

// Construct the image path based on user ID
$image_path = "php/logo/$user_id.png";
$default_image_path = "php/logo/000m.png";

// Check if the user image exists, otherwise use the default image
$image_url = (file_exists($image_path)) ? $image_path : $default_image_path;


// Fetch data from the outlets table using the active session ID
$sql = "SELECT * FROM outlets WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if there are rows returned
    if ($result->num_rows > 0) {
        // Fetch the data and store each column in individual variables
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

        }
    } else {
        echo "No data found for the user with ID: $user_id";
    }

    // Close the statement
    $stmt->close();
} else {
    echo "Error preparing the statement: " . $conn->error;
}


?>

<!DOCTYPE html>
<html lang="en">


<!-- Mirrored from htmldemo.net/destry/destry/shop-list-fullwidth.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 09 Aug 2022 13:12:11 GMT -->
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo $businessName?> </title>
    <!-- Favicons -->
    <link rel="shortcut icon" href="<?php echo $image_url?>">

    <!-- Vendor CSS (Icon Font) -->

    <link rel="stylesheet" href="assets/css/vendor/fontawesome.min.css">
    <link rel="stylesheet" href="assets/css/vendor/pe-icon-7-stroke.min.css">


    <!-- Plugins CSS (All Plugins Files) -->

    <link rel="stylesheet" href="assets/css/plugins/swiper-bundle.min.css" />
    <link rel="stylesheet" href="assets/css/plugins/animate.min.css" />
    <link rel="stylesheet" href="assets/css/plugins/aos.min.css" />
    <link rel="stylesheet" href="assets/css/plugins/nice-select.min.css" />
    <link rel="stylesheet" href="assets/css/plugins/jquery-ui.min.css" />
    <link rel="stylesheet" href="assets/css/plugins/lightgallery.min.css" />


    <!-- Main Style CSS -->


    <link rel="stylesheet" href="assets/css/style.css" />

</head>

<body>

    

    <!-- Breadcrumb Section Start -->
    <div class="section">

        <!-- Breadcrumb Area Start -->
        <div class="breadcrumb-area bg-light">
            <div class="container-fluid">
                <div class="breadcrumb-content text-center">
                    <h1 class="title">Shop List</h1>
                    <ul>
                        <li>
                            <a>Home </a>
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
            <div class="row">
                <div class="col-12">

                    <!--shop toolbar start-->
                    <div class="shop_toolbar_wrapper flex-column flex-md-row mb-10">

                    
                       
                        <!-- Shopt Top Bar Right Start -->
                        <div class="shop-top-bar-right">
                            <div class="shop-short-by mr-4">
                                <select class="nice-select" aria-label=".form-select-sm example">
                                    <option selected>Show 24</option>
                                    <option value="1">Show 24</option>
                                    <option value="2">Show 12</option>
                                    <option value="3">Show 15</option>
                                    <option value="3">Show 30</option>
                                </select>
                            </div>

                            <div class="shop-short-by mr-4">
                                <!-- <select class="nice-select" aria-label=".form-select-sm example">
                                    <option selected>Short by Default</option>
                                    <option value="1">Short by Popularity</option>
                                    <option value="2">Short by Rated</option>
                                    <option value="3">Short by Latest</option>
                                    <option value="3">Short by Price</option>
                                    <option value="3">Short by Price</option>
                                </select> -->
                            </div>

                            <div class="shop_toolbar_btn">
                                <button data-role="grid_4" type="button" class="btn-grid-4" title="Grid"><i class="fa fa-th"></i></button>
                           </div>
                        </div>
                        <!-- Shopt Top Bar Right End -->

                    </div>
                    <!--shop toolbar end-->

                    <!-- Shop Wrapper Start -->
                    <div class="row shop_wrapper grid_list" data-aos="fade-up" data-aos-delay="200">

                
                    <?php


// Check if the user is logged in
if (!isset($_SESSION['id'])) {
    // Redirect to the login page if not logged in
    header("Location: login.html");
    exit();
}

// Retrieve user ID from the session
$user_id = $_SESSION['id'];
// Define how many results you want per page
$results_per_page = 12;

// Find out the number of products for the logged-in user
$sql = "SELECT COUNT(*) AS total FROM products WHERE user_id = '$user_id'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$total_products = $row['total'];

// Determine the total number of pages available
$total_pages = ceil($total_products / $results_per_page);

// Determine which page number visitor is currently on
if (!isset($_GET['page'])) {
    $page = 1;
} else {
    $page = $_GET['page'];
}

// Determine the SQL LIMIT starting number for the results on the displaying page
$starting_limit = ($page - 1) * $results_per_page;

// Retrieve the selected results from the database 
$sql = "SELECT * FROM products WHERE user_id = '$user_id' LIMIT " . $starting_limit . ", " . $results_per_page;
$result = $conn->query($sql);

// Display the products
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $product_id = $row['product_id'];
        echo '<div class="col-12 product">
                <div class="product-inner">
                    <div class="thumb">
                        <a href="single-product.html" class="image">
                            <img class="first-image" src="php/uploads/' . $row['product_id'] . '_(1).png" alt="' . htmlspecialchars($row['product_name'], ENT_QUOTES, 'UTF-8') . '" />
                            <img class="second-image" src="php/uploads/' . $row['product_id'] . '_(2).png" alt="' . htmlspecialchars($row['product_name'], ENT_QUOTES, 'UTF-8') . '" />
                        </a>
                        <div class="actions">
                            <a href="wishlist.html" title="Wishlist" class="action wishlist"><i class="pe-7s-like"></i></a>
                            <a href="compare.html" title="Compare" class="action compare"><i class="pe-7s-shuffle"></i></a>
                        </div>
                    </div>
                    <div class="content">
                        <h4 class="sub-title"><a>' . htmlspecialchars($row['product_category'], ENT_QUOTES, 'UTF-8') . '</a></h4>
                        <h5 class="title"><a href="#">' . htmlspecialchars($row['product_name'], ENT_QUOTES, 'UTF-8') . '</a></h5>
                        <span class="rating-num">(' . htmlspecialchars($row['items_in_stock'], ENT_QUOTES, 'UTF-8') . ' Items in stock)</span>
                        <p>' . htmlspecialchars($row['product_description'], ENT_QUOTES, 'UTF-8') . '</p>
                        <span class="price">
                            <span class="new">&#x20A6;' . htmlspecialchars($row['price'], ENT_QUOTES, 'UTF-8') . '</span>
                        </span>

                        <div class="shop-list-btn">
                            <a href="delete_product.php?product_id=' . htmlspecialchars($product_id, ENT_QUOTES, 'UTF-8') . '" title="Delete Product" class="btn btn-sm btn-outline-dark btn-hover-primary">Delete Product</a>
                            <a href="#" title="Compare" class="btn btn-sm btn-outline-dark btn-hover-primary compare">
                                <i class="fa fa-random"></i>
                            </a>
                        </div>

                    </div>
                </div>
              </div>';
    }
} else {
    echo '<p>You dont have any product, create one <a href="dashboard">here.</a></p>';
}

// Generate the pagination links
echo '<div class="shop-top-bar-right">
        <nav>
            <ul class="pagination">';

if ($page > 1) {
    echo '<li class="page-item">
            <a class="page-link" href="shop.php?page=' . ($page - 1) . '" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
          </li>';
}

for ($i = 1; $i <= $total_pages; $i++) {
    echo '<li class="page-item ' . ($i == $page ? 'active' : '') . '">
            <a class="page-link" href="shop.php?page=' . $i . '">' . $i . '</a>
          </li>';
}

if ($page < $total_pages) {
    echo '<li class="page-item">
            <a class="page-link" href="shop.php?page=' . ($page + 1) . '" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
          </li>';
}

echo '  </ul>
        </nav>
      </div>';

// Close the database connection
$conn->close();
?>
    <!-- Shop Section End -->

    <!-- Vendors JS -->


    <script src="assets/js/vendor/bootstrap.bundle.min.js"></script>
    <script src="assets/js/vendor/jquery-3.6.0.min.js"></script>
    <script src="assets/js/vendor/jquery-migrate-3.3.2.min.js"></script>
    <script src="assets/js/vendor/modernizr-3.11.2.min.js"></script>


    <!-- Plugins JS -->


    <script src="assets/js/plugins/countdown.min.js"></script>
    <script src="assets/js/plugins/aos.min.js"></script>
    <script src="assets/js/plugins/swiper-bundle.min.js"></script>
    <script src="assets/js/plugins/nice-select.min.js"></script>
    <script src="assets/js/plugins/jquery.ajaxchimp.min.js"></script>
    <script src="assets/js/plugins/jquery-ui.min.js"></script>
    <script src="assets/js/plugins/lightgallery-all.min.js"></script>
    <script src="assets/js/plugins/thia-sticky-sidebar.min.js"></script>
\\
    <script src="assets/js/main.js"></script>

</body>


</html>