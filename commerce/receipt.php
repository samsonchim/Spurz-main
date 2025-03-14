<?php
require "includes/invoicedetails.php";
require "includes/config.php";
require_once 'env.php'; 
loadEnv(); 

$paystackPublicKey = $_ENV['PAYSTACK_PUBLIC_KEY'] ?? '';

if (isset($_SESSION['transaction_id'])) {
    $transaction_id = $_SESSION['transaction_id'];
    unset($_SESSION['transaction_id']); 
} else {
    $transaction_id = "N/A"; 
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="images/logo.png" type="image/x-icon">
    <title>Invoice #<?= htmlspecialchars($invoice['id']); ?></title>
    
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="css/invoice.css" />
    
    <style>
        .pay {
            background-color: orange;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .wrapper-invoice::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40%;
        height: 40%;
        background: url('images/paid.png') no-repeat center;
        background-size: contain;
        opacity: 0.05;
        transform: translate(-50%, -50%);
        pointer-events: none; 
        z-index: 0;
    }

    </style>
</head>
<body>
<div id="successPopup">
    <h2>Payment Success!</h2>
    <p>Your Transaction ID:</p>
    <p id="transactionId"></p>
    <p><strong>Now screenshot this before closing!</strong><br> 
       Keep it safe, never share it with anyone—not even the vendor.<br>
       You will use the code for refunds, complaints, or confirming product delivery.<br>
       No one from <strong>Jaro!</strong> will ever ask you for it.</p>
    <button id="closePopup" onclick="closePopup()">Close</button>
</div>

    
<section class="wrapper-invoice">
    <div class="invoice">
    <div class="invoice-logo-brand">
            <img src="outlet/includes/logos/<?= htmlspecialchars($outlet_logo); ?>" alt="Outlet Logo" />
        </div>
        <div class="invoice-information">
            <p><b>Invoice #</b>: <?= htmlspecialchars($invoice['id']); ?></p>
            <p><b>Delivery Date</b>: <?= date("F d, Y", strtotime($invoice['delivery_date'])); ?></p>
        </div>
       
        <!-- Invoice Head -->
        <div class="invoice-head">
            <div class="head client-info">
                <p><?= htmlspecialchars($invoice['customer_name']); ?></p>
                <p><?= htmlspecialchars($invoice['customer_phone']); ?></p>
                <p><?= htmlspecialchars($invoice['waybill_location']); ?></p>
            </div>
        </div>
        <!-- Invoice Body -->
        <div class="invoice-body">
            <table class="table">
                <thead>
                    <tr>
                        <th>Product Names</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><?= htmlspecialchars($invoice['product_name']); ?></td>
                        <td>N<?= number_format($invoice['product_price'], 2); ?></td>
                    </tr>
                    <tr>
                        <td>Waybill</td>
                        <td>N<?= number_format($invoice['waybill_price'], 2); ?></td>
                    </tr>
                </tbody>
            </table>

            <!-- Invoice Total -->
            <div class="invoice-total-amount">
                <p>Total: N<?= number_format($invoice['total_price'], 2); ?></p>
            </div>
        </div>
        <br>
        <!-- Invoice Footer -->
        <button class="pay" onclick="downloadInvoiceAsImage()" class="w3-button w3-green">Download Reciept</button>
    </div>
</section>
   <script>
document.addEventListener("DOMContentLoaded", function () {
    let urlParams = new URLSearchParams(window.location.search);
    let transactionId = urlParams.get("reference"); 

    if (transactionId) {
        localStorage.setItem("transaction_id", transactionId); 
    } else {
        transactionId = localStorage.getItem("transaction_id"); 
    }

    if (transactionId) {
        document.getElementById("transactionId").textContent = transactionId; 
        document.getElementById("successPopup").style.display = "block"; 
        document.body.classList.add("modal-active"); 
    }
});

function closePopup() {
    document.getElementById("successPopup").style.display = "none"; 
    document.body.classList.remove("modal-active"); 
    localStorage.removeItem("transaction_id"); 
}


</script>


<style>
body.modal-active {
    overflow: hidden;
}

body.modal-active::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); 
    backdrop-filter: blur(5px); 
    z-index: 999;
}

/* Popup container */
#successPopup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 400px;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    text-align: center;
    display: none;
}

/* Transaction ID styling */
#transactionId {
    font-weight: bold;
    color: #333;
    font-size: 1.2em;
}

/* Close button */
#closePopup {
    margin-top: 15px;
    padding: 8px 15px;
    border: none;
    background: #ff4757;
    color: white;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
}

#closePopup:hover {
    background: #e84118;
}

</style>
</body>
</html>
