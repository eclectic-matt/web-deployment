<?php 

?>
<!DOCTYPE html>
<html>
<head>
    <title>PHP Gloomhaven Timeline</title>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
    <link rel='stylesheet' href='https://www.w3schools.com/lib/w3-theme-deep-purple.css'>
    <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
	  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>
    <script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
    
    <link rel="shortcut icon" type="image/jpg" href="favicon.ico"/>
    <link rel="stylesheet" href="gh-timeline-style.css" />

    <script type='text/json' src='ghData-v3.json'></script>
    <script src='ghMap.js' defer></script>
	  <script src='ghTimeline.js' defer></script>
    <script src='canvas/canvasFns.js' defer></script>

</head>

<body class="w3-dark-grey" onload='getMapData()'>
  <main id="main">

    <!-- HEADING SECTION -->
    <div id="top" class="timeline-main-title">
      <h1>GLOOMHAVEN TIMELINE</h1>
      <em><a href='https://boardgamegeek.com/plays/thing/174430?userid=2067663'>All Logged Plays on BGG</a></em>
      <!--br>
      <em><button onclick='showHideEl("mapAndSheetSection")'>Show/Hide Map</button></em-->
    </div>

    <!-- FILTERS SECTION -->
    <div class="w3-panel w3-container">
      <p>
        <div class="w3-quarter">
          <label for="yearSelect">Jump to: </label>
          <select onchange="window.location.assign('timeline.php#' +  document.getElementById('yearSelect').value);" id="yearSelect" name="Years:">
            <option class="yearLink">July 2020</option>
            <option class="yearLink">August 2020</option>
            <option class="yearLink">September 2020</option>
          </select>
        </div>
        <div class="w3-quarter">
          <label for="tagSelect">Filter: </label>
          <select onchange="updateFilter(document.getElementById('tagSelect').value);" id="tagSelect" name="Tag:">
            <option class="tagLink">Scenario</option>
            <option class="tagLink">Retirement</option>
            <option class="tagLink">Achievement</option>
            <option class="tagLink" selected value="">*Clear*</option>
          </select>
        </div>
        <div class="w3-half">
          <input class="w3-input w3-border" type="text" placeholder="Filter the timeline.." id="filterInput" onkeyup="filterList()">
        </div>
      </p>

    </div>

    <!-- MAP AND SHEET SECTION -->
    <div id='mapAndSheetSection' class='w3-row-padding w3-show'>
    <!--div id='mapAndSheetSection' class='w3-row-padding w3-hide'-->

      <h3>Campaign Map</h3>

      <!-- FOR SMALLER SCREENS -->
      <!--div class='w3-center w3-row w3-hide-large w3-hide-large'-->
      <div class='w3-center w3-row'>

        <div id='scenarioInfoDiv' class='w3-col s12'>
          <h2 id='headingScenarioName'></h2>
          <h3 id='headingScenarioStatus'></h3>
        </div>

        <div id='mapDiv' class='w3-col s12'>
          <canvas id='cnvGHmap' width='1873' height='1414'>
            Your browser does not support the canvas element
          </canvas>
        </div>

        <div id='scenarioListOneDiv' class='w3-col s6 scenarioListOneDiv'>
          Loading...
        </div>

        <div id='scenarioListTwoDiv' class='w3-col s6 scenarioListTwoDiv'>
          Loading...
        </div>

      </div>

      <!-- FOR LARGER SCREENS -->
      <!--div id='ghMapContainerDiv' class='w3-center w3-row w3-hide-small w3-hide-medium' style='height: 1000px'>

        <div id='scenarioInfoDiv' class='w3-col l12'>
          <h2 id='headingScenarioName'></h2>
          <h3 id='headingScenarioStatus'></h3>
        </div>

        <div id='scenarioListOneDiv' class='w3-col l2 scenarioListOneDiv'>
          Loading...
        </div>

        <div id='mapDiv' class='w3-col l8'>
          <canvas id='cnvGHmap' width='936' height='707'>
            Your browser does not support the canvas element
          </canvas>
        </div>

        <div id='scenarioListTwoDiv' class='w3-col l2 scenarioListTwoDiv'>
          Loading...
        </div>

      </div-->

      <!--div class='w3-col s12 m12 l12 w3-center'>

        <h3>Summary Statistics</h3>
        <iframe class='w3-center' width='600' height='400' src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRzHU1fQVHipRqhqgqiPGcPsJ9KrH-kNXoDqRkIgtk7RWL21YkvmsdytwryYQQFa1plQeDVtlurH18N/pubhtml?gid=1923381997&amp;single=true&amp;widget=true&amp;headers=false"></iframe>
      
      </div-->

    </div>

    <!-- TIMELINE CONTENT SECTION -->
    <div class="timeline-main">

      <ul id="timeline-full" class="timeline timeline-list">

        <!-- NEW GENERATED PHP OUTPUT BELOW -->
        <?php outputTimeline($timeline); ?>

        <!-- END OF TIMELINE CONTENT -->
      </ul>

      <br>

      <div class="w3-right w3-medium">
        <a class="top-link w3-tooltip" alt="Back to Top" href="#top">
          <span class="w3-text">Back to top</span>
        </a>
      </div>

    </div>

    <!-- FOOTER -->
    <div class='w3-center w3-container timeline-item w3-brown'>
      <h3>Reference Docs</h3>
      <ul class='w3-center w3-margin w3-ul'>
        <li><a target='_blank' href='https://online.flippingbook.com/view/598058/'>Rule Book</a></li>
        <li><a target='_blank' href='https://online.flippingbook.com/view/145446/13'>Scenario Book</a></li>
        <li><a target='_blank' href='https://docs.google.com/spreadsheets/d/1Pmentt9caxknuzZiycKTp-aqPB669QzM_7yT2vCsSVk/edit#gid=1917869594'>Tracking Spreadsheet</a></li>
        <li><a target='_blank' href='https://boardgamegeek.com/plays/thing/174430?userid=2067663'>BGG Logged Plays</a></li>
      </ul>
    </div>

    <!-- MODAL -->
    <div id='modalDiv' class='w3-hide w3-container'>

      <h1 class='modalHeading w3-center'><span id='modalScenarioNum'>1</span>: <span id='modalScenarioName'>The Black Barrow</span></h1>

      <table id='modalDataTable' class='w3-table w3-center'>
        <tr>
          <td>Grid</td>
          <td id='modalTableGridRef'>K17</td>
        </tr>
        <tr style='line-height:100%;'>
          <td>Region</td>
          <td id='modalTableRegion'>Misty Sea</td>
        </tr>
        <tr>
          <td>Unlocked</td>
          <td id='modalTableUnlocked'>False</td>
        </tr>
        <tr>
          <td>Locked</td>
          <td id='modalTableLocked'>False</td>
        </tr>
        <tr>
          <td>Completed</td>
          <td id='modalTableCompleted'>False</td>
        </tr>
      </table>

    </div>

    <img id='ghFullMap' src='GH-Map.PNG' style='display:none;' />
    
  </main>
</body>
</html>