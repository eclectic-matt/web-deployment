<?php

$this_title = 'PDF Tools | Eclectic App Development';

require('../libraries/fpdi/fpdf.php');
require('../libraries/fpdi/fpdi.php');

// HTML Upload section
if (isset($_POST["submit"])){
	$target_dir = "gadgets/";
	if (count($_FILES["pdfToUpload"]["name"]>1)){
		//MULTIPLE 
		$target_file = $target_dir . basename($_FILES["pdfToUpload"]["name"][0]);
	}else{
		//SINGLE
		$target_file = $target_dir . basename($_FILES["pdfToUpload"]["name"]);
	}
	$uploadOk = 1;
	$uploadedFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	if($uploadedFileType != "pdf"){
		$uploadOk = 0;
	}
	if ($uploadOk){
		createNumberedPDF();
	}else{
		header('Location: ../gadgets/pdfTools.php?error=upload', false);
		exit;
	}
}else{
	// Display file upload form
	if ($_GET["error"]){
		$error = "<div class='w3-panel w3-red'><h3>Sorry, there was a problem processing that file!</h3>This tool can only process PDF files (v1.4 and below) with no encryption.<br>You may be trying to upload a file which the tool currently cannot handle.</div>";
	}else{
		$error = "";
	}
	
	include '/home/u545245070/public_html/templates/_head.php';

	echo "<script type='text/javascript'>
	
	function checkNoPage(value){
		//console.log('Checking if no pages selected');
		switch (value){
			case 'none':
				var tB = document.getElementById('totalBox')
				tB.className = \"disabled\";
				var pB = document.getElementById('prefixBox')
				pB.className = \"disabled\";
				var wPB = document.getElementById('wordPageBox');
				wPB.className = \"disabled\";				
				var sB = document.getElementById('stylingBox');
				sB.className = \"disabled\";				
				var nTB =  document.getElementById('numTopBox');
				nTB.className = \"disabled\";
				//console.log('no pages - disable other selectors');
				break;
			case 'left':
				var tB = document.getElementById('totalBox')
				tB.className = \"enabled\";
				var pB = document.getElementById('prefixBox')
				pB.className = \"enabled\";
				var wPB = document.getElementById('wordPageBox');
				wPB.className = \"enabled\";				
				var sB = document.getElementById('stylingBox');
				sB.className = \"enabled\";				
				var nTB =  document.getElementById('numTopBox');
				nTB.className = \"enabled\";
				//console.log('pages selected - enable other selectors');
				break;
			default:
				var tB = document.getElementById('totalBox')
				tB.className = \"enabled\";
				var pB = document.getElementById('prefixBox')
				pB.className = \"enabled\";
				var wPB = document.getElementById('wordPageBox');
				wPB.className = \"enabled\";				
				var sB = document.getElementById('stylingBox');
				sB.className = \"enabled\";				
				var nTB =  document.getElementById('numTopBox');
				nTB.className = \"enabled\";
				//console.log('default - enable other selectors');
				break;
		}
	}
	
	function checkNoTotal(value){
		//console.log('Checking if no total selected');
		switch (value){
			case 'false':
				var tOf = document.getElementById('totalOf')
				tOf.disabled = \"disabled\";
				var tOut = document.getElementById('totalOut');
				tOut.disabled = \"disabled\";				
				var tS = document.getElementById('totalSlash');
				tS.disabled = \"disabled\";
				var tSB = document.getElementById('totalSBracket');
				tSB.innerHTML = \"'[ ]' (e.g. [ 2 ]\";
				var tCB = document.getElementById('totalCBracket');
				tCB.innerHTML = \"'( )' (e.g. ( 2 )\";
				//console.log('no total - disable total selectors');
				break;
			case 'true':
				var tOf = document.getElementById('totalOf')
				tOf.disabled = \"\";
				var tOut = document.getElementById('totalOut');
				tOut.disabled = \"\";				
				var tS = document.getElementById('totalSlash');
				tS.disabled = \"\";	
				var tSB = document.getElementById('totalSBracket');
				tSB.innerHTML = \"'[ ]' (e.g. [ 2 / 24 ]\";
				var tCB = document.getElementById('totalCBracket');
				tCB.innerHTML = \"'( )' (e.g. ( 2 / 24 )\";	
				//console.log('total selected - enable total selectors');
				break;
			default:
				var tOf = document.getElementById('totalOf')
				tOf.disabled = \"\";
				var tOut = document.getElementById('totalOut');
				tOut.disabled = \"\";				
				var tS = document.getElementById('totalSlash');
				tS.disabled = \"\";				
				var tSB = document.getElementById('totalSBracket');
				tSB.innerHTML = \"'[ ]' (e.g. [ 2 / 24 ]\";
				var tCB = document.getElementById('totalCBracket');
				tCB.innerHTML = \"'( )' (e.g. ( 2 / 24 )\";	
				//console.log('total selected - enable total selectors');
				break;
			}
	}
	
	</script>
	
	";

	//include '/home/u664287291/public_html/templates/includes.php';

	echo "
	<style type='text/css'>
		.enabled{
			display:block;
			top: 50px;
			visibility: visible;
		}
		.disabled{
			top: -50px;
			visibility: hidden;
			display:none;
		}
	</style>
	<body class='w3-dark-grey'>";

	include '/home/u545245070/public_html/templates/_navbar.php';

	echo "
<main id='main'>";

	echo "
	<div class='w3-card-10 w3-container w3-medium w3-center w3-padding-large w3-theme-d3'>
		<h2>PDF Tools</h2>
	</div>
	
	<div class='w3-theme-l4 w3-panel'>";
		echo $error;
		echo "<h3>Simply select the PDF file(s) to stitch together and number, as well as adding headers and footers, using the form below.</h3> 
		<em>Please note: The file(s) will be posted back to this page for processing - no files are stored on this server.</em>
		<br>
		Based on <a href='https://www.setasign.com/products/fpdi/about/'>FPDI parser</a> and the <a href='http://www.fpdf.org/'>FPDF Library</a>.
	</div>
	
	<!-- Content Box -->
	<div class='w3-panel w3-padding-8 w3-theme'>   
		<form action='' method=\"post\"  enctype=\"multipart/form-data\">
			
			<div class='w3-row w3-theme'>
				<div class='w3-half'>
					<label for='pdfToUpload'>Select PDF(s) file to number:</label>
				</div>
				<div class='w3-half'>
					<input class='w3-input' accept=\".pdf\" type=\"file\" multiple name=\"pdfToUpload[]\" id=\"pdfToUpload\">
				</div>
			</div>	

			<div class='w3-row w3-theme'>
				<div class='w3-half'>
					<label for='headerText'>Text to add in the header:</label>
				</div>
				<div class='w3-half'>
					<input class='w3-input' style=\"\" type=\"text\" name=\"headerText\" / >
				</div>
			</div>	
			
			<div class='w3-row w3-theme'>
				<div class='w3-half'>
					<label for='numberSide'>Side to print numbers:</label>
				</div>
				<div class='w3-half'>
					<select class='w3-select' id=\"numberSide\" onChange=\"checkNoPage(value);\" name=\"numberSide\">
						<option value=\"none\">No page numbers</option>
						<option value=\"left\">Left</option>
						<option value=\"center\">Center</option>
						<option selected value=\"right\">Right</option>
					</select>
				</div>
			</div>	
			
			<div class='w3-row w3-theme'>
				<div class='w3-half'>
					<label for='numberTop'>Top or bottom of page?</label>
				</div>
				<div class='w3-half'>
					<select class='w3-select' id=\"numberTop\" name=\"numberTop\">
						<option selected value=\"bottom\">Bottom</option>
						<option value=\"top\">Top</option>
					</select>
				</div>
			</div>	
			
			<div class='w3-row w3-theme'>
				<div class='w3-half'>
					<label for='withTotal'>Include total numbers?</label>
				</div>
				<div class='w3-half'>
					<select class='w3-select' onChange=\"checkNoTotal(value);\" id=\"withTotal\" name=\"withTotal\">
						<option selected value=\"true\">Yes (e.g. 2 out of 24)</option>
						<option value=\"false\">No (e.g. 2)</option>
					</select>
				</div>
			</div>	
			
			<div class='w3-row w3-theme'>
				<div class='w3-half'>
					<label for='totalStyle'>Number styling:</label>
				</div>
				<div class='w3-half'>
					<select class='w3-select' id=\"totalStyle\" name=\"totalStyle\">
						<option selected id='totalCBracket' value=\"cBracket\">'( )' (e.g. ( 2 / 24 )</option>
						<option id='totalSBracket'  value=\"sBracket\">'[ ]' (e.g. [ 2 / 24 ]</option>
						<option id='totalSlash' value=\"fSlash\">'/' (e.g. 2 / 24)</option>
						<option id='totalOut' value=\"out\">'out of' (e.g. 2 out of 24)</option>
						<option id='totalOf' value=\"of\">'of' (e.g. 2 of 24)</option>
					</select>
				</div>
			</div>	

			<div class='w3-row w3-theme'>
				<div class='w3-half'>
					<label for='withPage'>Include the word \"Page\"?</label>
				</div>
				<div class='w3-half'>
					<select class='w3-select' id=\"withPage\" name=\"withPage\">
						<option selected value=\"true\">Yes (e.g. Page 2)</option>
						<option value=\"false\">No (e.g. 2)</option>
					</select>
				</div>
			</div>	

			<div class='w3-row w3-theme'>
				<div class='w3-half'>
					<label for='prefixText'>Include a prefix (e.g. Page A01 - A99)?</label>
				</div>
				<div class='w3-half'>
					<input class='w3-input' type=\"text\" name=\"prefixText\" / >
				</div>
			</div>	
			
			<div class='w3-row'>&nbsp;</div>
			
			<div class='w3-row'>
				<input class='w3-btn-block w3-green w3-xlarge' type=\"submit\" value=\"Number PDF(s)!\" name=\"submit\">
			</div> 

		</form>
	</div>
	
	<aside class='w3-panel w3-container w3-theme-l4'>
		<!--h5>Version 1.0 - At present, will default to printing in the bottom right corner in the following format:<br>Page 1 of 100</h5-->
		<!--h5>Version 1.1 - The PDF numberer now has several options available (header text, side for page numbers, totals etc).<br>I am aware of issues with documents of differing paper sizes, especially with landscape pages at the beginning changing to portrait and I'm looking into a fix.</h5-->
		<!--h5>Version 1.2 - The PDF numberer now has more (working) options available and handles exceptions for encrypted / v1.5+ PDF files.</h5-->
		<!--h5>Version 1.3 - The PDF numberer now has the option to *not* number the PDFs (to just add a header).<br>Support for combining multiple files into 1 numbered PDF is being tested and should be rolled out soon.</h5-->
		<!--h5>Version 1.4 - The PDF numberer now supports the combining of multiple files into 1 numbered PDF. The tool has been tested but email me (details below) if you have any issues.</h5-->
		<h5>Version 1.5 - The PDF numberer now also allows prefixed page numbers, e.g. Page A01 - A99.</h5>
	</aside>
	
	
	
	
";

include '/home/u545245070/public_html/templates/_bottom.php';

}

