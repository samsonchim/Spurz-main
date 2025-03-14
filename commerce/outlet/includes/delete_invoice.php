<?php
session_start();
include "config.php"; 

if (!isset($_SESSION['outlet_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["invoice_id"])) {
    $outlet_id = $_SESSION['outlet_id'];
    $invoice_id = intval($_POST["invoice_id"]);

    $query = "SELECT paid FROM invoices WHERE id = ? AND outlet_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $invoice_id, $outlet_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $invoice = $result->fetch_assoc();

    if (!$invoice) {
        echo json_encode(["success" => false, "message" => "Invoice not found or access denied."]);
        exit;
    }

    if ($invoice["paid"] == 1) {
        echo json_encode(["success" => false, "message" => "Cannot delete a paid invoice."]);
        exit;
    }

    $deleteQuery = "DELETE FROM invoices WHERE id = ? AND outlet_id = ?";
    $deleteStmt = $conn->prepare($deleteQuery);
    $deleteStmt->bind_param("ii", $invoice_id, $outlet_id);

    if ($deleteStmt->execute()) {
        echo json_encode(["success" => true, "message" => "Invoice deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error deleting invoice."]);
    }

    $stmt->close();
    $deleteStmt->close();
}

$conn->close();
?>
