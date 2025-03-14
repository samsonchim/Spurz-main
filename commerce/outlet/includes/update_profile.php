<?php
session_start();
include "config.php"; 

header("Content-Type: application/json");

if (!isset($_SESSION["outlet_id"])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit;
}

$outlet_id = $_SESSION["outlet_id"];
$updates = [];
$params = [];
$types = "";
$outlet_name_updated = false;
$new_outlet_name = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get current outlet_name before updating
    $stmt = $conn->prepare("SELECT outlet_name FROM outlets WHERE id = ?");
    $stmt->bind_param("i", $outlet_id);
    $stmt->execute();
    $stmt->bind_result($current_outlet_name);
    $stmt->fetch();
    $stmt->close();

    // Prepare dynamic query
    if (!empty($_POST["outlet_name"])) {
        $updates[] = "outlet_name = ?";
        $params[] = $_POST["outlet_name"];
        $types .= "s";
        $outlet_name_updated = true;
        $new_outlet_name = $_POST["outlet_name"]; // Store new name
    }
    if (!empty($_POST["whatsapp_no"])) {
        $updates[] = "whatsapp_no = ?";
        $params[] = $_POST["whatsapp_no"];
        $types .= "s";
    }
    if (!empty($_POST["location"])) {
        $updates[] = "location = ?";
        $params[] = $_POST["location"];
        $types .= "s";
    }
    if (!empty($_POST["account_name"])) {
        $updates[] = "account_name = ?";
        $params[] = $_POST["account_name"];
        $types .= "s";
    }
    if (!empty($_POST["account_no"])) {
        $updates[] = "account_no = ?";
        $params[] = $_POST["account_no"];
        $types .= "s";
    }
    if (!empty($_POST["bank_name"])) {
        $updates[] = "bank_name = ?";
        $params[] = $_POST["bank_name"];
        $types .= "s";
    }

    // Handle password update
    if (!empty($_POST["old_password"]) && !empty($_POST["new_password"])) {
        $stmt = $conn->prepare("SELECT password FROM outlets WHERE id = ?");
        $stmt->bind_param("i", $outlet_id);
        $stmt->execute();
        $stmt->bind_result($hashed_password);
        $stmt->fetch();
        $stmt->close();

        if (!password_verify($_POST["old_password"], $hashed_password)) {
            echo json_encode(["success" => false, "message" => "Old password is incorrect."]);
            exit;
        }

        $updates[] = "password = ?";
        $params[] = password_hash($_POST["new_password"], PASSWORD_DEFAULT);
        $types .= "s";
    }

    // Handle logo upload
    if (!empty($_FILES["logo"]["name"])) {
        $logoPath = "logos/" . $current_outlet_name . ".png"; // Use existing name
        move_uploaded_file($_FILES["logo"]["tmp_name"], $logoPath);
        $updates[] = "logo = ?";
        $params[] = $logoPath;
        $types .= "s";
    }

    // Handle cover image upload
    if (!empty($_FILES["cover_image"]["name"])) {
        $coverPath = "cover_images/" . $current_outlet_name . ".png"; // Use existing name
        move_uploaded_file($_FILES["cover_image"]["tmp_name"], $coverPath);
        $updates[] = "cover_image = ?";
        $params[] = $coverPath;
        $types .= "s";
    }

    // Execute query if changes exist
    if (!empty($updates)) {
        $query = "UPDATE outlets SET " . implode(", ", $updates) . " WHERE id = ?";
        $params[] = $outlet_id;
        $types .= "i";

        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            
            // Rename files if the outlet name was updated
            if ($outlet_name_updated) {
                $oldLogoPath = "logos/" . $current_outlet_name . ".png";
                $newLogoPath = "logos/" . $new_outlet_name . ".png";
                
                $oldCoverPath = "cover_images/" . $current_outlet_name . ".png";
                $newCoverPath = "cover_images/" . $new_outlet_name . ".png";
                
                if (file_exists($oldLogoPath)) {
                    rename($oldLogoPath, $newLogoPath);
                }
                
                if (file_exists($oldCoverPath)) {
                    rename($oldCoverPath, $newCoverPath);
                }

                // Kill session and logout
                session_destroy();
                echo json_encode(["success" => true, "logout" => true, "message" => "Profile Updated, You will be logged out."]);
                exit;
            }

            echo json_encode(["success" => true, "message" => "Profile updated successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update profile."]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "No changes detected."]);
    }

    $conn->close();
}
?>
