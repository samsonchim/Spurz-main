<?php
  include_once('includes/nav.php');

?>
    <div class="w3-main" style="margin-top:54px">
      <div style="padding:16px 32px">
        <h3>Create Payment Invoice</h3>
        <div class="w3-row-padding w3-stretch">
         
        <!----------------Use this-------------------->
        <div class="w3-white w3-round w3-margin-bottom w3-border">
    <header class="w3-padding-large w3-large w3-border-bottom" style="font-weight: 500">Invoice</header>
    <div class="w3-padding-large">
        <form id="invoice-form">
            <div class="w3-row w3-margin-bottom">
                <label for="product-name" class="w3-col l2">Product Name</label>
                <div class="w3-col l10">
                    <input type="text" name="product_name" id="product-name" class="w3-input w3-border w3-round" placeholder="What's the Customer Buying from you?">
                </div>
            </div>

            <div class="w3-row w3-margin-bottom">
                <label for="product-price" class="w3-col l2">Product Price</label>
                <div class="w3-col l10">
                    <input type="number" name="product_price" id="product-price" class="w3-input w3-border w3-round" placeholder="How much did you agree to sell it?" required oninput="calculateTotal()">
                </div>
            </div>

            <div class="w3-row w3-margin-bottom">
                <label for="waybill-price" class="w3-col l2">Waybill Price</label>
                <div class="w3-col l10">
                    <input type="number" name="waybill_price"  id="waybill-price" class="w3-input w3-border w3-round" placeholder="How much are you charging for delivery?" required oninput="calculateTotal()">
                </div>
            </div>

            <div class="w3-row w3-margin-bottom">
                <label for="customer-name" class="w3-col l2">Customer's Name</label>
                <div class="w3-col l10">
                    <input type="text" name="customer_name" id="customer-name" class="w3-input w3-border w3-round" placeholder="Who is buying?">
                </div>
            </div>

            <div class="w3-row w3-margin-bottom">
                <label for="customer-phone" class="w3-col l2">Customer's Phone Number</label>
                <div class="w3-col l10">
                    <input type="number" name="customer_phone" id="customer-phone" class="w3-input w3-border w3-round" placeholder="What's the customer's phone number?">
                </div>
            </div>

            <div class="w3-row w3-margin-bottom">
                <label for="waybill-location" class="w3-col l2">Waybill Location</label>
                <div class="w3-col l10">
                    <input type="text" name="waybill_location" id="waybill-location" class="w3-input w3-border w3-round" placeholder="Where are you delivering to?">
                </div>
            </div>

            <div class="w3-row w3-margin-bottom">
                <label for="delivery-date" class="w3-col l2">Expected Delivery Date</label>
                <div class="w3-col l10">
                    <input type="date" name="delivery_date" id="delivery-date" class="w3-input w3-border w3-round">
                </div>
            </div>

            <div class="w3-row w3-margin-bottom">
                <label for="total-price" class="w3-col l2">Total Price</label>
                <div class="w3-col l10">
                    <input type="text" name="total_price" id="total-price" class="w3-input w3-border w3-round" readonly>
                </div>
            </div>

            <div class="w3-row w3-margin-bottom">
                <div class="w3-col l2">&nbsp;</div>
                <div class="w3-col l10">
                    <label>
                        <input type="checkbox" class="w3-check" checked> I Agree Terms &amp; Conditions
                    </label>
                </div>
            </div>

            <div class="w3-row w3-margin-bottom">
                <div class="w3-col l2">&nbsp;</div>
                <div class="w3-col l10">
                    <button type="button" id="submit-btn" class="w3-button w3-primary w3-round"><i class="fa fa-fw fa-lock"></i> Create Invoice</button>
                </div>
            </div>
        </form>
    </div>
</div>

<script>
    function calculateTotal() {
        let productPrice = parseFloat(document.getElementById("product-price").value) || 0;
        let waybillPrice = parseFloat(document.getElementById("waybill-price").value) || 0;

        let totalPrice = productPrice + waybillPrice;
        
        // Format and display the total price
        document.getElementById("total-price").value = totalPrice.toLocaleString();
    }

    //submit invoice
    document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit-btn").addEventListener("click", function (e) {
        e.preventDefault(); 

        let formElement = document.getElementById("invoice-form");
        let formData = new FormData(formElement);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "includes/submit_invoice.php", true);
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                alert(xhr.responseText); 
                formElement.reset(); 
            }
        };

        xhr.send(formData);
    });
});


</script>
