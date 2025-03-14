<?php
require "includes/invoicedetails.php";
require "includes/config.php";
require_once 'env.php'; 
loadEnv(); 

$paystackPublicKey = $_ENV['PAYSTACK_PUBLIC_KEY'] ?? '';

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
    </style>
</head>
<body>


<section class="wrapper-invoice">
    <div class="invoice">
    <div class="invoice-logo-brand">
            <img src="outlet/includes/logos/<?= htmlspecialchars($outlet_logo); ?>" alt="Outlet Logo" />
        </div>
        <div class="invoice-information">
            <p><b>Invoice #</b>: <?= htmlspecialchars($invoice['id']); ?></p>
            <p><b>Created Date</b>: <?= date("F d, Y", strtotime($invoice['created_at'])); ?></p>
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
        <div class="invoice-footer">
            <p>Please Confirm the page you are on is <strong>http://commerce/pay.php?id=<?= htmlspecialchars($invoice['id']); ?></strong> before you proceed</p> <br>
            <button class="pay" onclick="payWithPaystack()">Proceed to Pay</button>
        </div>
    </div>
</section>

<!-- Load Paystack Library -->
<script src="https://js.paystack.co/v1/inline.js"></script>

<script>
function payWithPaystack() {
    var handler = PaystackPop.setup({
        key: "<?= htmlspecialchars($paystackPublicKey); ?>",
        email: "chimaraokesamson@gmail.com",
        amount: <?= $invoice['total_price'] * 100; ?>, 
        currency: "NGN",
        ref: "INV<?= time(); ?>", 
        callback: function(response) {
            alert('Payment successful! Transaction ID: ' + response.reference);
            window.location.href = "receipt.php?reference=" + response.reference + "&id=<?= $invoice['id']; ?>";
        },
        onClose: function() {
            alert('Transaction was not completed.');
        }
    });
    handler.openIframe();
}


</script>


</body>
</html>
