<?php
require "config.php"; 

header("Content-Type: application/json");

$response = ["status" => "error", "message" => "Something went wrong!"];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve product_id from POST instead of GET
    if (!isset($_POST["product_id"]) || empty($_POST["product_id"])) {
        $response["message"] = "Invalid or missing product ID.";
        echo json_encode($response);
        exit;
    }

    $product_id = intval($_POST["product_id"]); 
    $customer_name = trim($_POST["customer_name"]);
    $transaction_id = trim($_POST["transaction_id"]);
    $review = trim($_POST["review"]);

    if (empty($customer_name) || empty($transaction_id) || empty($review)) {
        $response["message"] = "All fields are required.";
        echo json_encode($response);
        exit;
    }

    $query = "SELECT id FROM invoices WHERE transaction_id = ? AND status = 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $transaction_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $response["message"] = "Invalid transaction ID or status is not eligible for review.";
        echo json_encode($response);
        exit;
    }

    $insertQuery = "INSERT INTO reviews (product_id, name, review, created_at) 
                    VALUES (?, ?, ?, NOW())";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("iss", $product_id, $customer_name, $review);
    
    if ($insertStmt->execute()) {
        $response = ["status" => "success", "message" => "Review submitted successfully!"];
    } else {
        $response["message"] = "Failed to submit review.";
    }

    $insertStmt->close();
    $stmt->close();
}

$conn->close();
echo json_encode($response);
?>
