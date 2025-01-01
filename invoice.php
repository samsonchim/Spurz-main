<?php
session_start(); 

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['id'])) {
    // Sanitize the input to prevent SQL injection
    $id = mysqli_real_escape_string($conn, $_GET['id']);

    // Prepare SQL statement to fetch data from the invoices table based on the provided ID
    $sql = "SELECT * FROM invoices WHERE id = '$id'";
    
    // Execute the query
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Fetch the data
        $row = $result->fetch_assoc();
        
        // Store fetched data in session variables
        $_SESSION['id'] = $row['id'];
        $_SESSION['customer_name'] = $row['customer_name'];
        $_SESSION['product_name'] = $row['product_name'];
        $_SESSION['customer_address'] = $row['customer_address'];
        $_SESSION['total_price'] = $row['total_price'];
        $_SESSION['waybill_price'] = $row['waybill_price'];
        $_SESSION['expected_delivery_date'] = $row['expected_delivery_date'];
        $_SESSION['created_at'] = $row['created_at'];
        $_SESSION['status'] = $row['status'];
        $_SESSION['currency'] = $row['currency'];
        $_SESSION['customer_email'] = $row['customer_email'];
        $_SESSION['phone_no'] = $row['phone_no'];

        // Remove commas and add prices for total_due
        $total_price_numeric = str_replace(',', '', $row['total_price']);
        $waybill_price_numeric = str_replace(',', '', $row['waybill_price']);

        if (is_numeric($total_price_numeric) && is_numeric($waybill_price_numeric)) {
            $_SESSION['total_due'] = $total_price_numeric + $waybill_price_numeric;
        } else {
            echo "Total price and waybill price must be numeric values.";
        }

    } else {
        echo "No Invoice associated with the URL you entered.";
    }
} else {
    echo "ID parameter not provided.";
}

// Close the database connection
$conn->close();
?>


<!doctype html>

<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <title>Invoice.</title>
    <!-- CSS files -->
    <link href="./outlet/dist/css/tabler.min.css?1684106062" rel="stylesheet"/>
    <link href="./outlet/dist/css/tabler-flags.min.css?1684106062" rel="stylesheet"/>
    <link href="./outlet/dist/css/tabler-payments.min.css?1684106062" rel="stylesheet"/>
    <link href="./outlet/dist/css/tabler-vendors.min.css?1684106062" rel="stylesheet"/>
    <link href="./outlet/dist/css/demo.min.css?1684106062" rel="stylesheet"/>
    <style>
      @import url('https://rsms.me/inter/inter.css');
      :root {
      	--tblr-font-sans-serif: 'Inter Var', -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
      }
      body {
      	font-feature-settings: "cv03", "cv04", "cv11";
      }
    </style>
  </head>
  <body >
    <script src="./dist/js/demo-theme.min.js?1684106062"></script>
    <div class="page">
      <!-- Navbar -->
    
      <div class="page-wrapper">
        <!-- Page header -->
        <div class="page-header d-print-none">
          <div class="container-xl">
            <div class="row g-2 align-items-center">
              <div class="col">
                <h2 class="page-title">
                  Invoice
                </h2>
              </div>
              <!-- Page title actions -->
             
              </div>
            </div>
          </div>
        </div>
                 

          <!-- Page body -->
          <div class="page-body">
            <div class="container-xl">
              <div class="card card-lg">
                <div class="card-body">
                  <div class="row">
                    <div class="col-6">
                      <p class="h3">Delivery Date</p>
                      <address>
                          <?php echo $_SESSION['expected_delivery_date']; ?>
                      </address>
                    </div>
                    <div class="col-6 text-end">
                      <p class="h3">Delivery's Address</p>
                      <address>
                      <?php echo $_SESSION['customer_address']; ?>
                      </address>
                    </div>
                    <div class="col-12 my-5">
                      <h1>Invoice to <?php echo $_SESSION['customer_name']; ?></h1>
                    </div>
                  </div>
                  
                  <table class="table table-transparent table-responsive">
                    <thead>
                      <tr>
                        <th class="text-center" style="width: 1%"></th>
                        <th>Product</th>
                        <th class="text-end" style="width: 1%"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="text-center">1</td>
                        <td>
                          <p class="strong mb-1"><?php echo $_SESSION['product_name']; ?></p>
                        </td>
                        <td class="text-end"></td>
                      </tr>
                      <tr>
                        <td colspan="2" class="strong text-end">Product Amount</td>
                        <td class="text-end"><?php echo $_SESSION['total_price']; ?></td>
                      </tr>
                      <tr>
                        <td colspan="2" class="strong text-end">Waybill Amount</td>
                        <td class="text-end"><?php echo $_SESSION['waybill_price']; ?></td>
                      </tr>
                      <tr>
                        <td colspan="2" class="strong text-end">Customer Email</td>
                        <td class="text-end"><?php echo $_SESSION['customer_email']; ?></td>
                      </tr>
                    </tbody>
                  </table>

                  <form id="payment-form">
                    <?php
                    // Generate CSRF token
                    $csrf_token = bin2hex(random_bytes(32));
                    $_SESSION['csrf_token'] = $csrf_token;
                    $tx_ref = "spurz-" . $csrf_token;
                    ?>

                    <input type="hidden" id="tx_ref" value="<?php echo $tx_ref; ?>">
                    <input type="hidden" id="total_due" value="<?php echo $_SESSION['total_due']; ?>">
                    <input type="hidden" id="currency" value="<?php echo $_SESSION['currency']; ?>">
                    <input type="hidden" id="customer_name" value="<?php echo $_SESSION['customer_name']; ?>">
                    <input type="hidden" id="product_name" value="<?php echo $_SESSION['product_name']; ?>">
                    <input type="hidden" id="phone_no" value="<?php echo $_SESSION['phone_no']; ?>">
                    <input type="hidden" id="customer_email" value="<?php echo $_SESSION['customer_email']; ?>">

                    <button type="button" class="btn btn-primary" onclick="makePayment()">Pay Now</button>
                  </form>
                </div>
              </div>
            </div>
          </div>


            </table>
            <p class="text-muted text-center mt-5">Thank you very much for doing business with us. We look forward to working with
              you again!</p>
          </div>
        </div>
      </div>
    </div>
        <footer class="footer footer-transparent d-print-none">
          <div class="container-xl">
            <div class="row text-center align-items-center flex-row-reverse">
              <div class="col-lg-auto ms-lg-auto">
               
              </div>
              <div class="col-12 col-lg-auto mt-3 mt-lg-0">
                <ul class="list-inline list-inline-dots mb-0">
                  <li class="list-inline-item">
                    Copyright &copy; 2023
                    <a href="." class="link-secondary">Spurz</a>.
                    All rights reserved.
                  </li>
                  <li class="list-inline-item">
                   
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
    <!-- Libs JS -->
    <!-- Tabler Core -->
    <script src="./dist/js/tabler.min.js?1684106062" defer></script>
    <script src="./dist/js/demo.min.js?1684106062" defer></script>
    <script src="https://js.paystack.co/v1/inline.js"></script>
    <script>
