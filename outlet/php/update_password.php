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
    // Return an error message using JSON
    echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
    exit();
}

// Retrieve user ID from the session
$user_id = $_SESSION['id'];

// Check if old_password and new_password are set in the POST request
if (isset($_POST['old_password']) && isset($_POST['new_password'])) {
    // Retrieve old and new passwords from the POST request
    $old_password = $_POST['old_password'];
    $new_password = $_POST['new_password'];

    // Hash the old password for comparison with the one stored in the database
    $checkPasswordSql = "SELECT password FROM outlets WHERE id = '$user_id'";
    $result = $conn->query($checkPasswordSql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hashed_old_password = $row['password'];

        // Check if the old password matches the one in the database
        if (password_verify($old_password, $hashed_old_password)) {
            // Old password matches, update the password
            $hashed_new_password = password_hash($new_password, PASSWORD_DEFAULT);

            // Update the password in the database
            $updatePasswordSql = "UPDATE outlets SET password = '$hashed_new_password' WHERE id = '$user_id'";
            
            if ($conn->query($updatePasswordSql) === TRUE) {
                // Password updated successfully
                echo json_encode(['status' => 'success', 'message' => 'Password updated successfully.']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error updating password: ' . $conn->error]);
            }
        } else {
            // Old password does not match
            echo json_encode(['status' => 'error', 'message' => 'Incorrect old password.']);
        }
    } else {
        // Unable to retrieve the user's password
        echo json_encode(['status' => 'error', 'message' => 'Error retrieving password from the database.']);
    }
} else {
    // Handle the case where old_password or new_password is not set
    echo json_encode(['status' => 'error', 'message' => 'Old password or new password not provided.']);
}

// Close the database connection
$conn->close();
?>
