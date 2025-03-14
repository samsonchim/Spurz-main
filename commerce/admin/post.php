<?php 
    include_once('./includes/headerNav.php');
   
 ?>

<!-- <h4>All Posts</h4>
<h5><a href="add-post.php">Add Post</a></h5> -->

    <div class="d-flex" style="justify-content: space-between; padding: 18px">
      <h1>PRODUCTS</h1>
      <button type="button" class="btn btn-primary btn-lg">
        <a class="btn" href="add-post.php">ADD Products</a>
      </button>
    </div>
<hr>

<?php 
session_start(); // Start session at the very top
include_once('./includes/headerNav.php');
include "includes/config.php";

// Ensure user is logged in before accessing this page
if (!isset($_SESSION['logged-in']) || $_SESSION['logged-in'] !== true) {
    echo '<div class="alert alert-danger">You must log in first.</div>';
    exit();
}

// Pagination setup
$limit = 10;
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$offset = ($page - 1) * $limit;

// Validate session variables before using them
if (isset($_SESSION["customer_role"]) && $_SESSION["customer_role"] == 'admin') {
    $sql = "SELECT * FROM products ORDER BY products.product_id DESC LIMIT {$offset},{$limit}";
} elseif (isset($_SESSION["user_role"]) && $_SESSION["user_role"] == 'normal') {
    $sql = "SELECT * FROM products WHERE product_author='{$_SESSION['customer_name']}' 
            ORDER BY products.product_id DESC LIMIT {$offset},{$limit}";
} else {
    echo '<div class="alert alert-danger">Session data missing. Please login again.</div>';
    exit();
}

$result = $conn->query($sql) or die("Query Failed.");
?>

<div class="d-flex" style="justify-content: space-between; padding: 18px">
  <h1>PRODUCTS</h1>
  <button type="button" class="btn btn-primary btn-lg">
    <a class="btn" href="add-post.php">ADD Products</a>
  </button>
</div>
<hr>

<div class="table-cont">
<table class="table">
  <thead>
    <tr>
      <th scope="col">S.No</th>
      <th scope="col">Title</th>
      <th scope="col">Category</th>
      <th scope="col">Date</th>
      <th scope="col">Author</th>
      <th scope="col">Edit</th>
      <th scope="col">Delete</th>
    </tr>
  </thead>
  <tbody class="table-group-divider">
<?php
if ($result->num_rows > 0) {
    $sn = $offset + 1;
    while($row = $result->fetch_assoc()) {
?>
    <tr>
      <th scope="row"><?php echo $sn++; ?></th>
      <td><?php echo htmlspecialchars($row["product_title"]); ?></td>
      <td><?php echo htmlspecialchars($row["product_catag"]); ?></td>
      <td><?php echo htmlspecialchars($row["product_date"]); ?></td>
      <td><?php echo htmlspecialchars($row["product_author"]); ?></td>
      <td>
        <a class="fn_link" href="update-post.php?id=<?php echo $row["product_id"]; ?>">
        <i class='fa fa-edit'></i>
        </a>
      </td>
      <td>
        <a class="fn_link" href="remove-post.php?id=<?php echo $row["product_id"]; ?>">
        <i class='fa fa-trash'></i>
        </a>
      </td>
    </tr>
<?php 
    } 
} else { 
    echo "<tr><td colspan='7'>No results found.</td></tr>";
}
?>
  </tbody>
</table>
</div>

<!-- Pagination -->
<?php
$sql1 = "SELECT COUNT(*) AS total FROM products";
$result1 = mysqli_query($conn, $sql1);
$row1 = mysqli_fetch_assoc($result1);
$total_products = $row1['total'];
$total_page = ceil($total_products / $limit);

if ($total_page > 1) {
?>
<nav aria-label="..." style="margin-left: 10px;">
  <ul class="pagination pagination-sm">
    <?php for ($i = 1; $i <= $total_page; $i++) { ?>
    <li class="page-item <?php echo ($page == $i) ? 'active' : ''; ?>">
      <a class="page-link" href="post.php?page=<?php echo $i; ?>"><?php echo $i; ?></a>
    </li>
    <?php } ?>
  </ul>
</nav>
<?php } ?>

<?php $conn->close(); ?>


<div class="table-cont">
<table class="table">
    <!-- tablehead html -->
  <thead>
    <tr>
      <th scope="col">S.No</th>
      <th scope="col">Title</th>
      <th scope="col">Category</th>
      <th scope="col">Date</th>
      <th scope="col">Author</th>
      <th scope="col">Edit</th>
      <th scope="col">Delete</th>
    </tr>
  </thead>
 <!-- tablehead html end -->

 <!-- tabledata body html -->
  <tbody class="table-group-divider">
     <!-- data row1 -->
<?php
  // output data of each row
  while($row = $result->fetch_assoc()) { //this will run for every row at a time and run until row finished
  $sn = $sn+1;
?>
    <tr>
      <th scope="row"><?php echo $sn?></th>
      <td><?php echo $row["product_title"] ?></td>
      <td><?php echo $row["product_catag"] ?></td>
      <td><?php echo $row["product_date"] ?></td>
      <td><?php echo  $row["product_author"] ?></td>
      <td>
        <a class="fn_link" href="update-post.php?id=<?php echo $row["product_id"] ?>">
        <i class='fa fa-edit'></i>
        </a>
      </td>
      <td>
        <a class="fn_link" href="remove-post.php?id=<?php echo $row["product_id"] ?>">
        <i class='fa fa-trash'></i>
        </a>
      </td>
    </tr>

<?php } ?>
</tbody>
<!-- tabledata body end -->

</table>
</div>
<!--Pagination-->
<?php
    include "includes/config.php"; 
    // Pagination btn using php with active effects 

    $sql1 = "SELECT * FROM products";
    $result1 = mysqli_query($conn, $sql1) or die("Query Failed.");

    if(mysqli_num_rows($result1) > 0){
        $total_products = mysqli_num_rows($result1);
        $total_page = ceil($total_products / $limit);

?>
    <nav aria-label="..." style="margin-left: 10px;">
      <ul class="pagination pagination-sm">


        <?php 
            for($i=1; $i<=$total_page; $i++){
                //important this is for active effects that denote in which page you are in current position
                if ($page==$i) {
                    $active = "active";
                } else {
                    $active = "";
                }
        ?>
        <li class="page-item">
            <a class="page-link <?php echo $active; // page number ?>" href="post.php?page=<?php echo $i; // page number ?>">
            <?php echo $i; // page number ?>
            </a>
        </li>
        <?php }} ?>

      </ul>
    </nav>


