<?php
session_start();
require_once "config.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $outlet_name = $_POST["outlet_name"];
    $account_no = trim($_POST["account_no"]);
    $account_name = trim($_POST["account_name"]);
    $bank_name = trim($_POST["bank_name"]);
    $location = trim($_POST["location"]);
    $whatsapp_no = trim($_POST["whatsapp_no"]);

    // Handle logo upload
    if (isset($_FILES["logo"]) && $_FILES["logo"]["error"] === 0) {
        $logo_ext = pathinfo($_FILES["logo"]["name"], PATHINFO_EXTENSION);
        $logo_name = strtolower($outlet_name) . ".png";
        $logo_path = "logos/" . $logo_name;

        if (move_uploaded_file($_FILES["logo"]["tmp_name"], $logo_path)) {
            // Store data in the database
            $stmt = $conn->prepare("UPDATE outlets SET account_no=?, account_name=?, bank_name=?, location=?, whatsapp_no=?, logo=? WHERE outlet_name=?");
            $stmt->bind_param("sssssss", $account_no, $account_name, $bank_name, $location, $whatsapp_no, $logo_name, $outlet_name);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Details saved successfully!"]);
            } else {
                echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["success" => false, "message" => "Failed to upload logo."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid logo file."]);
    }
}

$conn->close();
?>
