<?php

  //https://developer.github.com/v3/repos/contents/
$userName = "eclectic-matt";
$urlGetRepos = "https://api.github.com/users/" . $userName . "/repos";
$urlGetContents = "https://api.github.com/repos/" . $userName;
  //https://raw.githubusercontent.com/eclectic-matt/CES/master/excel-tools.vba

$apiURL = $urlGetRepos;
$userRepos = callGitAPI($apiURL);

$len = count($userRepos);
echo "<ul>";
for ($i = 0; $i < $len; $i++){
	$htmlURL = $userRepos[$i]['html_url'];
	$repoName = $userRepos[$i]['name'];
	$urlContents = $urlGetContents . "/" . $repoName . "/contents";
	$subFiles = callGitAPI($urlContents);
	$subFileCount = count($subFiles);
	echo "<li>
	
		<a href='" . $htmlURL . "'>" . $repoName . "</a>";
		
		if ($subFileCount > 0){
			echo "<ul>";
			for ($j = 0; $j < $subFileCount; $j++){
				$subFileURL = $subFiles[$j]['html_url'];
				$subFileName = $subFiles[$j]['name'];
				
				echo "<li>
					<a href='" . $subFileURL . "'>" . $subFileName . "</a></li>";
				
			}
			echo "</ul>";
		}
		
	"</li>";
}
echo "</ul>";

function callGitAPI($url){
	
	$headers = [
		'Content-Type: application/json',	
		'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:28.0) Gecko/20100101 Firefox/28.0',
	];
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HTTPGET, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$server_output = curl_exec ($ch);
	curl_close ($ch);
	return json_decode($server_output, true);
}
	
	
?>
