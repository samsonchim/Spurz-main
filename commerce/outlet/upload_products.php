<?php
include_once('includes/nav.php');
?>
    <div class="w3-container w3-padding content">
    </div>

    <style>
  .logo-circle {
    border-radius: 50%;

    display: block;
    }
    .logo-preview {
            width: 50%;
            height: 70%;
            object-fit: cover;
            display: none;
        }
        .tooltip-container {
            position: relative;
            display: inline-block;
        }

        .tooltip-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: blue;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            margin-left: 5px;
            transition: background 0.3s ease;
        }

        .tooltip-icon:hover {
            background-color: darkblue;
        }

        .tooltip-text {
            visibility: hidden;
            opacity: 0;
            position: absolute;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            left: 105%; 
            top: 50%;
            transform: translateY(-50%);
            transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        }

        .tooltip-container:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }

        @media (max-width: 600px) {
            .tooltip-text {
                left: 50%;
                top: 120%;
                transform: translateX(-50%);
                white-space: normal; 
                width: 180px; 
                text-align: center;
            }
        }

    .content {
    margin-left: 120px; 
    transition: margin 0.3s ease-in-out;
    }

    @media screen and (max-width: 768px) {
        .content {
            margin-left: 0; 
        }
    }

    .w3-button {
    padding: 14px;
    }

    </style>
      <div class="w3-main" style="margin-top:54px">
      <div style="padding:16px 32px">
   <div class="w3-row-padding w3-stretch">
         <div class="w3-white w3-round w3-margin-bottom w3-border" style="">

         <header class="w3-padding-large w3-large w3-border-bottom" style="font-weight: 500">Invoice</header>
                <div class="w3-padding-large">
                           
                                <h2 class="w3-center">  <img id="logoPreview" class="logo-preview" alt="Logo Preview"><br>   Upload Product</h2>
                                <hr>
                                <form id="moreInfoForm" method="POST" enctype="multipart/form-data">
                                    
                                    <div id="messageBox" class="w3-padding w3-round" style="display: none;"></div>

                                    <p>Upload Product Image</p>
                                    <div class="w3-margin-bottom">
                                        <input type="file" name="image_1" id="logoInput" class="w3-input w3-round w3-border" accept="image/*" required>
                                        <img id="logoPreview" class="logo-preview" alt="Image Preview">
                                    </div>

                                    <label>Product Name</label>
                                    <input type="text" name="product_title" class="w3-input w3-round w3-border" placeholder="Eg: Men's Glasses" required>

                                    <p>Product Price</p>
                                    <input type="text" name="product_price" id="product_price" class="w3-input w3-round w3-border" placeholder="Eg: 4,000" required oninput="formatPrice(this)">

                                    <p>Description</p>
                                    <input type="text" name="product_desc" class="w3-input w3-round w3-border" placeholder="Enter Bank Name" required>

                                    <label>Unit Available
                                        <div class="tooltip-container">
                                            <span class="tooltip-icon">?</span>
                                            <span class="tooltip-text">How many of these products do you have available?</span>
                                        </div>
                                    </label>
                                    <input type="text" name="product_left" class="w3-input w3-round w3-border" placeholder="Eg: Nationwide" required>

                                    <div class="w3-margin-top">
                                        <button type="submit" class="w3-button w3-block w3-round w3-padding" style="background-color: blue; color: white;">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>              
                        </div>
                    </div>
                </div>
            </div>
        </div>

</div>
</div>

<script>
//Logo Preview
$(document).ready(function () {
    $("#logoInput").change(function () {
        let file = this.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $("#logoPreview").attr("src", e.target.result).show();
            };
            reader.readAsDataURL(file);
        }
    });
});
  
//Tooltip
document.querySelectorAll(".tooltip-icon").forEach(el => {
    el.addEventListener("mouseenter", function () {
        let tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerText = this.getAttribute("data-tooltip");
        document.body.appendChild(tooltip);

        let rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + "px";
        tooltip.style.top = rect.top - 30 + "px";
    });

    el.addEventListener("mouseleave", function () {
        document.querySelector(".tooltip")?.remove();
    });
});

//Function to format price
function formatPrice(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    
    let formattedValue = Number(value).toLocaleString();
    input.value = formattedValue;
}

//Form Submission
document.getElementById("moreInfoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let formData = new FormData(this);

    fetch("includes/insert_product.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        let messageBox = document.getElementById("messageBox");
        messageBox.style.display = "block";
        messageBox.style.backgroundColor = data.success ? "green" : "red";
        messageBox.innerHTML = data.message;
    })
    .catch(error => console.error("Error:", error));
});
</script>
 
  <script src="./assets/plugins/chartjs/Chart.min.js"></script>
  <script src="./assets/plugins/chartjs/dashboard.js"></script>
</body>

</html>
