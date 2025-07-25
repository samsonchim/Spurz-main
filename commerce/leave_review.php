<?php
include_once("includes/leavereview_details.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="images/flogo/logo.png" type="image/x-icon">
    <title>Leave Review</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>

<style>
    
    .mainform{
    margin: 50px 230px 50px 230px;
    padding: 2rem;
    border: 1px solid rgb(224,224,224) ;
    border-radius: 15px;
    box-shadow: 10px 7px 0 rgb(224,224,224);
    background-color: white;
    display: flex;
    }

    .header{
        font-size: 17px;
        font-family: candara;
        display: flex-end;
    }

    input[type=text], select, textarea {
    display: flex;
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 16px;
    resize: vertical;
}

@media screen and (max-width: 680px) {
  .header, .mainform, input[type=submit] {
    margin: 0px 0px 0px 0px;
    
  }
}

#messageBox {
    display: none;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    text-align: center;
}
.success {
    background-color: #4CAF50;
    color: white;
}
.error {
    background-color: #FF5733;
    color: white;
}


</style>
<body>

<div class="mainform">
    <form id="confirmationForm">
    <input type="hidden" id="product_id" name="product_id" value="<?php echo htmlspecialchars($_GET['id']); ?>">

        <!-- Header -->
        <div class="header">
            <h3><b>Please Leave a Review for This Product</b></h3>
            <p>Help us improve our services by leaving a review for the product you purchased.</p>
            <hr/>
        </div>

        <!-- Message Box -->
        <div id="messageBox" style="display: none;"></div>

        <!-- Product Title -->
        <div class="form-group">
            <label><b><h2><?php echo htmlspecialchars($product_title); ?></h2></b></label>
        </div>

        <br><br>

        <!-- Product Image -->
        <img src="<?php echo htmlspecialchars($product_img); ?>" alt="Product Image" width="70%" height="300">

        <br><br>

        <!-- Transaction ID -->
        <div class="form-group">
            <label for="transaction_id"><b>Transaction ID:</b></label>
            <input type="text" class="form-control" id="transaction_id" placeholder="Transaction ID" name="transaction_id">
        </div>

        <!-- Customer Name -->
        <div class="form-group">
            <label for="customer_name"><b>Name</b></label>
            <input type="text" id="customer_name" class="form-control" placeholder="Your Name" name="customer_name">
        </div>

        <!-- Review -->
        <div class="form-group">
            <label for="review"><b>Leave a Review for This Product</b></label>
            <textarea id="review" name="review" placeholder="Enter your review, be as honest as possible..." style="height:200px"></textarea>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-outline-primary">Submit</button>
    </form>
</div>

<script>
    document.getElementById("confirmationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let messageBox = document.getElementById("messageBox");
    messageBox.style.display = "none";

    let productId = document.getElementById("product_id").value;
    let customerName = document.getElementById("customer_name").value.trim();
    let transactionId = document.getElementById("transaction_id").value.trim();
    let review = document.getElementById("review").value.trim();

    if (!customerName || !transactionId || !review) {
        messageBox.textContent = "Please fill in all required fields.";
        messageBox.className = "error";
        messageBox.style.display = "block";
        return;
    }

    let formData = new FormData();
    formData.append("product_id", productId);
    formData.append("customer_name", customerName);
    formData.append("transaction_id", transactionId);
    formData.append("review", review);

    fetch("includes/insertproductReviews.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        messageBox.textContent = data.message;
        messageBox.style.display = "block";

        if (data.status === "success") {
            messageBox.className = "success";
            document.getElementById("confirmationForm").reset();
        } else {
            messageBox.className = "error";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        messageBox.textContent = "Something went wrong. Please try again.";
        messageBox.className = "error";
        messageBox.style.display = "block";
    });
});

</script>
</body>
</html>