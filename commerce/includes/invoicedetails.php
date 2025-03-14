<?php
session_start();
include "config.php"; 

if (!isset($_GET['id']) || empty($_GET['id'])) {
    die("Invalid Invoice ID");
}

$invoice_id = intval($_GET['id']);

$stmt = $conn->prepare("SELECT * FROM invoices WHERE id = ?");
$stmt->bind_param("i", $invoice_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Invoice not found.");
}

$invoice = $result->fetch_assoc();
$stmt->close();

$outlet_id = $invoice['outlet_id']; 


$logo_query = $conn->prepare("SELECT logo, email FROM outlets WHERE id = ?");
$logo_query->bind_param("i", $outlet_id);
$logo_query->execute();
$logo_result = $logo_query->get_result();
$outlet_data = $logo_result->fetch_assoc();

$outlet_logo = $outlet_data['logo'] ?? 'default_logo.png'; 
$outlet_email = $outlet_data['email'] ?? 'not_available@example.com'; 

$logo_query->close();
$conn->close();
?>
