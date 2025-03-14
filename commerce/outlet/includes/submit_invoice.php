<?php
session_start();
include "config.php"; 

if (!isset($_SESSION['outlet_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

$outlet_id = $_SESSION['outlet_id'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $product_name = trim($_POST["product_name"]);
    $product_price = intval($_POST["product_price"]); 
    $waybill_price = intval($_POST["waybill_price"]); 
    $customer_name = trim($_POST["customer_name"]);
    $customer_phone = intval($_POST["customer_phone"]);
    $waybill_location = trim($_POST["waybill_location"]);
    $delivery_date = $_POST["delivery_date"];
    $total_price = $product_price + $waybill_price; 

    if (empty($product_name) || empty($customer_name) || empty($customer_phone) || empty($waybill_location) || empty($delivery_date)) {
        echo "All fields are required.";
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO invoices (outlet_id, product_name, product_price, waybill_price, customer_name, customer_phone, waybill_location, delivery_date, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isiisissi", $outlet_id, $product_name, $product_price, $waybill_price, $customer_name, $customer_phone, $waybill_location, $delivery_date, $total_price);

        if ($stmt->execute()) {
            echo "Invoice successfully submitted!";
        } else {
            echo "Error: " . $stmt->error;
        }
        $update_impression_stmt = $conn->prepare("
        UPDATE impressions 
        SET total_orders = total_orders + 1 
        WHERE outlet_id = ?
    ");
        $update_impression_stmt->bind_param("i", $outlet_id);
        $update_impression_stmt->execute();
        $update_impression_stmt->close();


    $stmt->close();
}

$conn->close();
?>
