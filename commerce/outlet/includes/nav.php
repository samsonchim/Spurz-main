<?php
session_start();
if (!isset($_SESSION["outlet_id"]) || !isset($_SESSION["outlet_name"])) {
    header("Location: register.html");
    exit();
}
$user_id = $_SESSION["outlet_id"];
$outlet_name = $_SESSION["outlet_name"];

?>
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo $outlet_name ?></title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="./assets/icons/font-awesome-4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="./assets/css/w3pro-4.13.css">
  <link rel="stylesheet" href="./assets/css/w3-theme.css">
  <link rel="stylesheet" href="./assets/css/admin-styles.css">
  <link rel="stylesheet" href="./assets/css/scrollbar.css">
  <link rel="shortcut icon" href="includes/logos/<?php echo htmlspecialchars($outlet_name, ENT_QUOTES, 'UTF-8'); ?>.png" type="image/x-icon">
</head>
<style>
  .logo-circle {

    display: block;
}

</style>
<body class="w3-light-grey">
  <input id="sidebar-control" type="checkbox" class="w3-hide">
  <div id="app">
    <div class="w3-top w3-card" style="height:54px">
      <div class="w3-flex-bar w3-theme w3-left-align">
        <div class="admin-logo w3-bar-item w3-hide-medium w3-hide-small">
          </div>
        <label for="sidebar-control" class="w3-button w3-large w3-opacity-min"><i class="fa fa-bars"></i></label>
        
        <div class="w3-bar-item w3-right w3-hide-small">
          <div class="w3-dropdown-hover">
            <button class="w3-button w3-small w3-round w3-theme w3-hover-theme"> <?php echo $outlet_name ?> <i class="fa fa-caret-down"></i></button>
            <div class="w3-dropdown-content w3-bar-block w3-border w3-white w3-card-4">
              <a href="profile.php" class="w3-bar-item w3-button w3-small w3-hover-theme">Profile</a>
              <a href="logout.php" class="w3-bar-item w3-button w3-small w3-hover-theme">Logout</a>
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="w3-button">
            <a href="upload_products.php">
          <button class="w3-button w3-green w3-round w3-big w3-padding-large">
                <i class="fa fa-upload"></i> Upload Product
            </button>
            </a>
          </div>
           
        </div>
      </div>
    </div>
    <nav id="sidebar" class="w3-sidebar w3-top w3-bottom w3-collapse w3-white w3-border-right w3-border-top scrollbar" style="z-index:3;width:230px;height:auto;margin-top:54px;border-color:rgba(0, 0, 0, .1)!important" id="mySidebar">
      <div class="w3-bar-item w3-border-bottom w3-hide-large" style="padding:6px 0">
        <label for="sidebar-control" class="w3-left w3-button w3-large w3-opacity-min" style="background:white!important"><i class="fa fa-bars"></i></label>
        <h5 class="" style="line-height:1; margin:0!important; font-weight:300">
          <a href="./index.html" class="w3-button" style="background:white!important">
          <img src="includes/logos/<?php echo htmlspecialchars($outlet_name, ENT_QUOTES, 'UTF-8'); ?>.png" alt="Outlet Logo" class="w3-image logo-circle" width="50" height="50"> </h5>
        </h5>
      </div>
      <div class="w3-bar-block">
    <span class="w3-bar-item w3-padding w3-small w3-opacity" style="margin-top:8px"> 
        <?php echo htmlspecialchars($outlet_name, ENT_QUOTES, 'UTF-8'); ?> 
    </span>
    
    <a href="./dashboard.php" class="w3-bar-item w3-button w3-padding-large w3-hover-text-primary">
        <i class="fa fa-fw fa-tachometer"></i>&nbsp; Dashboard 
    </a>
    
    <a href="./products.php" class="w3-bar-item w3-button w3-padding-large w3-hover-text-primary">
        <i class="fa fa-fw fa-shopping-bag"></i>&nbsp; Products 
    </a>
    
    <a href="./invoice.php" class="w3-bar-item w3-button w3-padding-large w3-hover-text-primary">
        <i class="fa fa-fw fa-file-text"></i>&nbsp; Invoice 
    </a>
    
    <a href="profile.php" class="w3-bar-item w3-button w3-padding-large w3-hover-text-primary">
        <i class="fa fa-fw fa-user"></i>&nbsp; Profile 
    </a>
    
    <a href="webpage.php" class="w3-bar-item w3-button w3-padding-large w3-hover-text-primary">
        <i class="fa fa-fw fa-globe"></i>&nbsp; Personal Webpage 
    </a>
    
    <a href="logout.php" class="w3-bar-item w3-button w3-padding-large w3-hover-text-primary">
        <i class="fa fa-fw fa-sign-out"></i>&nbsp; Logout 
    </a>
    
    <span class="w3-bar-item w3-padding w3-small w3-opacity"> LABELS </span>
    
    <a href="#refer" class="w3-bar-item w3-button w3-padding-large w3-hover-text-primary">
        <i class="fa fa-fw fa-users w3-text-danger"></i>&nbsp; Refer a Vendor
    </a>
    
    <a href="#howto" class="w3-bar-item w3-button w3-padding-large w3-hover-text-primary">
        <i class="fa fa-fw fa-question-circle w3-text-success"></i>&nbsp; How to? 
    </a>
    
    <a href="#report" class="w3-bar-item w3-button w3-padding-large w3-hover-text-primary">
        <i class="fa fa-fw fa-exclamation-triangle w3-text-warning"></i>&nbsp; Report an Issue 
    </a>
</div>

    </nav>