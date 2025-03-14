<?php
include_once('./includes/headerNav.php');
include "includes/config.php";
?>

<div class="overlay" data-overlay></div>

<header>
  <?php require_once './includes/topheadactions.php'; ?>
  <?php require_once './includes/mobilenav.php'; ?>
</header>

<main>
  <div class="product-container">
    <div class="container">
      <?php require_once './includes/categorysidebar.php'; ?>

      <div class="product-box">
        <div class="product-main">
          <h2 class="title">Search: 
            <?php 
              if (isset($_POST['search'])) {
                echo htmlspecialchars($_POST['search']);
              }
            ?>
          </h2>

          <div class="product-grid">
            <?php
            if ((isset($_POST['submit']) && !empty($_POST['search'])) || isset($_GET['catag'])) {

              // Secure user input
              if (isset($_GET['catag'])) {
                $search_term = mysqli_real_escape_string($conn, $_GET['catag']);
              } else {
                $search_term = mysqli_real_escape_string($conn, $_POST['search']);
              }

              // Pagination setup
              $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
              $limit = 8;
              $offset = ($page - 1) * $limit;

              // Convert search term into an array for better matching
              $search_terms = explode(" ", $search_term);
              $search_conditions = [];

              foreach ($search_terms as $term) {
                $term = mysqli_real_escape_string($conn, $term);
                $search_conditions[] = "( 
                  product_catag LIKE '%$term%' OR 
                  product_title LIKE '%$term%' OR 
                  product_price LIKE '%$term%' OR 
                  product_desc LIKE '%$term%' OR 
                  product_date LIKE '%$term%' OR 
                  product_img LIKE '%$term%' OR 
                  product_left LIKE '%$term%' OR 
                  product_author LIKE '%$term%' OR 
                  category_id LIKE '%$term%' OR 
                  section_id LIKE '%$term%' OR 
                  discounted_price LIKE '%$term%' OR 
                  image_1 LIKE '%$term%' OR 
                  image_2 LIKE '%$term%' OR 
                  created_at LIKE '%$term%' OR 
                  updated_at LIKE '%$term%' OR 
                  status LIKE '%$term%' OR 
                  views LIKE '%$term%' OR 
                  outlet_id LIKE '%$term%'
                )";
              }

              $search_query = "SELECT * FROM products WHERE " . implode(" OR ", $search_conditions) . " ORDER BY product_id DESC LIMIT $offset, $limit";
              $search_result = $conn->query($search_query);

              if ($search_result->num_rows > 0) {
                while ($row = mysqli_fetch_assoc($search_result)) {
                  ?>
                  <div class="showcase">
                    <div class="showcase-banner">
                      <img src="./admin/upload/<?php echo $row['product_img']; ?>" alt="Product Image" width="300" class="product-img default" />
                      <img src="./admin/upload/<?php echo $row['product_img']; ?>" alt="Hover Image" width="300" class="product-img hover" />

                      <div class="showcase-actions">
                        <button class="btn-action"><ion-icon name="heart-outline"></ion-icon></button>
                        <button class="btn-action"><ion-icon name="eye-outline"></ion-icon></button>
                        <button class="btn-action"><ion-icon name="repeat-outline"></ion-icon></button>
                        <button class="btn-action"><ion-icon name="bag-add-outline"></ion-icon></button>
                      </div>
                    </div>

                    <div class="showcase-content">
                      <a href="./viewdetail.php?id=<?php echo $row['product_id']; ?>&category=<?php echo $row['category_id']; ?>" class="showcase-category">
                        <?php echo htmlspecialchars($row['product_title']); ?>
                      </a>

                      <a href="./viewdetail.php?id=<?php echo $row['product_id']; ?>&category=<?php echo $row['category_id']; ?>">
                        <h3 class="showcase-title"><?php echo htmlspecialchars($row['product_desc']); ?></h3>
                      </a>

                      <div class="showcase-rating">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                      </div>

                      <div class="price-box">
                        <p class="price">$<?php echo $row['discounted_price']; ?></p>
                        <del>$<?php echo $row['product_price']; ?></del>
                      </div>
                    </div>
                  </div>
                  <?php
                }
              } else {
                echo "<h4 style='color:red; margin-left:8%;border:1px solid aliceblue'>No record found</h4>";
              }
            }
            ?>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <div class="pag-cont-search">
    <?php
    if ((isset($_POST['submit']) && !empty($_POST['search'])) || isset($_GET['catag'])) {
      $sql_count = "SELECT COUNT(*) as total FROM products WHERE " . implode(" OR ", $search_conditions);
      $result_count = mysqli_query($conn, $sql_count);
      $row_count = mysqli_fetch_assoc($result_count);
      $total_products = $row_count['total'];
      
      if ($total_products > 0) {
        $total_pages = ceil($total_products / $limit);

        echo "<div class='pagination'>";
        for ($i = 1; $i <= $total_pages; $i++) {
          $active = ($page == $i) ? "active" : "";
          echo "<a href='search.php?page={$i}&search=" . urlencode($search_term) . "' class='{$active}'>" . $i . "</a>";
        }
        echo "</div>";
      }
    }
    ?>
  </div>

</main>

<?php require_once './includes/footer.php'; ?>
