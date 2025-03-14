<?php
require_once 'config.php'; 

if (isset($_GET['id'])) {
    $product_ID = intval($_GET['id']); 

    $update_views_query = $conn->prepare("UPDATE products SET views = views + 1 WHERE product_id = ?");
    $update_views_query->bind_param("i", $product_ID);
    $update_views_query->execute();
    $update_views_query->close();
}
?>
