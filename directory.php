<?php

/*
	Use for the main folders which get updated with content regularly
	Find all files in the directory and offers styled links to them
	Ignores the "." and ".." and also ignores directories 
*/

$dir = new DirectoryIterator(__DIR__);
//$fi = new FilesystemIterator(__DIR__, FilesystemIterator::SKIP_DOTS);
//$file_count = iterator_count($fi);
$dirTable = "";
$file_count = 0;
/* Main loop to get file info into tables */
foreach ($dir as $fileinfo) {
    if ( (!$fileinfo->isDot()) && ($fileinfo -> isFile()) && ($fileinfo->getFilename() !== ".htaccess") ){
        $file_count++;
		$dirTable .= "<tr class='w3-theme-d1'>";
			$dirTable .= "<td><a href='./" . $fileinfo->getFilename() . "'>" . $fileinfo->getFilename() . "</a></td>";
			$dirTable .= "<td>" . date("D jS F Y G:i:sa",filemtime($fileinfo->getFilename()) ) . "</td>";
		$dirTable .= "</tr>";
    }
}
$dir_name = substr(__DIR__,strrpos(__DIR__,"/")+1);
$this_title = ucwords($dir_name) . ' | Eclectic App Development';

include '/home/u545245070/public_html/templates/_head.php';

echo "<body class='w3-dark-grey'>";

include '/home/u545245070/public_html/templates/_navbar.php';

echo "<main id='main'>";

echo "<div class='w3-container' style='top:50px;'>";
	echo "<h1>ECLECTIC ";
		echo strtoupper( $dir_name );
	echo "</h1>";
	echo "<strong>Files found: " . $file_count . "</strong><br><br>";
echo "</div>";

echo "<div class='w3-container'>";
	echo "<input class='w3-input w3-border w3-padding' type='text' placeholder='Search for files..' id='dirSearch' onkeyup='myFunction()'>";
	echo "<br>";
echo "</div>";

echo "<div class='w3-container'><table id='dirTable' class='w3-table-all'>";
echo "<thead><tr class='w3-theme-d5'><th>Filename</th><th>Last Modified</th></tr></thead><tbody>";

echo $dirTable;

echo "</tbody></table></div>";
echo "<script>
function myFunction() {
  var input, filter, table, tr, td, i;
  input = document.getElementById('dirSearch');
  filter = input.value.toUpperCase();
  table = document.getElementById('dirTable');
  tr = table.getElementsByTagName('tr');
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}
</script>";

include '/home/u545245070/public_html/templates/_bottom.php';

?>
