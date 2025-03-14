<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="images/flogo/logo.png" type="image/x-icon">
    <title>Product Confirmation</title>

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


</style>
<body>

    <div class="mainform">
        <form id="confirmationForm">
            <!-- Header -->
            <div class="header">
                <h1><b>Product Confirmation</b></h1>
                <p>Please confirm that you have received the product in good condition so we can proceed with releasing the payment to the seller. 
                    If you do not confirm within 24 hours of receiving the product, the payment will be automatically released. 
                    If you need a refund, please use this <a href="request_refund.php">form</a>.</p>
                <hr/>
            </div>

            <!-- Message Box -->
            <div id="messageBox"></div>

            <!-- Transaction ID -->
            <div class="form-group">
                <label for="transaction_id"><b>Transaction ID:</b></label>
                <input type="text" class="form-control" id="transaction_id" placeholder="Transaction ID" name="transaction_id">
            </div>

            <br><br>

            <!-- Name -->
            <div class="form-group">
                <label for="customer_name"><b>Name:</b></label>
                <input type="text" class="form-control" id="customer_name" placeholder="Your Name" name="customer_name">
            </div>

            <!-- Phone Number -->
            <div class="form-group">
                <label for="phone"><b>Phone Number:</b></label>
                <input type="text" id="phone" class="form-control" placeholder="Enter WhatsApp Number" name="customer_no">
            </div>

            <!-- Product Status -->
            <div class="form-group">
                <label for="status"><b>What's the status of your product?</b></label>
                <select id="status" name="status">
                    <option value="">----</option>
                    <option value="Received">Received</option>
                    <option value="Not Received">Not Received</option>
                </select>
            </div>

            <!-- Review -->
            <div class="form-group">
                <label for="review"><b>Leave a Review for the Outlet</b></label>
                <textarea id="review" name="review" placeholder="Enter your review, be as honest as possible..." style="height:200px"></textarea>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="submitBtn" class="btn btn-outline-primary">Submit</button>
        </form>
    </div>

    <script>
        document.getElementById("confirmationForm").addEventListener("submit", function(event) {
            event.preventDefault(); 

            let messageBox = document.getElementById("messageBox");
            messageBox.style.display = "none"; 

            let customerName = document.getElementById("customer_name").value.trim();
            let customerNo = document.getElementById("phone").value.trim();
            let transactionId = document.getElementById("transaction_id").value.trim();
            let status = document.getElementById("status").value;
            let review = document.getElementById("review").value.trim();

            // Validation check
            if (!customerName || !customerNo || !transactionId || !status) {
                messageBox.textContent = "Please fill in all required fields.";
                messageBox.className = "error";
                messageBox.style.display = "block";
                return;
            }

            let formData = new FormData();
            formData.append("customer_name", customerName);
            formData.append("customer_no", customerNo);
            formData.append("transaction_id", transactionId);
            formData.append("status", status);
            formData.append("review", review);

            // Send form data via AJAX
            fetch("includes/insertReviews.php", {
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

<style>
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
</body>

</html>