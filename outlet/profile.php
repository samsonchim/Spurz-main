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



// Close the database connection
$conn->close();
?>


<!doctype html>

<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <title><?php echo $businessName ?></title>
    <!-- CSS files -->
    <link href="./dist/css/tabler.min.css?1684106062" rel="stylesheet"/>
    <link href="./dist/css/tabler-flags.min.css?1684106062" rel="stylesheet"/>
    <link href="./dist/css/tabler-payments.min.css?1684106062" rel="stylesheet"/>
    <link href="./dist/css/tabler-vendors.min.css?1684106062" rel="stylesheet"/>
    <link href="./dist/css/demo.min.css?1684106062" rel="stylesheet"/>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <style>
      @import url('https://rsms.me/inter/inter.css');
      :root {
      	--tblr-font-sans-serif: 'Inter Var', -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
      }
      body {
      	font-feature-settings: "cv03", "cv04", "cv11";
      }
    </style>
  </head>
  <body >
    <script src="./dist/js/demo-theme.min.js?1684106062"></script>
    <div class="page">
      <!-- Navbar -->
      <header class="navbar navbar-expand-md d-print-none" >
        <div class="container-xl">
         
          <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a href=".">
              <img src="./static/logo.svg" width="110" height="32" alt="Sellbizzhub" class="navbar-brand-image">
            </a>
          </h1>
          <div class="navbar-nav flex-row order-md-last">
            <div class="nav-item d-none d-md-flex me-3">
             
            </div>
            <div class="d-none d-md-flex">
            
           
              <div class="nav-item dropdown d-none d-md-flex me-3">
                             <div class="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
                  <div class="card">
                    <div class="card-header">
                      <h3 class="card-title">Last updates</h3>
                    </div>
                    <div class="list-group list-group-flush list-group-hoverable">
                      <div class="list-group-item">
                        <div class="row align-items-center">
                          <div class="col-auto"><span class="status-dot status-dot-animated bg-red d-block"></span></div>
                         
                          <div class="col-auto">
                            <a href="#" class="list-group-item-actions">
                              <!-- Download SVG icon from http://tabler-icons.io/i/star -->
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="list-group-item">
                        <div class="row align-items-center">
                          <div class="col-auto"><span class="status-dot d-block"></span></div>
                         
                          <div class="col-auto">
                            <a href="#" class="list-group-item-actions show">
                              <!-- Download SVG icon from http://tabler-icons.io/i/star -->
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon text-yellow" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="list-group-item">
                        <div class="row align-items-center">
                          <div class="col-auto"><span class="status-dot d-block"></span></div>
                          <div class="col text-truncate">
                            <a href="#" class="text-body d-block">Example 3</a>
                            <div class="d-block text-muted text-truncate mt-n1">
                              Update change-version.js (#29736)
                            </div>
                          </div>
                          <div class="col-auto">
                            <a href="#" class="list-group-item-actions">
                              <!-- Download SVG icon from http://tabler-icons.io/i/star -->
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="list-group-item">
                        <div class="row align-items-center">
                          <div class="col-auto"><span class="status-dot status-dot-animated bg-green d-block"></span></div>
                          <div class="col-auto">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </header>
    
       
      <div class="page-wrapper">
        <!-- Page header -->
        <div class="page-header d-print-none">
          <div class="container-xl">
            <div class="row g-2 align-items-center">
              <div class="col">
                <h2 class="page-title">
                 Business Account Settings
                </h2>
              </div>
            </div>
          </div>
        </div>
        <!-- Page body -->
        <div class="page-body">
          <div class="container-xl">
         
       
            <div class="card">
              <div class="row g-0">
                <div class="col-3 d-none d-md-block border-end">
                  <div class="card-body">
                    <h4 class="subheader"><?php $businessName?></h4>
                    <div class="list-group list-group-transparent">
                      <a href="./settings.html" class="list-group-item list-group-item-action d-flex align-items-center active">My Account</a>
                   
                      <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">Billing & Invoices</a>
                    </div>
                    <h4 class="subheader mt-4">Experience</h4>
                    <div class="list-group list-group-transparent">
                      <a href="#" class="list-group-item list-group-item-action">Give Feedback</a>
                    </div>
                  </div>
                </div>
                
                <div class="col d-flex flex-column">
                  <div class="card-body">
                    <h2 class="mb-4">My Account</h2>
                    <h3 class="card-title">Profile Details</h3>
                    <div class="row align-items-center">
                      <div class="col-auto"><span class="avatar avatar-xl" style="background-image: url(<?php echo $image_url; ?>)"></span>
                      </div>
                     
                      <div class="col-auto">
                      <form action="update_profile.php" method="post" enctype="multipart/form-data">
                            <!-- Your form fields here -->
                            <label for="logoInput" class="btn">Change Logo</label>
                            <input type="file" name="logo" id="logoInput" onchange="submitForm()" style="display:none">
                      </div>
                  

                      <div class="col-auto"><a href="php/delete_outlet.php" class="btn btn-ghost-danger">
                          Delete Outlet Account
                        </a></div>
                    </div>
                   
                    <h3 class="card-title mt-4">Business Profile</h3>
                    <div class="row g-3">
                      <div class="col-md">
                        <div class="form-label">Business Name</div>
                        <input type="text" name="businessName" class="form-control" value="<?php echo $businessName ?>">
                      </div>
                      <div class="col-md">
                        <div class="form-label">Business ID</div>
                        <div class="input-icon">
                        <input type="text" class="form-control" class="form-control" value="<?php echo $user_id ?>" disabled>
                        <span class="input-icon-addon">
                      <!-- Download SVG icon from http://tabler-icons.io/i/files -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 3v4a1 1 0 0 0 1 1h4" /><path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" /><path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" /></svg>
                    </span>
                      </div></div>

                    
                  
                      <div class="col-md">
                        <div class="form-label">City and States you can sell to</div>
                        <input type="text" name="location"  class="form-control" value="<?php echo $location ?>">
                      </div>
                    </div>
                    <h3 class="card-title mt-4">Contact Details</h3>
                   <!-- <p class="card-subtitle">This contact will be shown to others publicly.</p> -->
                    <div>
                      <div class="row g-2">
                        <div class="col-md">
                        <div class="form-label">Email</div>
                          <input type="text" class="form-control w-auto" value="<?php echo $email ?>" disabled>
                        </div><!--
                        <div class="col-auto"><a href="#" class="btn">
                            <i>You can't change it now!</i>
                          </a></div>-->
                         
                          <div class="col-md">
                          <div class="form-label">Whatsapp Number</div>
                          <div class="input-group mb-2">
                              <span class="input-group-text">
                                +234
                              </span>
                              <input type="number" name="phone_no" class="form-control"  value="<?php echo $phone_no ?>"  autocomplete="off">
                            </div>
                      </div>
                    </div>

                    <h3 class="card-title mt-4">Account Details</h3>
                    <div class="row g-3">
                      <div class="col-md">
                        <div class="form-label">Account Number</div>
                        <input type="number" name="account_no" class="form-control" placeholder=""value="<?php echo $account_no ?>">
                      </div>
                      <div class="col-md">
                        <div class="form-label">Account Name</div>
                        <input type="text" name="account_name" class="form-control" name="example-disabled-input"  value="<?php echo $account_name ?>" >
                      </div>
                      <div class="col-md">
                        <div class="form-label">Bank Name</div>
                        <input type="text" name="bank_name"class="form-control" value="<?php echo $bank_name ?>">
                      </div>
                    </div>

                    <h3 class="card-title mt-4">Password</h3>
                    <p class="card-subtitle">You can create a new password, provided you know the old.</p>
                    <div>
                    <a href="#" class="btn" data-bs-toggle="modal" data-bs-target="#modal-team">
                    Change Password
                  </a>
                    </div>
                    <!--
                    <h3 class="card-title mt-4">Public Business</h3>
                    <p class="card-subtitle">Making your Business public means that anyone on the Sellbizzhub network will be able to find
                      you.</p>
                    <div>
                      <label class="form-check form-switch form-switch-lg">
                        <input class="form-check-input" type="checkbox" >
                        <span class="form-check-label form-check-label-on">You're currently visible</span>
                        <span class="form-check-label form-check-label-off">You're
                          currently invisible</span>
                      </label>
                    </div>
                  </div>
    -->
                  <div class="card-footer bg-transparent mt-auto">
                    <div class="btn-list justify-content-end">
                      <a href="#" class="btn">
                        Cancel
                      </a>
                     
                      <button type="submit" class="btn btn-primary">
                        Save Information
                    </button>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


    <div class="modal modal-blur fade" id="modal-team" tabindex="-1" role="dialog" aria-hidden="true">
      
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create a new password</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          <form id="passwordChangeForm" action="php/update_password" method="post">
            <div class="row mb-3 align-items-end">
              <div class="col-auto">
              <div class="mb-3">
                <label class="form-label">Old password</label>
                  <div class="input-group input-group-flat">
                    <input type="password" class="form-control" name="old_password" placeholder="initial password"  autocomplete="off">
                    <span class="input-group-text">
                      <a href="#" class="input-group-link">Show password</a>
                    </span>
                  </div>
                </div>
                <div class="mb-3">
                            <label class="form-label">New password</label>
                            <div class="input-group input-group-flat">
                              <input type="password" name="new_password"class="form-control" placeholder="new password"   autocomplete="off">
                              <span class="input-group-text">
                                <a href="#" class="input-group-link">Show password</a>
                              </span>
                  </div>
                </div>
              </div>
            </div>


          </div>
          <div class="modal-footer">
            <button type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
            <a href="php/update_password.php" id="passwordForm" class="btn btn-primary">Create Password</a>
          </div>
          </form>
        </div>
      </div>
    </div>


        <div class="modal modal-blur fade" id="modal-success" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          <div class="modal-status bg-success"></div>
          <div class="modal-body text-center py-4">
            <!-- Download SVG icon from http://tabler-icons.io/i/circle-check -->
            <svg xmlns="http://www.w3.org/2000/svg" class="icon mb-2 text-green icon-lg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>
            <h3>Business Details Updated</h3>
            <div class="text-muted">Your Business Details and Information have been updated succesfully</div>
          </div>
          <div class="modal-footer">
            <div class="w-100">
              <div class="row">
                <div class="col"><a href="dashboard.php" class="btn w-100" data-bs-dismiss="modal">
                    Go to dashboard
                  </a></div>
                <div class="col"><a href="#" class="btn btn-success w-100" data-bs-dismiss="modal">
                    View 
                  </a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
        </form>
        <footer class="footer footer-transparent d-print-none">
          <div class="container-xl">
            <div class="row text-center align-items-center flex-row-reverse">
              <div class="col-lg-auto ms-lg-auto">
                <ul class="list-inline list-inline-dots mb-0">
                  <li class="list-inline-item"><a href="" target="_blank" class="link-secondary" rel="noopener">How To?</a></li>
                  <li class="list-inline-item"><a href="" class="link-secondary">Whatsapp Us</a></li>
                  <li class="list-inline-item"><a href="https://github.com/tabler/tabler" target="_blank" class="link-secondary" rel="noopener">Report an Issue</a></li>
                 
                </ul>
              </div>
              <div class="col-12 col-lg-auto mt-3 mt-lg-0">
                <ul class="list-inline list-inline-dots mb-0">
                  <li class="list-inline-item">
                    Copyright &copy; 2024
                    <a href="." class="link-secondary">Sellbizzhub</a>.
                    All rights reserved.
                  </li>
                  <li class="list-inline-item">
                    <a href="./changelog.html" class="link-secondary" rel="noopener">
                     
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
    <!-- Libs JS -->
    <!-- Tabler Core -->
    <script src="./dist/js/tabler.min.js?1684106062" defer></script>
    <script src="./dist/js/demo.min.js?1684106062" defer></script>
    <script>
$(document).ready(function () {
    // Handle logo input change event
    $("#logoInput").change(function (e) {
        var file = e.target.files[0];

        if (file) {
            var reader = new FileReader();

            reader.onload = function (readerEvent) {
                var imageData = readerEvent.target.result;
                // Set background image to the selected image
                $(".avatar-xl").css("background-image", "url(" + imageData + ")");
            };

            // Read the selected file as a Data URL
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    $("form").submit(function (e) {
        e.preventDefault();

        // Serialize form data
        var formData = new FormData(this);

        // AJAX request
        $.ajax({
            type: "POST",
            url: "php/update_profile.php", // PHP script to handle the update
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                // Check if the response indicates success
                if (response.indexOf("success") !== -1) {
                    // If successful, show the modal
                    $('#modal-success').modal('show');
                }
            },
            error: function (error) {
                console.log("Error: ", error);
            }

            
        });
    });
});


</script>
  </body>
</html>