function makePayment() {
    const tx_ref = `spurz-${Math.random().toString(36).substr(2, 9)}`;
    const total_due = document.getElementById("total_due").value.trim();
    const currency = document.getElementById("currency").value.trim();
    const customer_name = document.getElementById("customer_name").value.trim();
    const customer_email = document.getElementById("customer_email").value.trim();
    const phone_no = document.getElementById("phone_no").value.trim();
    const product_name = document.getElementById("product_name").value.trim();

    // Validate required fields
    if (!total_due || !currency || !customer_name || !customer_email || !phone_no || !product_name) {
        alert("Please fill in all required fields.");
        return;
    }

    // Save transaction details temporarily in localStorage
    const transactionDetails = {
        tx_ref,
        total_due,
        currency,
        customer_name,
        customer_email,
        phone_no,
        product_name
    };

    localStorage.setItem("transactionDetails", JSON.stringify(transactionDetails));

    const handler = PaystackPop.setup({
        key: 'pk_test_0b8d27dd9b07aed5a917d639a77cec404aac7d87', // Replace with your public key
        email: customer_email,
        amount: parseFloat(total_due) * 100, // Paystack expects amount in kobo
        currency: currency,
        ref: tx_ref, // Reference must be unique for each transaction
        callback: function (response) {
            // Payment was successful
            const transaction_id = response.reference;
            processTransaction(transaction_id);
        },
        onClose: function () {
            alert('Transaction was not completed, window closed.');
        }
    });

    handler.openIframe();
}

function processTransaction(transaction_id) {
    const transactionDetails = JSON.parse(localStorage.getItem("transactionDetails"));

    // Ensure transaction details exist
    if (!transactionDetails) {
        alert("Transaction details are missing. Please try again.");
        return;
    }

    // Prepare data to send to the server
    const formData = new FormData();
    formData.append("tx_ref", transactionDetails.tx_ref);
    formData.append("transaction_id", transaction_id);
    formData.append("total_due", transactionDetails.total_due);
    formData.append("currency", transactionDetails.currency);
    formData.append("customer_name", transactionDetails.customer_name);
    formData.append("customer_email", transactionDetails.customer_email);
    formData.append("phone_no", transactionDetails.phone_no);
    formData.append("product_name", transactionDetails.product_name);

    // Send transaction details to the server
    fetch("pay.php", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Payment successful! Transaction details saved.");
            // Remove the transaction details from localStorage after confirming server success
            localStorage.removeItem("transactionDetails");
            window.location.href = "thank-you.html?transaction_id=" + transaction_id;
        } else {
            alert(`Payment successful, but saving transaction failed: ${data.message}`);
            window.location.href = "failed.html";
        }
    })
    .catch(error => {
        console.error("Error saving transaction:", error);
        alert("An error occurred while saving the transaction. Please contact support.");
        window.location.href = "failed.html";
    });
}

</script>

</body>
</html>
