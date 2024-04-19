<?php
session_start(); // Start the session

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function verifyPassword($inputPassword, $hashedPassword) {
    return password_verify($inputPassword, $hashedPassword);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve data from the form
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Check if fields are not empty
    if (empty($email) || empty($password)) {
        echo "Please fill in all the fields.";
        exit();
    }

    // Use prepared statement to fetch data from the database
    $sql = "SELECT user_id, password FROM users WHERE email = ?";
    $stmt = mysqli_prepare($conn, $sql);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "s", $email);

        if (mysqli_stmt_execute($stmt)) {
            $result = mysqli_stmt_get_result($stmt);

            // Check if the user exists
            if ($row = mysqli_fetch_assoc($result)) {
                // Verify the password
                if (verifyPassword($password, $row['password'])) {
                    // Set session variables
                    $_SESSION['user_id'] = $row['user_id'];

                    // Echo a success message
                    echo "Login Successful";
                    exit();
                } else {
                    echo "Incorrect Password for this account.";
                }
            } else {
                echo "No account with this Email.";
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
}
?>