// Main PDF tool function
function createNumberedPDF(){
	
	//SINGLE $pdfToEdit = $_FILES["pdfToUpload"]["tmp_name"];
	//MULTIPLE //$pdfToEd.it = $_FILES['pdfToUpload'];
	global $_FILES;
	
	$headerText = $_POST["headerText"];
	$prefixText = $_POST["prefixText"];
	// bottom
	$numberTop = $_POST["numberTop"];
	
	//$numberSide = "right";
	$numberSide = $_POST["numberSide"];
	//$withTotal = true; 
	$withTotal = $_POST["withTotal"];
	//$withPage = true; 
	$withPage = $_POST["withPage"];
	
	$totalStyle = $_POST["totalStyle"];
	
	if (!isset($numberSide) || !isset($withTotal) || !isset($withPage) ) {
		$var_note = "No variables!";
	}else{
		$var_note = $numberSide . " " . $withTotal . " " . $withPage;
	}
	
	// Creates new PDF document
	$pdf = new FPDI();
	// Allows page numbers to be written into footer
	$pdf->setMargins(0,0,0);
	$pdf->SetAutoPageBreak(true, 0);
	
	//TODO Contents Page - implement in marked area below
	//if ($contentsPage){
	//	$contentsPage = "";
	//} 
	$pageCount = 0;
	// get the page count
	try {
		if(count($_FILES["pdfToUpload"]["name"])>1) {
			
			//MULTIPLE

			for ($i=0; $i<count($_FILES["pdfToUpload"]["name"]); $i++){
				$thisPdf = $_FILES["pdfToUpload"]["tmp_name"][$i];
				$docLength = $pdf->setSourceFile($thisPdf);
				//$contentsPage[$i] .= "Pages " . $pageCount;
				$pageCount = $pageCount + $docLength;
				//TODO Contents Page - implement in marked area below
				//$contentsPage .= " - " . $pageCount;
			}
		}else{
			//SINGLE 
			$pdfToEdit = $_FILES["pdfToUpload"]["tmp_name"][0];
			$pageCount = $pdf->setSourceFile($pdfToEdit);
		}
	}catch (Exception $e){
		// Clears the POST values as posting back to same page
		$_POST = array();
		header('Location: ../gadgets/Tools.php?error=parsing_' . $pageCount, false);
		exit;
	}

	switch ($totalStyle){
		case "out":
			$totalText = " out of ";
			break;
		case "of":
			$totalText = " of ";
			break;
		case "fSlash":
			$totalText = " / ";
			break;
		case "cBracket":
			$totalText = " / ";
			$opener = "( ";
			$closer = " )";
			break;
		case "sBracket":
			$totalText = " / ";
			$opener = "[ ";
			$closer = " ]";
			break;
		default:
			$totalText = " out of ";
			$opener = "";
			$closer = "";
			break;
		
	}
	
	//$Intro = ($withPage ? "Page " : "");
	if ($withPage == "true"){
		$Intro = $opener . "Page " . $prefixText;
	}else{
		$Intro = $opener . $prefixText;
	}
	
	//$Outro = ($withTotal ? " of " . $pageCount : "");
	if ($withTotal == "true"){
		$Outro = $totalText . $prefixText . $pageCount . $closer;
	}else{
		$Outro = $closer;
	}

	switch ($numberTop){
		case "top":
			$footer_y_shift = 10;
			break;
		case "bottom":
			$footer_y_shift = -15;
			break;
		default:
			$footer_y_shift = -15;
			break;
	}
	

	$noNumbers = false;
	switch ($numberSide){
		case "right":
			$footer_x_shift = -70;
			break;
		case "left":
			$footer_x_shift = -350;
			break;
		case "center":
			$footer_x_shift = 0;
			break;
		case "none":
			$noNumbers = true;
			break;	
		default:
			$footer_x_shift = 165;
			break;
	}
	
	if(count($_FILES["pdfToUpload"]["name"])) {
		//MULTIPLE 
		$pdfToEdit = $_FILES["pdfToUpload"];
		$currPage = 0;
		$startPage = 0;
		$docNumber = 0;
		$pageInDoc = 0;	
		// iterate through all documents
		for ($i=0; $i<count($_FILES["pdfToUpload"]["name"]); $i++){
			$thisPdf = $_FILES["pdfToUpload"]["tmp_name"][$i];
			$docLength = $pdf->setSourceFile($thisPdf);
			$docNumber++;
			$startPage = 0;
			$pageInDoc = 0;
			// iterate through all pages
			for ($pageNo = $startPage; $pageNo < $docLength; $pageNo++) {
				$currPage++;
				$pageInDoc++;
				// import a page
				$templateId = $pdf->importPage($pageInDoc);
				// get the size of the imported page
				$size = $pdf->getTemplateSize($templateId);
				// create a page (landscape or portrait depending on the imported page size)
				if ($size['w'] > $size['h']) {
					$pdf->AddPage('L', array($size['w'], $size['h']));
				} else {
					$pdf->AddPage('P', array($size['w'], $size['h']));
				}

				try {
					$pdf->useTemplate($templateId);
				}catch (Exception $e){
					// Clears the POST values as posting back to same page
					$_POST = array();
					header('Location: ../gadgets/pdfTools.php?error=pageErr', false);
					exit;
				}
				
				// Select font
				$pdf->SetFont('Arial','B',12);

				// Header
				$pdf->SetY(5);
				$pdf->SetX(0);
				// Print header
				$pdf->Cell(0,10,$headerText,0,0,'C');
				
				$pdf->SetY($footer_y_shift);
				$pdf->SetX($footer_x_shift);
				
				//Builds the page mumber
				$numberText = $Intro . $currPage . $Outro;
				// Print page number
				if (!$noNumbers){
					$pdf->Cell(0,10,$numberText,0,0,'C');
				}
			}

		//MULTIPLE 
		}
		
	}else{
		//SINGLE
		$pdfToEdit = $_FILES["pdfToUpload"]["tmp_name"][0];
		$pageCount = $pdf->setSourceFile($pdfToEdit);
		for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
			// import a page
			$templateId = $pdf->importPage($pageNo);
			// get the size of the imported page
			$size = $pdf->getTemplateSize($templateId);
			// create a page (landscape or portrait depending on the imported page size)
			if ($size['w'] > $size['h']) {
				$pdf->AddPage('L', array($size['w'], $size['h']));
			} else {
				$pdf->AddPage('P', array($size['w'], $size['h']));
			}

			try {
				$pdf->useTemplate($templateId);
			}catch (Exception $e){
				// Clears the POST values as posting back to same page
				$_POST = array();
				header('Location: ../gadgets/pdfTools.php?error=pageErr', false);
				exit;
			}
			
			// Select font
			$pdf->SetFont('Arial','B',12);

			// Header
			$pdf->SetY(5);
			$pdf->SetX(0);
			// Print header
			$pdf->Cell(0,10,$headerText,0,0,'C');
			
			$pdf->SetY($footer_y_shift);
			$pdf->SetX($footer_x_shift);
			
			//Builds the page mumber
			$numberText = $Intro . $pageNo . $Outro;
			// Print page number
			if (!$noNumbers){
				$pdf->Cell(0,10,$numberText,0,0,'C');
			}
		}
	}
	
	if(count($_FILES["pdfToUpload"]["name"])>1) {
		$firstFileName = str_replace(".pdf","",$_FILES["pdfToUpload"]["name"][0]);
		$docTitle = "[EAD PDF] $firstFileName and more.pdf";
	}else{
		$docTitle = "[EAD PDF] " . $_FILES["pdfToUpload"]["name"][0];
	}
	
	$pdf->SetTitle($docTitle,true);
	// Output the new PDF
	//$pdf->Output(I,$docTitle);
	$pdf->Output("I",$docTitle);
}

?>
