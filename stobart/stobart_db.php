<?php

/* Hold secure DB details here */
//require('config.ini');

$servername = ini_get(SERVERNAME);  //"192.168.0.88"; //   "localhost";
$username = ini_get(DBUSER);
$password = ini_get(DBPASS);
$dbname = ini_get(DBNAME);

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}else{
  //echo "Connected successfully";
}

?>
