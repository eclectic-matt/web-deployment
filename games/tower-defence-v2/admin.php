<?php

$this_title = 'Peep Defence | Eclectic App Development';
$this_desc = 'Making random bits and bots since a while ago';

$this_type = "website";
$this_locale = "en_us";
$this_url = "http://" . $_SERVER["HTTP_HOST"] . $_SERVER['REQUEST_URI'];

$partials_folder = '/home/u545245070/public_html/templates/partials/';

/* STRUCTURE */

// _declare.php		(doctype)
// _meta.php		(meta properties and the site icon)
// _social.php		(social app_id - FB/Twitter)
// _styles.php		(stylesheets and fonts)
// _scripts.php		(scripts which have to be loaded into the head)
	// echo BODY opening tag
// _navbar.php		(the nav menu, potentially highlight the current page $this_page / $this_directory)
	// echo MAIN and CONTENT
// _footer.php		(footer)

include $partials_folder . '_declare.php';
include $partials_folder . '_meta.php';
include $partials_folder . '_social.php';

include $partials_folder . '_styles.php';
include $partials_folder . '_structured.php';

include $partials_folder . '_scripts.php';	// NOTE, ALSO CLOSES THE HEAD

echo "<body class='w3-dark-grey'>";

include $partials_folder . '_navbar.php';

?>

<main id='main'>
	
	<!-- Top Box -->
	<div class='w3-card-10 w3-container w3-medium w3-center w3-padding-large w3-theme-d3'>
		
		<?php
			if (isset($_POST["defaults"])){
				echo "<h1>Setting values!</h1>";
				$values = $_POST["defaults"];
				$defaults = json_encode($values);
				
				$defaults_file = 'defaults/default_values.json';
				$defaults_json = fopen($defaults_file, 'w');
				fwrite($defaults_json, $defaults);
			}else{
				echo "<h1>Getting values</h1>";
				// Then show the current values
				//$defaults_file = 'defaults/default_values.json';
				//$defaults_json = fopen($defaults_file, 'r');
				//$defaults = json_decode($defaults_json, true);
			}
			
			echo "<form action='admin.php' method='post' class='w3-form'>";
			
			//foreach ($defaults as $key => $value){
			//	echo "<input value='" . $value . "' type='text'>" . $value . "</input>";
			//}
			
			echo "</form>";

		?>
		
	</div>

<?php
		
include $partials_folder . '_footer.php';

?>
