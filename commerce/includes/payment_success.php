<?php
session_start();
include "config.php"; 

if (!isset($_GET['reference']) || !isset($_GET['id'])) {
    header("Location: failed.php"); 
    exit;
}


$transaction_id = $_GET['reference'];
$invoice_id = intval($_GET['id']);
$csrf_token = bin2hex(random_bytes(32)); 
$payment_date = date("Y-m-d H:i:s"); // Get current date and time

// Fetch the total price and outlet_id for the invoice
$stmt = $conn->prepare("SELECT total_price, outlet_id FROM invoices WHERE id = ?");
$stmt->bind_param("i", $invoice_id);
$stmt->execute();
$stmt->bind_result($paid_amount, $outlet_id);
$stmt->fetch();
$stmt->close();

if (!$paid_amount || !$outlet_id) {
    header("Location: failed.php"); 
    exit;
}

// Update invoice status and payment_date
$stmt = $conn->prepare("UPDATE invoices SET paid = 1, csrf_token = ?, transaction_id = ?, status = 0, payment_date = ? WHERE id = ?");
$stmt->bind_param("sssi", $csrf_token, $transaction_id, $payment_date, $invoice_id);

if ($stmt->execute()) {
    $stmt->close();

    // Update total_revenue in impressions table
    $update_revenue_stmt = $conn->prepare("
        UPDATE impressions 
        SET total_revenue = total_revenue + ? 
        WHERE outlet_id = ?
    ");
    $update_revenue_stmt->bind_param("di", $paid_amount, $outlet_id);
    $update_revenue_stmt->execute();
    $update_revenue_stmt->close();

    $_SESSION['transaction_id'] = $transaction_id;
    header("Location: ../receipt.php?id=" . $invoice_id);
    
    exit;
} else {
    header("Location: failed.php"); 
    exit;
}

$conn->close();
?>
