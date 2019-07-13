<?php

$this_title = 'Git Repo | Eclectic App Development';

include '/home/u545245070/public_html/templates/_head.php';

echo "<body class='w3-dark-grey'>";

include '/home/u545245070/public_html/templates/_navbar.php';

echo "<main id='main'>
	
	<!-- Top Box -->
	<div class='w3-card-10 w3-container w3-medium w3-center w3-padding-large w3-theme-d3'>";

//https://developer.github.com/v3/repos/contents/
$userName = "eclectic-matt";
$urlGetRepos = "https://api.github.com/users/" . $userName . "/repos";
$urlGetContents = "https://api.github.com/repos/" . $userName;
//https://raw.githubusercontent.com/eclectic-matt/CES/master/excel-tools.vba

$apiURL = $urlGetRepos;
$userRepos = callGitAPI($apiURL);

$len = count($userRepos);
//echo "<ul>";
for ($i = 0; $i < $len; $i++){
	$htmlURL = $userRepos[$i]['html_url'];
	$repoName = $userRepos[$i]['name'];
	$urlContents = $urlGetContents . "/" . $repoName . "/contents";
	$subFiles = callGitAPI($urlContents);
	$subFileCount = count($subFiles);
	if ($subFileCount > 0){
		echo "<button onclick='accordion(\"" . $repoName . "\")' class='w3-btn w3-block w3-theme-l". ($i+1) ." w3-left-align'>" . $repoName . "</button>
				<div id='" . $repoName . "' class='w3-container w3-hide'>
				
					<ul>";
					for ($j = 0; $j < $subFileCount; $j++){
						$subFileURL = $subFiles[$j]['html_url'];
						$subFileName = $subFiles[$j]['name'];
						
						echo "	<li class='w3-btn w3-block w3-theme-d". ($j+1) . " w3-left-align'>
									<a href='" . $subFileURL . "'>" . $subFileName . "</a>
								</li>";
						
					}
					echo "</ul>
				</div>";
	}else{
		echo "<a href='" . $htmlURL . "'>" . $repoName . "</a>";
	}
}
//echo '</ul>
echo '

		<script type="text/javascript">
		function accordion(id) {
			var x = document.getElementById(id);
			if (x.className.indexOf("w3-show") == -1) {
			  x.className += " w3-show";
			  x.previousElementSibling.className += " w3-red";
			} else { 
			  x.className = x.className.replace("w3-show", "");
			  x.previousElementSibling.className = 
			  x.previousElementSibling.className.replace("w3-red", "");
			}
		}
		</script>

	</div>';
		
include '/home/u545245070/public_html/templates/_bottom.php';

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
