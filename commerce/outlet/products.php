<?php
include_once('includes/nav.php');
include_once('./includes/config.php');

if (!isset($_SESSION['outlet_id'])) {
    die("Unauthorized access.");
}

$user_id = $_SESSION['outlet_id']; 

$query = "SELECT * FROM products WHERE outlet_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="./assets/css/styles.css">
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <style>
        .content {
            margin-left: 240px; 
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
        .logo-circle {
            border-radius: 50%;
            display: block;
        }
    </style>
</head>
<body>
    <br>
    <div class="w3-container w3-padding content">
        <div class="w3-margin-bottom w3-padding">
            <br>
        </div>

        <div class="w3-row-padding">
            <?php while ($row = $result->fetch_assoc()) { ?>
                <div class="w3-col l6 m6 s12">
                    <div class="w3-card w3-round w3-white w3-margin-bottom w3-padding">
                        <div class="w3-row">
                            <div class="w3-col s4">
                                <img src="../admin/upload/<?php echo htmlspecialchars($row['product_img']); ?>" 
                                    alt="<?php echo htmlspecialchars($row['product_title']); ?>" 
                                    class="w3-image w3-round w3-border" 
                                    style="width:100px; height:100px; object-fit:cover;">
                            </div>
                            <div class="w3-col s8 w3-padding">
                                <h4 class="w3-margin-bottom"> <?php echo htmlspecialchars($row['product_title']); ?> </h4>
                                <p class="w3-text-grey">Price: <b>N<?php echo number_format($row['product_price']); ?></b></p>
                                <span class="w3-small w3-text-grey">
                                    <i class="fa fa-eye"></i> <?php echo $row['views']; ?> Views
                                </span>
                                
                               
                                <button class="w3-button w3-red w3-round w3-small w3-margin-left delete-btn" 
                                    data-id="<?php echo $row['product_id']; ?>">
                                    <i class="fa fa-trash"></i> Delete
                                </button>
                                <button class="w3-button w3-red w3-round w3-small w3-margin-left green-btn copy-link" 
                                    data-id="<?php echo $row['product_id']; ?>">
                                <i class="fa fa-copy"></i> Comment Link
                            </button>
                            
                            </div>
                           
                        </div>
                      
                    </div>
                  
                </div>
            <?php } ?>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", function () {
                    let productId = this.getAttribute("data-id");
                    
                    if (confirm("Are you sure you want to delete this product?")) {
                        fetch("includes/delete_product.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: "id=" + productId
                        })
                        .then(response => response.text())
                        .then(data => {
                            if (data.trim() === "success") {
                                alert("Product deleted successfully.");
                                location.reload();
                            } else {
                                alert("Failed to delete product.");
                            }
                        });
                    }
                });
            });
        });


        document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".copy-link").forEach(button => {
        button.addEventListener("click", function () {
            let productId = this.getAttribute("data-id");
            let commentLink = `../comment.php?id=${productId}`;

           
            navigator.clipboard.writeText(commentLink).then(() => {
                alert("Link copied: " + commentLink);
            }).catch(err => {
                console.error("Failed to copy link: ", err);
            });
        });
    });
});
    </script>
    
    <script src="./assets/plugins/chartjs/Chart.min.js"></script>
    <script src="./assets/plugins/chartjs/dashboard.js"></script>
</body>
</html>
