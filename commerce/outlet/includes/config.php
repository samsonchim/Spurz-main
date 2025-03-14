<?php
$host = "localhost"; 
$user = "root"; 
$password = ""; 
$database = "ecommerce"; 

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

//Uncomment this during Production, comment during Development
//ini_set("session.cookie_secure", 1);
//ini_set("session.cookie_httponly", 1);

?>
