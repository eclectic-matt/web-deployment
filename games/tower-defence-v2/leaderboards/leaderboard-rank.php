<?php

	include_once('leaderboard-setup.php');
	
	$name = mysql_real_escape_string($_GET['name'], $db);

	$query = "SELECT  uo.*,
		(
		SELECT  COUNT(*)
		FROM    Scores ui
		WHERE   (ui.score, -ui.ts) >= (uo.score, -uo.ts)
		) AS rank
	FROM    Scores uo
	WHERE   name = '$name';";
	
	$result = mysql_query($query) or die('Query failed: ' . mysql_error());

	 $row = mysql_fetch_array($result);
	 echo $row['rank'] . "\n";

?>