<?php
require "config.php"; 

header("Content-Type: application/json"); 

$response = ["status" => "error", "message" => "Something went wrong!"];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $customer_name = trim($_POST["customer_name"]);
    $customer_no = trim($_POST["customer_no"]);
    $transaction_id = trim($_POST["transaction_id"]);
    $status = trim($_POST["status"]);
    $review = trim($_POST["review"]);

    if (empty($customer_name) || empty($customer_no) || empty($transaction_id) || empty($status)) {
        $response["message"] = "All fields are required.";
        echo json_encode($response);
        exit;
    }
    
    $query = "SELECT id, outlet_id FROM invoices WHERE transaction_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $transaction_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $response["message"] = "No recognized transaction ID.";
        echo json_encode($response);
        exit;
    }

    $row = $result->fetch_assoc();
    $invoice_id = $row["id"];
    $outlet_id = $row["outlet_id"];

    if ($status === "Received") { 
        $updateQuery = "UPDATE invoices SET status = 1 WHERE id = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("i", $invoice_id);

        if ($updateStmt->execute()) {
            $response["message"] = "Confirmation successful, status updated!";
        } else {
            $response["message"] = "Error updating status: " . $updateStmt->error;
        }
    }

    if (!empty($review)) {
        $insertQuery = "INSERT INTO outlet_reviews (outlet_id, customer_name, customer_no, review, created_at) 
                        VALUES (?, ?, ?, ?, NOW())";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param("isss", $outlet_id, $customer_name, $customer_no, $review);
        $insertStmt->execute();
    }

    $response["status"] = "success";
}

echo json_encode($response);
?>
