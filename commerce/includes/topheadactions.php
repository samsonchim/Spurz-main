     <?php
      $total_cart_items = 0;
     if(isset($_SESSION['mycart']))
     {
      $total_cart_items = count($_SESSION['mycart']);
     }
    

     ?>
  
      <div class="header-main">
        <div class="container">
          <!-- logo section -->
          <a href="./index.php?id=<?php echo (isset( $_SESSION['customer_name']))? $_SESSION['id']: 'unknown';?>" class="header-logo" style="color: hsl(0, 0%, 13%);">

            <h1 style="text-align: center;">

            <img src="images/logo.png" alt="logo" width="40px">

            </h1>

          </a>

          <!-- search input -->
          <div class="header-search-container">
            <form class="search-form" method="post" action="./search.php">
              <input type="search" name="search" class="search-field" placeholder="What do you want to buy?" required oninvalid="this.setCustomValidity('Enter product name...')" oninput="this.setCustomValidity('')" />

              <button class="search-btn" type="submit" name="submit">
                <ion-icon name="search-outline"></ion-icon>
              </button>
            </form>
          </div>

          <div class="header-user-actions">

            <!-- Logout button -->
    <?php if( isset( $_SESSION['id'])) { ?>

            <button id="lg-btn" class="action-btn">
              <a   href="logout.php"  id="a" role="button" >
                <ion-icon name="log-out-outline"></ion-icon>
              </a>
            </button> 

            <!-- TODO: This script doesnot execute: Work o this, Directly logout user -->
		        <script src="./js/logout.js"></script>

	  <?php } else { ?>
            <!-- Login Button -->
            <button class="action-btn">
              <a href="./login.php"  id="a">
                <ion-icon name="person-outline"></ion-icon>
              </a>
            </button>

	  <?php } ?>

           

            <!-- Favourite Counter -->
            <button class="action-btn">
              <ion-icon name="heart-outline"></ion-icon>
              <span class="count">0</span>
            </button>

            <!-- Cart Button -->
	  <?php if(!(isset($_SESSION['logged-in']))){?>
            
            <button class="action-btn">
              <a href="./cart.php" >
                <ion-icon name="bag-handle-outline"></ion-icon>
              </a>
              <span class="count"> 
              <?php
                echo $total_cart_items ;
              ?>
              </span>
            </button>

    <?php } ?>

          </div>
        </div>
      </div>

      