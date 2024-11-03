<?php
session_start(); 

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve data from the form
    $businessName = $_POST["businessName"];
    $email = $_POST["email"];
    $businessType = $_POST["businessType"];
    $password = $_POST["password"];
    $cpassword = $_POST["cpassword"];

    // Check if fields are not empty
    if (empty($businessName) || empty($email) || empty($businessType) || empty($password) || empty($cpassword)) {
        echo "Please fill in all the fields.";
        exit();
    }

    // Check if password and confirm password match
    if ($password != $cpassword) {
        echo "Password and Confirm Password do not match.";
        exit();
    }

    // Check if the password is at least 8 characters long
    if (strlen($password) < 8) {
        echo "Password should be at least 8 characters long.";
        exit();
    }

    // Check if the email already exists in the database
    $checkEmailQuery = "SELECT * FROM outlets WHERE email = ?";
    $stmt = $conn->prepare($checkEmailQuery);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Email already exists. Please choose a different email.";
        exit();
    }

    // Hash the password
    $hashedPassword = hashPassword($password);

    // Use prepared statement to insert data into the database
    $sql = "INSERT INTO outlets (businessName, email, businessType, password) 
            VALUES (?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $sql);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "ssss", $businessName, $email, $businessType, $hashedPassword);

        if (mysqli_stmt_execute($stmt)) {
            // Set session variables
            $_SESSION['id'] = mysqli_insert_id($conn); 
            $_SESSION['businessName'] = $businessName;
        
            echo "Registration Successful";
            exit();
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
}
?>
