<?php
session_start();
include "config.php"; 

if (!isset($_SESSION['outlet_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

$outlet_id = $_SESSION['outlet_id'];

$outlet_name = "";
$query = $conn->prepare("SELECT outlet_name FROM outlets WHERE id = ?");
$query->bind_param("i", $outlet_id);
$query->execute();
$query->bind_result($outlet_name);
$query->fetch();
$query->close();

if (empty($outlet_name)) {
    echo json_encode(["success" => false, "message" => "Outlet not found"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $product_title = trim($_POST["product_title"]);
    $product_price = str_replace(',', '', $_POST["product_price"]); 
    $product_desc = trim($_POST["product_desc"]);
    $product_left = trim($_POST["product_left"]);

    $stmt = $conn->prepare("
        INSERT INTO products (outlet_id, product_title, product_price, product_desc, product_left, product_author) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("isdsss", $outlet_id, $product_title, $product_price, $product_desc, $product_left, $outlet_name);

    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Error adding product"]);
        exit;
    }

    $product_id = $stmt->insert_id; 
    $stmt->close();

    if (isset($_FILES["image_1"]) && $_FILES["image_1"]["error"] == 0) {
        $upload_folder = __DIR__ . "/../../admin/upload/"; 
        $new_filename = $product_id . ".png"; 
        $target_file = $upload_folder . $new_filename;

        if (move_uploaded_file($_FILES["image_1"]["tmp_name"], $target_file)) {
            $update_stmt = $conn->prepare("UPDATE products SET product_img = ? WHERE product_id = ?");
            $update_stmt->bind_param("si", $new_filename, $product_id);
            $update_stmt->execute();
            $update_stmt->close();
        }
    }

    $update_impression_stmt = $conn->prepare("
        UPDATE impressions 
        SET products = products + 1 
        WHERE outlet_id = ?
    ");
    $update_impression_stmt->bind_param("i", $outlet_id);
    $update_impression_stmt->execute();
    $update_impression_stmt->close();

    echo json_encode(["success" => true, "message" => "Product added successfully and impressions updated"]);

    $conn->close();
}
?>
