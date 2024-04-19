<!DOCTYPE html>
<html lang="en">

<head>
	
	<!-- Title -->
	<title>Spurz - My Cart</title>

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
					<h6 class="title">Cart</h6>
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
	<div class="page-content space-top p-b50">
		<div class="container">
			<div class="user-status m-b15">				
				<div class="d-flex align-items-center">
					<div class="media media-35 rounded-circle me-2">
					
					</div>
					
					
				</div>
				<h6 class="mb-0 font-14 font-w500 text-primary">
				
				</h6>
			</div>
			<div id="cartContainer"></div>

			<a href="checkout.html" class="btn btn-primary">Checkout</a>
			
			
				</ul>
			</div>
		</div>
	</div>
	
				
			</div>
		</div>
	</div>
	<!-- Footer End -->
</div>  
<!--**********************************
    Scripts
***********************************-->

<!-- Your HTML content here -->

<script>
	
// Function to display cart items from local storage
function displayCartItems() {
    // Retrieve cart items from local storage
    let cartItems = JSON.parse(localStorage.getItem('cartItems'));

    // Check if there are items in the cart
    if (cartItems && cartItems.length > 0) {
        // Get the container element where cart items will be displayed
        let cartContainer = document.getElementById('cartContainer');

        // Loop through each item in the cart
        cartItems.forEach(item => {
            // Create the main cart box element
            let cartBox = document.createElement('div');
            cartBox.classList.add('cart-box');

            // Create the cart content element
            let cartContent = document.createElement('div');
            cartContent.classList.add('cart-content');

            // Create the product title
            let productTitle = document.createElement('h5');
            productTitle.classList.add('title', 'mb-1');
            let productLink = document.createElement('a');
            productLink.href = 'product-detail.html'; // Assuming this is the product detail page URL
            productLink.textContent = item.productName; // Assuming productName is a property in your item object
            productTitle.appendChild(productLink);
            cartContent.appendChild(productTitle);

            // Create the product price
            let productPrice = document.createElement('h6');
            productPrice.classList.add('price', 'mb-0');
            productPrice.textContent = '₦ ' + item.price.toFixed(2); // Assuming price is a property in your item object
            cartContent.appendChild(productPrice);

            // Create the product description
            let productDescription = document.createElement('span');
            productDescription.classList.add('font-12', 'brand-tag');
            productDescription.textContent = item.productDescription; // Assuming productDescription is a property in your item object
            cartContent.appendChild(productDescription);

            // Create the cart footer
            let cartFooter = document.createElement('div');
            cartFooter.classList.add('cart-footer');

            // Create remove from cart link
            let removeLink = document.createElement('p');
            removeLink.classList.add('title', 'mb-1');
            let removeAnchor = document.createElement('a');
            removeAnchor.href = '#';
            removeAnchor.textContent = 'Remove from Cart';
            // Add event listener to remove the product when clicked
            removeAnchor.addEventListener('click', function() {
                removeFromCart(item.productId); // Assuming productId is a unique identifier for the product
            });
            removeLink.appendChild(removeAnchor);
            cartFooter.appendChild(removeLink);

            cartContent.appendChild(cartFooter);
            cartBox.appendChild(cartContent);

            // Append the cart box to the container
            cartContainer.appendChild(cartBox);
        });
    } else {
        // If cart is empty, display a message or handle accordingly
        console.log('Cart is empty');
    }
}

// Function to remove product from cart
function removeFromCart(productId) {
    // Retrieve cart items from local storage
    let cartItems = JSON.parse(localStorage.getItem('cartItems'));

    // Find the index of the product to remove
    let index = cartItems.findIndex(item => item.productId === productId);

    // If the product is found, remove it from the cart
    if (index !== -1) {
        cartItems.splice(index, 1);
        // Update the cart items in local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        // Refresh the cart display
        displayCartItems();
    }
}

// Call the function to display cart items when the page loads
window.onload = displayCartItems;







// Function to get user's location using GeoJS
function getUserLocation() {
    return new Promise((resolve, reject) => {
        fetch('https://get.geojs.io/v1/ip/geo.json')
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

// Function to update user's location in local storage
function updateUserLocationInLocalStorage(locationData) {
    localStorage.setItem('userLocation', JSON.stringify(locationData));
}

// Function to retrieve user's location from local storage
function getUserLocationFromLocalStorage() {
    const userLocation = localStorage.getItem('userLocation');
    return userLocation ? JSON.parse(userLocation) : null;
}

// Function to update user's location and save it in local storage
async function updateLocation() {
    try {
        // Get user's location using GeoJS
        const locationData = await getUserLocation();

        // Save user's location in local storage
        updateUserLocationInLocalStorage(locationData);
    } catch (error) {
        console.error('Error updating user location:', error);
    }
}

// Update user's location when the page loads
updateLocation();

// Optionally, you can set up a timer to update the location periodically
setInterval(updateLocation, 12 * 60 * 60 * 1000); // Update every 24 hours

</script>
<script src="assets/js/jquery.js"></script>
<script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="assets/vendor/swiper/swiper-bundle.min.js"></script><!-- Swiper -->
<script src="assets/vendor/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js"></script><!-- Swiper -->
<script src="assets/js/dz.carousel.js"></script><!-- Swiper -->
<script src="assets/js/settings.js"></script>
<script src="assets/js/custom.js"></script>
</body>

<!-- Mirrored from wedo.dexignzone.com/xhtml/cart.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 19 Feb 2024 21:19:56 GMT -->
</html>