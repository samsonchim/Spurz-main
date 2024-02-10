<?php
$uploadDir = "php/logo/";
$allowedTypes = array("image/jpeg", "image/png", "image/gif");

// Start session
session_start();

// Check if the user is logged in
if (!isset($_SESSION['id'])) {
    echo "error:User not logged in.";
    exit();
}

// Retrieve user ID from the session
$user_id = $_SESSION['id'];

// Check if the file is set and is of an allowed type
if (isset($_FILES["logo"]) && in_array($_FILES["logo"]["type"], $allowedTypes)) {
    $tempName = $_FILES["logo"]["tmp_name"];
    $fileName = "{$user_id}.png"; // Rename the file to user_id.png

    // Construct the path to move the file to
    $targetPath = $uploadDir . $fileName;

    // Move the file to the target path
    if (move_uploaded_file($tempName, $targetPath)) {
        // If successful, update the database record with the new image filename
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "Sellbizzhub";

        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            echo "error:Connection failed: " . $conn->connect_error;
            exit();
        }

        // Update the database record with the new image filename
        $updateImageSql = "UPDATE outlets SET business_logo = '{$user_id}.png' WHERE id = '$user_id'";

        if ($conn->query($updateImageSql) === TRUE) {
            echo "success:Logo updated";
        } else {
            echo "error:Error updating logo: " . $conn->error;
        }

        // Close the database connection
        $conn->close();
    } else {
        echo "error:Failed to move the file.";
    }
} else {
    echo "error:Invalid file type or file not set.";
}
?>
