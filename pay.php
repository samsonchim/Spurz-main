<?php
session_start();

// Validate CSRF token
if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    die("CSRF token validation failed.");
}

// Include Flutterwave library
require 'path/to/flutterwave-php/init.php';

// Set your Flutterwave keys
$public_key = 'FLWPUBK_TEST-6595882c69b3985611b08d8eef317b23-X';
$secret_key = 'FLWSECK_TEST-988174279b76cfa6f7822f42dc3bb401-X';
$encryption_key = 'FLWSECK_TEST14170e76c5d7';

// Initialize Flutterwave
Flutterwave::setApiKey($secret_key);
Flutterwave::setEncryptionKey($encryption_key);

// Collect payment details from the form
$id = $_POST['id'];
$total_due = $_POST['total_due'];
$currency = $_POST['currency'];
$customer_name = $_POST['customer_name'];
$product_name = $_POST['product_name'];

// Assemble payment details
$payment_details = [
    'tx_ref' => uniqid('tx_'), // Generate a unique transaction reference
    'amount' => $total_due,
    'currency' => $currency,
    'redirect_url' => 'http://localhost/paid.php', // Replace with your actual redirect URL
    'customer' => [
        'email' => 'customer@example.com', // Update with customer's email
        'name' => $customer_name,
    ],
    'customizations' => [
        'title' => 'Product Purchase',
        'description' => $product_name,
    ],
];

// Initiate payment
try {
    $response = Flutterwave\Payment::initialize($payment_details);
    $payment_link = $response['data']['link']; // Get the payment link

    // Redirect user to the payment link
    header("Location: $payment_link");
    exit;
} catch (Exception $e) {
    die('Error initiating payment: ' . $e->getMessage());
}
