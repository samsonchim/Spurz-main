<?php
session_start(); 

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
require_once "config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $outlet_name = trim($_POST["business_name"]);
    $category = trim($_POST["business_category"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    if (!preg_match("/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/", $password)) {
        echo json_encode(["success" => false, "message" => "Password must be at least 8 characters long and include letters, numbers, and special characters (@$!%*?&)."]);
        exit();
    }

    $checkEmail = $conn->prepare("SELECT id FROM outlets WHERE email = ?");
    $checkEmail->bind_param("s", $email);
    $checkEmail->execute();
    $checkEmail->store_result();

    if ($checkEmail->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "An Outlet is associated with this Email. Please use a different Email."]);
        exit();
    }
    $checkEmail->close();

    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO outlets (outlet_name, category, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $outlet_name, $category, $email, $hashed_password);

    if ($stmt->execute()) {
        $outlet_id = $stmt->insert_id; 
        
        $stmtImpressions = $conn->prepare("INSERT INTO impressions (outlet_id) VALUES (?)");
        $stmtImpressions->bind_param("i", $outlet_id);
        $stmtImpressions->execute();
        $stmtImpressions->close();

        // Set session variables
        $_SESSION["outlet_id"] = $outlet_id;
        $_SESSION["outlet_name"] = $outlet_name;
        $_SESSION["email"] = $email;
        $_SESSION["category"] = $category;

        echo json_encode(["success" => true, "message" => "Outlet created successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to create outlet. Error: " . $stmt->error]);
    }

    $stmt->close();
}
$conn->close();
?>
