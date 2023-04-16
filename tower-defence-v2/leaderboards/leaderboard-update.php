<?php

	/* OLD - VERSION 1.1

	include_once('leaderboard-setup.php');

	if ($db->connect_errno) {		printf("Connect failed: %s\n", $db->connect_error);		exit();	}	//if (isset($_GET["name"]){			$name = mysqli_real_escape_string($db, $_GET["name"] );		$score = mysqli_real_escape_string($db, $_GET["score"] );

	$query = "INSERT INTO Scores(playerName,score,ts) VALUES('" . $name . "','" . $score . "',CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE ts = if(" . $score . ">score,CURRENT_TIMESTAMP,ts), score = if (" . $score . ">score, " . $score . ", score);";

	if ($db->query($query) === TRUE) {
		printf("Scores successfully updated.\n");
	}else{
		printf("Update error");
	}
		//}	$db->close();
	*/

	/* NEW - VERSION 1.5 */

	/* Get posted data (new score and ID) */
  if ($_GET["playerID"] && $_GET["score"]){
    $playerID = htmlspecialchars($_GET["playerID"]);
    $playerScore = htmlspecialchars($_GET["score"]);
  }else{
    die ("Error receiving new score");
  }

  // Opens $sql_conn
	include_once('leaderboard-setup.php');

  /* Test the connection and die on error */
  if ($sql_conn->connect_error){
    die("Connection failed: " . $sql_conn->connect_error);
  }

  echo "Inserting Player " . $playerID. " -> Score " . $playerScore . "<br>";

  $sql_query = "INSERT INTO peep_defence (PlayerID, ScoreValue) VALUES ('" .  $playerID . "', '" . $playerScore . "')";

  if ($sql_conn->query($sql_query) === TRUE) {
      $thisScoreID = $sql_conn->insert_id;
      echo "New score added successfully<br>";
      echo "Player ID: $playerID<br>";
      echo "Score: $playerScore<br>";
  } else {
      echo "Error: " . $sql_query . "<br>" . $sql_conn->error;
  }

  $sql_conn->close();

?>
