<?php
session_start();
include "config.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    if (empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, outlet_name, password FROM outlets WHERE email = ?");
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $outlet_name, $hashed_password);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            // ✅ Store session variables correctly
            $_SESSION["outlet_id"] = $user_id;
            $_SESSION["outlet_name"] = $outlet_name;
            $_SESSION["email"] = $email;

            echo json_encode([
                "success" => true,
                "message" => "Login successful! Redirecting...",
                "redirect" => "dashboard.php"
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Incorrect password."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "No account found with this email."]);
    }

    $stmt->close();
    $conn->close();
}
?>
