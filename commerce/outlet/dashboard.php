  <?php
  include_once('includes/nav.php');
  include_once('includes/user_impression.php');

    //Playing with percentage for the progressive bar, if you have a better workaround for it, please Go ahead!
    $max_orders = 100; 
    $max_revenue = 20000; 

    
    $progress_percentage = ($total_orders / $max_orders) * 100;
    $progress_percentage = ($total_revenue / $max_revenue) * 100;
    $progress_percentage = min($progress_percentage, 100); 
    ?>


    <div class="w3-main" style="margin-top:54px">
      <div style="padding:16px 32px">
        <div class="w3-white w3-round w3-margin-bottom w3-border" style="">
          <div class="w3-row">
            <div class="w3-col l3 w3-container w3-border-right">
              <div class="w3-padding">
                <h5><?php echo $total_orders ?><span class="w3-right"><i class="fa fa-fw fa-shopping-cart"></i></span></h5>
                <div class="progress w3-light" style="height:3px;">
                <div class="progress-bar w3-info" style="width:<?php echo $progress_percentage; ?>%; height:3px;"></div>
                </div>
                <p>Total Orders <span class="w3-right"></span></p>
              </div>
            </div>
            <div class="w3-col l3 w3-container w3-border-right">
              <div class="w3-padding">
              <h5><?php echo $total_revenue; ?><span class="w3-right"><i class="fa fa-gbp"></i></span></h5>
                <div class="progress w3-light" style="height:3px;">
                <div class="progress-bar w3-info" style="width:<?php echo $progress_percentage; ?>%; height:3px;"></div>
                </div>
                <p>Total Revenue <span class="w3-right"></span></p>
              </div>
            </div>
            <div class="w3-col l3 w3-container w3-border-right">
              <div class="w3-padding">
                <h5><?php echo $page_visitors ?><span class="w3-right"><i class="fa fa-fw fa-eye"></i></span></h5>
                <div class="progress w3-light" style="height:3px;">
                  <div class="progress-bar w3-warning" style="width:90%;height:3px;"></div>
                </div>
                <p>Page Visitors <span class="w3-right"></span></p>
              </div>
            </div>
            <div class="w3-col l3 w3-container">
              <div class="w3-padding">
                <h5><?php echo $products ?> <span class="w3-right"><i class="fa fa-fw fa-envira"></i></span></h5>
                <div class="progress w3-light" style="height:3px;">
                  <div class="progress-bar w3-danger" style="width:5%;height:3px;"></div>
                </div>
                <p>Total Products <span class="w3-right"></span></p>
              </div>
            </div>
          </div>
        </div>
        
        <?php
        include "includes/config.php"; 

        if (!isset($_SESSION['outlet_id'])) {
            echo "<p>You are not logged in.</p>";
            exit;
        }

        $outlet_id = $_SESSION['outlet_id'];  

        $query = "SELECT id, product_name, total_price, paid, status, delivery_date, csrf_token FROM invoices WHERE outlet_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $outlet_id);
        $stmt->execute();
        $result = $stmt->get_result();
        ?>

    <div class="w3-white w3-round w3-margin-bottom w3-border">
        <header class="w3-padding-large w3-large w3-border-bottom" style="font-weight: 500">Recent Order Tables</header>
        <div class="w3-responsive">
            <table class="w3-table w3-bordered">
            <tr>
                <th>Copy</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Delivery</th>
                <th>Promised Date</th>
                <th>Action</th>
            </tr>

            <?php while ($row = $result->fetch_assoc()): ?>
            <tr>
                <td>
                    <?php if ($row['status'] == 1): ?>
                        <a href="javascript:void(0);" onclick="copyToClipboard(this)" data-url="<?= htmlspecialchars($row['csrf_token']); ?>"> 
                            Copy Token
                        </a>
                    <?php else: ?>
                        <a href="javascript:void(0);" onclick="copyToClipboard(this)" data-url="/commerce/pay.php?id=<?= $row['id']; ?>"> 
                            Copy Link
                        </a>
                    <?php endif; ?>
                </td>

                <td><?= htmlspecialchars($row['product_name']); ?></td>
                <td>N<?= number_format($row['total_price'], 2); ?></td>
                <td>
                    <span class="badge-dot">
                        <i class="<?= $row['paid'] ? 'w3-green' : 'w3-red'; ?>"></i> 
                        <?= $row['paid'] ? 'Paid' : 'Not Paid'; ?>
                    </span>
                </td>
                <td>
                    <span class="badge-dot">
                        <i class="<?= $row['status'] ? 'w3-green' : 'w3-red'; ?>"></i> 
                        <?= $row['status'] ? 'Received' : 'Not Received'; ?>
                    </span>
                </td>
                <td><?= date("d M Y", strtotime($row['delivery_date'])); ?></td>
                <td>
                    <?php if ($row['paid'] == 0): ?>
                        <form action="delete_invoice.php" method="POST" style="display:inline;">
                            <input type="hidden" name="invoice_id" value="<?= $row['id']; ?>">
                            <button type="submit" class="w3-button w3-red w3-small">Delete</button>
                        </form>
                    <?php else: ?>
                        <button class="w3-button w3-gray w3-small" disabled>Cannot Delete</button>
                    <?php endif; ?>
                </td>
            </tr>
            <?php endwhile; ?>
        </table>
    </div>
</div>

<script>
function copyToClipboard(element) {
    var text = element.getAttribute("data-url");
    var textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Copied: " + text);
}
</script>

<?php
$stmt->close();
$conn->close();
?>
      </div>
    </div>

  <script>
   function copyToClipboard(element) {
    var url = element.getAttribute("data-url"); 
    var tempInput = document.createElement("input"); 
    document.body.appendChild(tempInput);
    tempInput.value = window.location.origin + url; 
    tempInput.select();
    document.execCommand("copy"); 
    document.body.removeChild(tempInput); 

    alert("Payment link copied to clipboard!");
}
  </script>
  <script src="./assets/plugins/chartjs/Chart.min.js"></script>
  <script src="./assets/plugins/chartjs/dashboard.js"></script>
</body>

</html>
