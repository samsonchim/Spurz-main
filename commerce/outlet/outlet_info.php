<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Outlet Information</title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="./assets/icons/font-awesome-4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="./assets/css/w3pro-4.13.css">
  <link rel="stylesheet" href="./assets/css/w3-theme.css">
  <link rel="stylesheet" href="./assets/css/admin-styles.css">
  <link rel="stylesheet" href="./assets/css/scrollbar.css">
  <link rel="shortcut icon" href="assets/logo.jpg" type="image/x-icon">
  <style>
        .logo-preview {
            width: 90px;
            height: 90px;
            border-radius: 50%;
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


    </style>
</head>
<body>

<?php
session_start();
if (!isset($_SESSION["outlet_id"]) || !isset($_SESSION["outlet_name"])) {
    header("Location: register.html");
    exit();
}

$user_id = $_SESSION["outlet_id"];
$outlet_name = $_SESSION["outlet_name"];
?>

<body>

<div class="w3-main" style="margin-top:54px">
    <div style="padding:16px 32px">
        <div class="w3-padding-32">
            <div class="w3-auto" style="width:580px">
                <div class="w3-white w3-round w3-margin-bottom w3-border">
                    <div class="w3-padding-large">
                        <h2 class="w3-center">  <img id="logoPreview" class="logo-preview" alt="Logo Preview"><br>    <?php echo   $outlet_name; ?>, Nice. Few more things.</h2>
                        <form id="moreInfoForm" method="POST" enctype="multipart/form-data">
                            
                            <div id="messageBox" class="w3-padding w3-round" style="display: none;"></div>

                            <p>Upload Logo</p>
                            <div class="w3-margin-bottom">
                                <input type="file" name="logo" id="logoInput" class="w3-input w3-round w3-border" accept="image/*" required>
                                <img id="logoPreview" class="logo-preview" alt="Logo Preview">
                            </div>

                            <label>Account Number
                                <div class="tooltip-container">
                                    <span class="tooltip-icon">?</span>
                                    <span class="tooltip-text">This is the account where you will receive payments for your sales.</span>
                                </div>
                            </label>
                            <input type="text" name="account_no" class="w3-input w3-round w3-border" placeholder="Enter Account Number" required>

                            <p>Account Name</p>
                            <input type="text" name="account_name" class="w3-input w3-round w3-border" placeholder="Enter Account Name" required>

                            <p>Bank Name</p>
                            <input type="text" name="bank_name" class="w3-input w3-round w3-border" placeholder="Enter Bank Name" required>

                            <label>Location
                                <div class="tooltip-container">
                                    <span class="tooltip-icon">?</span>
                                    <span class="tooltip-text">These are the locations where you can make deliveries to.</span>
                                </div>
                            </label>
                            <input type="text" name="location" class="w3-input w3-round w3-border" placeholder="Eg: Nationwide" required>

                            <p>WhatsApp Number</p>
                            <input type="text" name="whatsapp_no" class="w3-input w3-round w3-border" placeholder="Enter WhatsApp Number" required>

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

<script>
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

    $("#moreInfoForm").submit(function (e) {
        e.preventDefault();

        let formData = new FormData(this);
        formData.append("outlet_name", "<?php echo $outlet_name; ?>");

        $.ajax({
            type: "POST",
            url: "includes/process_info.php",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (response) {
                let messageBox = $("#messageBox");
                messageBox.show();
                if (response.success) {
                    messageBox.html(response.message).css({"color": "black", "background": "#d4edda", "border-left": "4px solid green"});
                    setTimeout(() => window.location.href = "dashboard.php", 2000);
                } else {
                    messageBox.html("Error: " + response.message).css({"color": "red", "background": "#f8d7da", "border-left": "4px solid red"});
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error: ", xhr.responseText);
                $("#messageBox").show().html("An error occurred. Please try again.").css({"color": "red", "background": "#f8d7da", "border-left": "4px solid red"});
            }
        });
    });
});



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
</script>

</body>
</html>
