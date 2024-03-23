<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spurz";


session_start();

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if (isset($_SESSION['id'])) {
    $user_id = $_SESSION['id'];

    // Initialize other variables with default values
    $product_name = isset($_POST['product_name']) ? $_POST['product_name'] : '';
    $product_description = isset($_POST['product_description']) ? $_POST['product_description'] : '';
    $product_category = isset($_POST['product_category']) ? implode(',', $_POST['product_category']) : '';
    $items_in_stock = isset($_POST['items_in_stock']) ? $_POST['items_in_stock'] : '';
    $price = isset($_POST['price']) ? $_POST['price'] : '';
    $meta_tags = isset($_POST['meta_tags']) ? $_POST['meta_tags'] : '';
    $product_type = isset($_POST['product_type']) ? $_POST['product_type'] : '';
    // Handle file uploads
    $targetDir = "uploads/";
    $uploadedFiles = [];

    if (isset($_FILES["productImages"]["name"]) && is_array($_FILES["productImages"]["name"])) {
        foreach ($_FILES["productImages"]["name"] as $key => $fileName) {
            $targetFile = $targetDir . basename($_FILES["productImages"]["name"][$key]);
            move_uploaded_file($_FILES["productImages"]["tmp_name"][$key], $targetFile);
            $uploadedFiles[] = $targetFile;
        }
    } else {
        // Handle file upload error
        echo json_encode(array('success' => false, 'message' => 'Error in file upload'));
        exit; 
    }

    // Insert data into the database
    $sql = "INSERT INTO products (user_id, product_name, product_description, product_category, items_in_stock, meta_tags, price, product_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";


    // Prepare the SQL statement with placeholders
    $stmt = $conn->prepare($sql);

    // Bind parameters and execute the statement
    $stmt->bind_param("isssdsss", $user_id, $product_name, $product_description, $product_category, $items_in_stock, $meta_tags, $price, $product_type);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Get the last inserted product ID
        $lastProductId = $stmt->insert_id;

            // Rename and move the images to the specified format
        foreach ($uploadedFiles as $key => $image) {
            $newFileName = $lastProductId . "_(" . ($key + 1) . ").png";
            $newFilePath = $targetDir . $newFileName;
            rename($image, $newFilePath);
        }

        // Product saved successfully
        echo json_encode(array('success' => true));
    } else {
        // Error in saving the product
        echo json_encode(array('success' => false, 'message' => 'Error in saving the product'));
    }

    // Close the prepared statement and the database connection
    $stmt->close();
} else {
    //
    echo json_encode(array('success' => false, 'message' => 'User not logged in'));
}

// Close the database connection
$conn->close();
?>
