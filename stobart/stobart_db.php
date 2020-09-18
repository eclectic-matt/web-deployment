<?php

/* Hold secure DB details here */

$servername = "192.168.0.88"; //   "localhost";
$username = "piuser";
$password = "spotadmin";
$dbname = "spotters";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

?>
