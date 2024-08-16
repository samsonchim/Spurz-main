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
    header("Location: ../login.html");
    exit();
}

// Initialize message variable
$message = "";

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $productId = $_POST['product_id']; // Retrieve the ID from the hidden input field

    // Check if the product ID exists and is not empty
    if (!empty($productId)) {
        // Query to retrieve the status of the invoice associated with the product ID
        $statusQuery = "SELECT status FROM invoices WHERE id='$productId'";
        $statusResult = mysqli_query($conn, $statusQuery);

        if ($statusResult) {
            // Fetch the status value from the result
            $row = mysqli_fetch_assoc($statusResult);
            $status = $row['status'];

            // Check if the status is "Paid" or "Received"
            if ($status === "Paid" || $status === "Received") {
                // Display message and redirect back to dashboard
                $message = "Payment has been made. You can't edit this invoice.";
                echo "<script>setTimeout(function(){ window.location.href = '../dashboard.php'; }, 5000);</script>";
                exit(); // Stop further execution
            }
        } else {
            $message = "Error fetching invoice status: " . mysqli_error($conn);
        }
    }

    // Retrieve other form data
    $customerName = $_POST['customer_name'];
    $productName = $_POST['product_name'];
    $customerAddress = $_POST['customer_address'];
    $totalPrice = $_POST['total_price'];
    $waybillPrice = $_POST['waybill_price'];
    $expectedDeliveryDate = $_POST['expected_delivery_date'];
    $currency = $_POST['currency'];
    $phone_no = $_POST['phone_no'];
    
    // Sanitize form data
    $customerName = mysqli_real_escape_string($conn, $customerName);
    $productName = mysqli_real_escape_string($conn, $productName);
    $customerAddress = mysqli_real_escape_string($conn, $customerAddress);
    $totalPrice = mysqli_real_escape_string($conn, $totalPrice); 
    $waybillPrice = mysqli_real_escape_string($conn, $waybillPrice);
    $expectedDeliveryDate = mysqli_real_escape_string($conn, $expectedDeliveryDate);
    $phone_no = mysqli_real_escape_string($conn, $phone_no);

    // Check if the product ID is empty (indicating a new record)
    if (empty($productId)) {
        // Create new record
        // Retrieve user ID from session
        $userId = $_SESSION['id'];
        $sql = "INSERT INTO invoices (user_id, currency, customer_name, product_name, customer_address, total_price, waybill_price, expected_delivery_date, phone_no) VALUES ('$userId', '$currency', '$customerName', '$productName', '$customerAddress', '$totalPrice', '$waybillPrice', '$expectedDeliveryDate', '$phone_no')";
    } else {
        // Update existing record
        $productId = mysqli_real_escape_string($conn, $productId); // Sanitize the ID
        $sql = "UPDATE invoices SET customer_name='$customerName',  currency='$currency', phone_no='$phone_no', product_name='$productName', customer_address='$customerAddress', total_price='$totalPrice', waybill_price='$waybillPrice', expected_delivery_date='$expectedDeliveryDate' WHERE id='$productId'";
    }

    if (mysqli_query($conn, $sql)) {
        $message = "Record updated successfully";
        echo "<script>setTimeout(function(){ window.location.href = '../dashboard.php'; }, 5000);</script>";
    } else {
        $message = "Error: " . $sql . "<br>" . mysqli_error($conn);
        echo "<script>setTimeout(function(){ window.location.href = '../dashboard.php'; }, 5000);</script>";
    }

    // Close database connection
    mysqli_close($conn);
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Created Invoice</title>
  <style>
    body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background for blur effect */
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
}

.popup-box {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); /* Drop shadow */
}

p {
  margin: 0;
}

  </style>
</head>
<body>
  <div class="container">
    <div class="popup-box">
      <p><?php echo $message?></p>
    </div>
  </div>
</body>
</html>
