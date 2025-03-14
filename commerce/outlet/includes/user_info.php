<?php
include "config.php"; 

if (!isset($_SESSION["outlet_id"])) {
    die("Unauthorized access.");
}

$outlet_id = $_SESSION["outlet_id"];

// Fetch user details
$query = "SELECT email, account_no, account_name, bank_name, category, location, whatsapp_no, created_at FROM outlets WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $outlet_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Store user details in variables
    $email = $user['email'];
    $account_no = $user['account_no'];
    $account_name = $user['account_name'];
    $bank_name = $user['bank_name'];
    $category = $user['category'];
    $location = $user['location'];
    $whatsapp_no = $user['whatsapp_no'];
    $created_at = time_elapsed_string($user['created_at']);

  
} else {
    echo "User not found.";
}

$stmt->close();
$conn->close();

/**
 * Converts a timestamp to a human-readable time difference
 * @param string $datetime The datetime string from the database
 * @param string $full Whether to show full breakdown (e.g., "2 days, 5 hours ago")
 * @return string Human-readable time difference
 */
function time_elapsed_string($datetime, $full = false) {
    $now = new DateTime();
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $string = [
        'year'   => $diff->y,
        'month'  => $diff->m,
        'week'   => floor($diff->d / 7),
        'day'    => $diff->d % 7,
        'hour'   => $diff->h,
        'minute' => $diff->i,
        'second' => $diff->s,
    ];

    foreach ($string as $key => &$value) {
        if ($value) {
            $value .= " $key" . ($value > 1 ? 's' : '');
        } else {
            unset($string[$key]);
        }
    }

    return $string ? implode(', ', array_slice($string, 0, $full ? count($string) : 1)) . ' ago' : 'just now';
}
?>
