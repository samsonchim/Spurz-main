<?php
require_once "config.php";

if (!isset($_SESSION["outlet_id"])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit;
}

$outlet_id = $_SESSION["outlet_id"];

$stmt = $conn->prepare("SELECT total_orders, total_revenue, page_visitors, products, followers, likes, reviews FROM impressions WHERE outlet_id = ?");
$stmt->bind_param("i", $outlet_id);
$stmt->execute();
$stmt->bind_result($total_orders, $total_revenue, $page_visitors, $products, $followers, $likes, $reviews);
$stmt->fetch();
$stmt->close();


$impressions = [
    "total_orders" => $total_orders,
    "total_revenue" => $total_revenue,
    "page_visitors" => $page_visitors,
    "products" => $products,
    "followers" => $followers,
    "likes" => $likes,
    "reviews" => $reviews
];


$conn->close();
?>
