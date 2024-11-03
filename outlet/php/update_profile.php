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
    echo "You are not logged in.";
    exit();
}

// Retrieve user ID from the session
$user_id = $_SESSION['id'];

// Check if the form fields are set and not empty
if (
    isset($_POST['businessName']) &&
    isset($_POST['location']) &&
    isset($_POST['phone_no']) &&
    isset($_POST['account_no']) &&
    isset($_POST['account_name']) &&
    isset($_POST['bank_name'])
) {
    // Sanitize and validate the form data
    $businessName = mysqli_real_escape_string($conn, $_POST['businessName']);
    $location = mysqli_real_escape_string($conn, $_POST['location']);
    $phone_no = mysqli_real_escape_string($conn, $_POST['phone_no']);
    $account_no = mysqli_real_escape_string($conn, $_POST['account_no']);
    $account_name = mysqli_real_escape_string($conn, $_POST['account_name']);
    $bank_name = mysqli_real_escape_string($conn, $_POST['bank_name']);

    // Update the database record
    $updateSql = "UPDATE outlets SET 
                  businessName = '$businessName',
                  location = '$location',
                  phone_no = '$phone_no',
                  account_no = '$account_no',
                  account_name = '$account_name',
                  bank_name = '$bank_name'
                  WHERE id = '$user_id'";

    if ($conn->query($updateSql) === TRUE) {
        // Check if an image file is uploaded
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] == UPLOAD_ERR_OK) {
            $tempName = $_FILES['logo']['tmp_name'];
            $newName = "logo/{$user_id}.png";

            // Move the uploaded file to the new location with the user ID as the filename
            if (move_uploaded_file($tempName, $newName)) {
                // Update the database record with the new image filename
                $updateImageSql = "UPDATE outlets SET business_logo = '{$user_id}.png' WHERE id = '$user_id'";

                if ($conn->query($updateImageSql) === TRUE) {
                    echo "success: Business details and logo updated";
                } else {
                    echo "Error updating profile: " . $conn->error;
                }
            } else {
                echo "Error moving uploaded file.";
            }
        } else {
            echo "success: Business details updated";
        }
    } else {
        echo "Error updating profile: " . $conn->error;
    }
} else {
    echo "All fields are required.";
}

// Close the database connection
$conn->close();
?>
