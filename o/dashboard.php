<?php
// Include your database connection code here
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Sellbizzhub";

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

// Retrieve user data from the database
$user_id = $_SESSION['id'];

$sql = "SELECT * FROM outlets WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "i", $user_id);

    if (mysqli_stmt_execute($stmt)) {
        $result = mysqli_stmt_get_result($stmt);

        // Fetch and display user records
        while ($row = mysqli_fetch_assoc($result)) {
            $businessName = $row['businessName'];
            $email = $row['email'];
            $businessType = $row['businessType'];
            // Add more fields as needed
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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="dashboard.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sulphur+Point:wght@300&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/boxicons/2.0.7/css/boxicons.min.css">
    <link rel="shortcut icon" href="../assets/images/logo/sellbizzhub.png" type="image/x-icon">

  <!--
    - custom css link
  -->
  <link rel="stylesheet" href="../assets/css/style-prefix.css">
  <link rel="stylesheet" href="../assets/css/style.css">

  

    <title><?php echo $businessName ?></title>
</head>

<body>
    <!-- Loader element -->
    <div id="loader">
        <img src="loader.gif" alt="Loader"><br>
    </div>

    <div id="content" style="display: none;">
    
        <div class="header">
            <div class="left-section">
                <img src="../assets/images/logo/sellbizzhub.png" alt="" class="logo">
                <strong class="sellbizzhub">Sellbizzhub Outlet</strong>
                
            </div>

            <div class="right-section">
                <i class="fas fa-cart"></i>
                <a href="../index">Browse</a>
                <a href="order.html">Orders</a>
                <h3 class="business_name">
                    <img src="https://th.bing.com/th/id/OIP.Q6bHUaS8Jd58hncSWnEBwwHaEK?rs=1&pid=ImgDetMain" alt="" class="logo">
                    <?php echo strtoupper($businessName) ?><i class="fas fa-caret-down"></i>
                </h3>
            </div>
        </div>

        <div class="sidebar">
            <ul>
                <li><a href="#" class="active-side">Dashboard</a></li>
                <li><a href="#">My Listings</a></li>
                <li><a href="#">Orders</a></li>
                <li><a href="#">Transactions</a></li>
                <li><a href="#">Inbox <span class="message-icon">(2)</span></a></li>
                <li><a href="#">Business Profile</a></li>
            </ul>
        </div>
            <!-- New column for contents -->
            <div class="contents">
                  
            <div class="toggles">
            <div class="menu-option active" data-menu="menu1" onclick="toggleMenu('menu1')">Products</div>
            <div class="menu-option" data-menu="menu2" onclick="toggleMenu('menu2')">Sales</div>
       <!-- <a href="" class="menu-option active" data-menu="menu1" onclick="toggleMenu('menu1')">Products</a>
        <a href="">Sales</a> -->

    </div>
      <div class="popup-overlay"></div>
      <div class="popup-container" id="popupContainer">
     
     <p><b>FILL PRODUCT DETAILS</b></p> 
    
     <button class="close-button" onclick="closePopup()">Close</button>
     
     <form id="productForm" action="add_product.php" method="post" enctype="multipart/form-data">
     
     <label for="product_name"><b>Product Name:</b></label>
    <input type="text" id="product_name" name="product_name" required>

    <div class="checkbox-container">
    <label><b>Product Category:</b></label>
    <div class="checkbox-item">
        <input type="checkbox" id="categoryFashion" name="product_category[]" value="Fashion">
        <label for="categoryFashion">Fashion</label>
    </div>

    <div class="checkbox-item">
        <input type="checkbox" id="categoryElectronics" name="product_category[]" value="Electronics">
        <label for="categoryElectronics">Electronics</label>
    </div>

    <div class="checkbox-item">
        <input type="checkbox" id="categoryHome" name="product_category[]" value="Home">
        <label for="categoryHome">Home</label>
    </div>

    <div class="checkbox-item">
        <input type="checkbox" id="categoryBeauty" name="product_category[]" value="Beauty">
        <label for="categoryBeauty">Beauty</label>
    </div>

    <div class="checkbox-item">
        <input type="checkbox" id="categoryOutdoors" name="product_category[]" value="Outdoors">
        <label for="categoryOutdoors">Outdoors</label>
    </div>

    <div class="checkbox-item">
        <input type="checkbox" id="categoryHandmade" name="product_category[]" value="Handmade">
        <label for="categoryHandmade">Handmade</label>
    </div>

    <div class="checkbox-item">
        <input type="checkbox" id="categoryEdibles" name="product_category[]" value="Edibles">
        <label for="categoryEdibles">Edibles</label>
    </div>

    <div class="checkbox-item">
        <input type="checkbox" id="categoryOthers" name="product_category[]" value="Others">
        <label for="categoryOthers">Others</label>
    </div>
</div>


    <label for="items_in_stock"><b>Items in Stock:</b></label>
    <input type="number" id="items_in_stock" name="items_in_stock" required>

    <label for="price"><b>Price per one (In Naira):</b></label>
    <input type="number" id="price" name="price" required>

    <div class="checkbox-container">
        <label><b>Retail or Wholesale:</b></label>
        <div class="checkbox-item">
            <input type="radio" id="product_type_retail" name="product_type" value="Retail">
            <label for="product_type_retail">Retail</label>
        </div>
        <div class="checkbox-item">
            <input type="radio" id="product_type_wholesale" name="product_type" value="Wholesale">
            <label for="product_type_wholesale">Wholesale</label>
        </div>
    </div>
 <br>

 
 <label for="productImages"><b>Product Images (Max 3):</b></label>
<input type="file" id="productImages" name="productImages[]" accept="image/*" multiple>

 <!-- Image preview container -->
 <p style="text-align: center;">Double Click an Image to remove</p>
 <div id="imagePreviewContainer"></div>
 <div class="error-message" id="response-message"></div>
 <input class="submit-button" type="submit" value="Submit">

</form>

 </div>
    <div class="main-body">
    <div id="menu1Content" class="content">
        <div class="bg">
        <img class= "add-product"src="add.png" alt="" >
        <p class="add-product-text">Click the Cart to add product</p> <br>

        <p class="report">You have <span class="product-number"><b>0</b></span> products listed on your Outlet</b>

      
        <!-- Pop-up container -->
      
    </div>


    <div class="bg">
    <div class="product-container">
  <div class="image-box">
    <!-- Product images would go here -->
  </div>
  <div class="product-details">
    <h2>Unisex Wristwatch [detail]</h2>
    <p>₦5,000 [in stock: 5]</p>
  </div>
  <div class="go-live">
    <!-- Replace with actual pen icon image -->
    <img src="https://th.bing.com/th/id/R.791f37137d7b072d400202a4d74c59cd?rik=BkcHr%2fqM9h8gtQ&pid=ImgRaw&r=0" alt="Go Live">
    <span>Go Live</span>
  </div>
</div>


        
    </div>

    
    <div class="bg">
    <div class="product-container">
  <div class="image-box">
    <!-- Product images would go here -->
  </div>
  <div class="product-details">
    <h2>Unisex Wristwatch [detail]</h2>
    <p>₦5,000 [in stock: 5]</p>
  </div>
  <div class="go-live">
    <!-- Replace with actual pen icon image -->
    <img src="https://th.bing.com/th/id/R.791f37137d7b072d400202a4d74c59cd?rik=BkcHr%2fqM9h8gtQ&pid=ImgRaw&r=0" alt="Go Live">
    <span>Go Live</span>
  </div>
</div>


        
    </div>
</div>



    <div id="menu2Content" class="content" style="display: none;">
        <h2>Menu 2 Content</h2>
        <p>This is the content for Menu 2. It can be different from Menu 1 and tailored to specific needs.</p>
    </div>
    </div>
</div>


                    <div class="mobile-bottom-navigation">

      <button  class="action-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M21.993 7.95a.96.96 0 0 0-.029-.214c-.007-.025-.021-.049-.03-.074-.021-.057-.04-.113-.07-.165-.016-.027-.038-.049-.057-.075-.032-.045-.063-.091-.102-.13-.023-.022-.053-.04-.078-.061-.039-.032-.075-.067-.12-.094-.004-.003-.009-.003-.014-.006l-.008-.006-8.979-4.99a1.002 1.002 0 0 0-.97-.001l-9.021 4.99c-.003.003-.006.007-.011.01l-.01.004c-.035.02-.061.049-.094.073-.036.027-.074.051-.106.082-.03.031-.053.067-.079.102-.027.035-.057.066-.079.104-.026.043-.04.092-.059.139-.014.033-.032.064-.041.1a.975.975 0 0 0-.029.21c-.001.017-.007.032-.007.05V16c0 .363.197.698.515.874l8.978 4.987.001.001.002.001.02.011c.043.024.09.037.135.054.032.013.063.03.097.039a1.013 1.013 0 0 0 .506 0c.033-.009.064-.026.097-.039.045-.017.092-.029.135-.054l.02-.011.002-.001.001-.001 8.978-4.987c.316-.176.513-.511.513-.874V7.998c0-.017-.006-.031-.007-.048zm-10.021 3.922L5.058 8.005 7.82 6.477l6.834 3.905-2.682 1.49zm.048-7.719L18.941 8l-2.244 1.247-6.83-3.903 2.153-1.191zM13 19.301l.002-5.679L16 11.944V15l2-1v-3.175l2-1.119v5.705l-7 3.89z"></path></svg>
      <span class="count">0</span>
    </button>

      <button class="action-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="17.5" cy="19.5" r="1.5"></circle><path d="m14 13.99 4-5h-3v-4h-2v4h-3l4 5z"></path><path d="M17.31 15h-6.64L6.18 4.23A2 2 0 0 0 4.33 3H2v2h2.33l4.75 11.38A1 1 0 0 0 10 17h8a1 1 0 0 0 .93-.64L21.76 9h-2.14z"></path></svg>
        <span class="count">0</span>
      </button>

      <button class="action-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="m15 12 5-4-5-4v2.999H2v2h13zm7 3H9v-3l-5 4 5 4v-3h13z"></path></svg>
      </button>

      <button class="action-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M20 3H4c-1.103 0-2 .897-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5c0-1.103-.897-2-2-2zm-1 9h-3.142c-.446 1.722-1.997 3-3.858 3s-3.412-1.278-3.858-3H4V5h16v7h-1z"></path></svg>

        <span class="count">0</span>
      </button>
    <a href="../index.html">
      <button class="action-btn" data-mobile-menu-open-btn>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z"></path></svg>
     </button>
</a>
    </div>

           
          <!--
        <div class="bottom-bar">
        <button class="toggle-btn">&#9776;</button>
            <a href="#home" class="active"><i class="fas fa-home"></i> Home</a>
            <a href="#news"><i class="fas fa-message"></i> Inbox <span class="message-icon">(12)</span></a>
            <a href="#contact"><i class="fas fa-user"></i> Profile</a>
        </div>
    </div>
-->

<script>

document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Create a FormData object to store form data
    const formData = new FormData(this);

    // Use AJAX to send the form data to the PHP script
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'add_product.php', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Handle the response from the server
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                // Product saved successfully, refresh the page
                window.location.reload();
            } else {
                // Display error message
                document.getElementById('response-message').innerText = response.message;
            }
        } else {
            // Handle errors
            console.error('Error:', xhr.statusText);
        }
    };

    // Send the FormData object
    xhr.send(formData);
});












