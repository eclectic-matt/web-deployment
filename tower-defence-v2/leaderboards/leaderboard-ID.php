<?php

	include_once('leaderboard-setup.php');

	//echo "Opening....";
	/* Get posted data (just new player name) */
  if (isset($_GET["playerName"])){

    $newPlayerName = htmlspecialchars($_GET["playerName"]);
    insertNewPlayer($newPlayerName);

  }else{
    die ("Error receiving new player name");
  }

  function insertNewPlayer($thisPlayerName){

    //echo "Inserting " . $thisPlayerName . "<br>";

    /* Test the connection and die on error */
    if ($sql_conn->connect_error){
      die("Connection failed: " . $sql_conn->connect_error);
    }

    $sql_query = "INSERT INTO all_players (PlayerName) VALUES ('" .  $thisPlayerName . "')";		// Gets this far...

    if ($sql_conn->query($sql_query) === TRUE) {
			//echo "Yippee...";
			$thisPlayerID = $sql_conn->insert_id;
			echo $thisPlayerID;
    } else {
			//echo "Shite...";
      die("Error: " . $sql_query . "<br>" . $sql_conn->error);
    }

	}

	$sql_conn->close();

?>