document.getElementById('productImages').addEventListener('change', function (event) {
    const previewContainer = document.getElementById('imagePreviewContainer');
    const files = event.target.files;
    const currentImages = previewContainer.querySelectorAll('.preview-image');

    // Check if the total number of images doesn't exceed 3
    if (currentImages.length + files.length > 3) {
        alert('You can only upload up to 3 images. Please remove an image before adding another.');
        // Clear the file input to prevent adding more than 3 images
        this.value = "";
        return;
    }

    for (const file of files) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.className = 'preview-image';

            // Create an "X" button to remove the image
            const closeButton = document.createElement('button');
            closeButton.innerText = 'X';
            closeButton.className = 'close-button';

            // Set up a timer for double-tap behavior on mobile
            let lastClickTime = 0;
            imgElement.addEventListener('click', function () {
                const currentTime = new Date().getTime();
                const timeSinceLastClick = currentTime - lastClickTime;

                if (timeSinceLastClick < 300) {
                    previewContainer.removeChild(imgElement);
                }

                lastClickTime = currentTime;
            });

            // Append the image and close button to the preview container
            previewContainer.appendChild(imgElement);
            imgElement.appendChild(closeButton);
        };

        reader.readAsDataURL(file);
    }
});


        



       // Function to show the pop-up menu
       function showPopup() {
            var popupContainer = document.getElementById("popupContainer");
            popupContainer.style.display = "block";
        }

        // Function to close the pop-up menu
        function closePopup() {
            var popupContainer = document.getElementById("popupContainer");
            popupContainer.style.display = "none";
        }

        // Event listener for the image click
        document.querySelector('.add-product').addEventListener('click', showPopup);
   
document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');

    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
        toggleBtn.classList.toggle('open');
    });
});


function toggleMenu(menuId) {
        // Hide all menu contents and remove active class from menu options
        var menuContents = document.getElementsByClassName('content');
        var menuOptions = document.getElementsByClassName('menu-option');
        
        for (var i = 0; i < menuContents.length; i++) {
            menuContents[i].style.display = 'none';
        }

        for (var i = 0; i < menuOptions.length; i++) {
            menuOptions[i].classList.remove('active');
        }

        // Show the selected menu content and mark the menu option as active
        document.getElementById(menuId + 'Content').style.display = 'block';
        document.querySelector('.toggles .menu-option[data-menu="' + menuId + '"]').classList.add('active');
    }
    /* Hide the loader and reveal the content after 10 seconds */
    setTimeout(function () {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }, 1000);
</script>
</body>
</html>