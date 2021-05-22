<?php

  if (isset($_POST["date"])){

    processNewManualEntry();

  }else{

    //$playData = parseBGG("https://api.geekdo.com/xmlapi2/plays?username=EclecticMatt&id=174430");
    //$jsonData = json_encode($playData);
    //$jsonData = str_replace("\u0022","\\\\\"",json_encode( $playData,JSON_HEX_QUOT)); 
    //var_dump($jsonData);
    //appendToJSON($jsonData, 'ghData-v3.json');
    //var_dump($playData);
    //appendToJSON($playData, 'ghData-v3.json');
    $playData = json_decode(file_get_contents('ghData-v3.json'), false);
    lockAndUnlockScenarios($playData);
  }

  function parseBGG($link){
    /*
    TO DO -
    https://api.geekdo.com/xmlapi2/plays?username=EclecticMatt&id=174430
    https://boardgamegeek.com/wiki/page/BGG_XML_API2

      LINK (LOGGED PLAY ID) WILL BE THE UNIQUE FACTOR
      1) Get the link and check for current entry in JSON
      2) If no entry with this link found, add play details
      3) Parse XML for this play to convert into JSON
      XML in reverse-chron order, so would want to start at end
    */

    // Set up a new array to hold the logged plays
    $loggedPlays = [];
    // Set up an object to hold the plays data
    $fullData = new stdClass();
    $fullData->plays = [];
    $fullData->stats = new stdClass();
    $fullData->stats->playCount = 0;
    $fullData->stats->loggedPlayIds = [];
    $fullData->stats->completedScenarios = [];
    $fullData->stats->playTime = 0;

    // Call to helper function for simple get
    $bg_plays_xml = curlGet($link);
    // Parse the returned doc as XML
    $xml = new SimpleXMLElement($bg_plays_xml);
    /*if ( class_exists("SimpleXMLElement") || class_exists("SimpleXMLIterator") ){
      echo "SimpleXML found :-)";
    }else{
      echo "SimpleXML not found :-(";
    }*/

    //$xml->rewind();
    $curDate = $xml->play[0]->attributes()["date"];
    //$curDate = $xml->current()->attributes()["date"];
    $todaysEntries = [];

    $playCount = $xml->count();
    //echo $playCount . " plays found.\nStart date: " . $curDate . "\n";
    $playTime = 0;

    // PROCESS IN FORWARDS ORDER
    foreach ($xml as $thisXml){

      //IF THIS ENTRY'S ID NOT ALREADY LOGGED, ADD THIS ENTRY
      if ( !in_array ( $thisXml->attributes()["id"], $loggedPlays ) ){

        // IF DATE HAS CHANGED
        if ($curDate !== $thisXml->attributes()["date"]){

          // THEN PUSH THAT ARRAY INTO THE JSON AND RESET CURDATE
          for ($i = 0; $i < count($todaysEntries); $i++){
            // POP THE LAST ENTRY OFF TODAY'S ENTRIES
            $thisEntry = array_pop($todaysEntries);
            // AND PUSH THIS ON THE END OF THE PLAYS ARRAY
            array_push($fullData->plays, $thisEntry);

          }
          // RESET CURDATE AND TODAY'S ENTRIES
          $curDate = $thisXml->attributes()["date"];
          //echo "Pushed to plays. Date is now " . $curDate . "\n";
          $todaysEntries = [];
        }
        $newEntry = new stdClass();
        $newEntry->type = "scenario";
        $newEntry->tags = "scenario";
        $newEntry->id = (int)$thisXml->attributes()["id"];
        $newEntry->date = (string)$thisXml->attributes()["date"];
        $newEntry->length = (int)$thisXml->attributes()["length"];
        // Increment the total play time
        $playTime += (int)$thisXml->attributes()["length"];
        $newEntry->location = (string)$thisXml->attributes()["location"];
        $newEntry->comments = htmlspecialchars($thisXml->comments);
        //GONNA EXPLODE THE COMMENTS TO GET THE SCENARIO NUMBER AND NAME
        //EXPECT THE PATTERN TO BE:
        // 123 - The title of the scenario
        /*$pattern = "/(?'scenario'\d{1,3})(?>\s-\s)(?'title'(\w+|\s+)+)/gm";*/
        $pattern = "/(\d{1,3})(?>\s-*\s)((\w+|\s+)+)/";
        if(preg_match_all($pattern, $newEntry->comments, $matches)) {
          $newEntry->scenario = (int)$matches[1][0];
          $scenarioInfo = getScenarioInfo($newEntry->scenario);
          $newEntry->title = (string)$scenarioInfo["name"];
          //$newEntry->title = (string)$matches[0][0];
        }else{
          $newEntry->scenario = 1;
          $newEntry->title = "THE BLACK BARROW";
        }
        $gameWinFlag = false;
        $newEntry->players = [];
        foreach($thisXml->players->children() as $player){
            $newPlayer = new stdClass();
            $newPlayer->name = (string)$player->attributes()["name"];
            $newPlayer->userid = (string)$player->attributes()["userid"];
            $newPlayer->username = (string)$player->attributes()["username"];
            $newPlayer->role = (string)$player->attributes()["color"];
            if ($player->attributes()["win"] == "1"){
              $gameWinFlag = true;
            }
            array_push($newEntry->players, $newPlayer);
        }
        //The game is a win if any of the players win
        $newEntry->win = (boolean)$gameWinFlag;
        if ($gameWinFlag){
          array_push($fullData->stats->completedScenarios, $newEntry->scenario);
        }
        //echo $newEntry->scenario . " -> " . $newEntry->title . "\n";
        //Push the new entry into the plays array
        array_push($todaysEntries, $newEntry);
        //Add this play's ID into the loggedPlays array
        array_push($loggedPlays, (int)$newEntry->id);
      }
    }
    //Push the final day's entries into the plays array
    for ($i = 0; $i < count($todaysEntries); $i++){
      $thisEntry = array_pop($todaysEntries);
      array_push($fullData->plays, $thisEntry);
      //echo "Final day? Pushing plays for " . $thisEntry->date . "\n";
    }
    $fullData->stats->playCount = $playCount;
    $fullData->stats->loggedPlayIds = $loggedPlays;
    $fullData->stats->playTime = $playTime;
    $jsonData = json_decode(file_get_contents("ghData-v3.json"),TRUE);
    $scenarioData = $jsonData["scenarioInfo"];
    $fullData->scenarioInfo = $scenarioData;
    $mapData = $jsonData["mapInfo"];
    $fullData->mapInfo = $mapData;
    //echo "FULL DATA: \n";
    //var_dump($fullData);
    return $fullData;
  }



  function getScenarioInfo($scenarioNumber){
    $jsonData = json_decode(file_get_contents("ghData-v3.json"),TRUE);
    $scenarioData = $jsonData["scenarioInfo"];
    foreach ($scenarioData as $scenario){
      if ($scenario["scenario"] == $scenarioNumber){
        return $scenario;
      }
    }
    return false;
  }

  // TAKES THE DATA TO CHECK AND UPDATE, 
  function lockAndUnlockScenarios($data){
    
    //$mapData = curlGet("ghMapData.json");
    //var_dump($data);
    $completed = $data->stats->completedScenarios;
    //echo "COMPLETED: " . implode(",", $data->stats->completedScenarios);
    $data->stats->available = [];
    $data->stats->unavailable = [];
    
    // UNLOCK SCENARIOS FIRST (GO THROUGH AND FOR EACH COMPLETED, UNLOCK ANY)
    foreach ($completed as $scenarioNum){
      
      //We have the ID, get the play data
      $scenario = getScenarioInfo($scenarioNum);
      //var_dump($scenario);
      //$scenario = $scenarioData[array_search($scenario, $scenarioData)];
      $unlocks = processUnlocks($completed, $scenario);
      foreach($unlocks as $unlock){
        array_push($data->stats->available, (int)$unlock);
      }
      
    }

    // THEN LOCK SCENARIOS SECOND (GO THROUGH AND FOR EACH COMPLETED, LOCK OFF ANY)
    foreach ($completed as $scenarioNum){
      $scenario = getScenarioInfo($scenarioNum);
      $locks = processLocks($completed, $scenario);
      foreach($locks as $lock){
        array_push($data->stats->unavailable, (int)$lock);
      }
    }
  
    //var_dump($data->stats);
    sort($data->stats->available, SORT_NUMERIC);
    sort($data->stats->unavailable, SORT_NUMERIC);
    sort($data->stats->completedScenarios, SORT_NUMERIC);

    // Remove unavailable from available
    foreach($data->stats->unavailable as &$removeUnavail){
      if (($key = array_search($removeUnavail, $data->stats->available)) !== false) {
        unset($removeUnavail);
      }    
    }
    // Remove completed from available
    foreach($data->stats->completedScenarios as &$removeComplete){
      if (($key = array_search($removeComplete, $data->stats->available)) !== false) {
        unset($removeComplete);
      }
    }
    //echo "IN UNLOCKS DATA: \n";
    //var_dump($data);
    foreach($data->scenarioInfo as &$scenarioInfo){
      //var_dump($scenarioInfo);
      if (in_array($scenarioInfo->scenario, $data->stats->available, false)){
        $scenarioInfo->unlocked = true;
      }
      if (in_array($scenarioInfo->scenario, $data->stats->unavailable, false)){
        $scenarioInfo->locked = true;
      }
      if (in_array($scenarioInfo->scenario, $data->stats->completedScenarios, false)){
        $scenarioInfo->completed = true;
      }else{
        $scenarioInfo->completed = false;
      }
    }

    // Finally, save this information into the ghData.json
    appendToJSON($data, 'ghData-v3.json', '', true);

    //echo "COMPLETED: " . implode(",", $data->stats->completedScenarios) . "\n";
    //echo "LOCKED: " . implode(",", $data->stats->unavailable) . "\n";
    //echo "AVAIL: " . implode(",", $data->stats->available) . "\n";

  }

  /*
    unlocks will be in the format:
     12{!22}    = unlocks sc. 12 if sc. 22 is not completed
     12{22}     = unlocks sc. 12 if sc. 22 is completed
     12{22|23}  = unlocks sc. 12 if sc. 22 and 23 completed
     12{22|!23} = unlocks sc. 12 if sc. 22 completed and 23 not completed
     */
  function processUnlocks($completed, $scenario){

    //$patternCaptureCommaSeparated = "(\**\d*)(?:{*[!|\d]*}*\d*)";
    //$patternCaptureBrackets = "/(?:{)(\**\d*)(?:{*[!|\d]*}*\d*)/";
    //$patternCaptureInnerBrackets = "/(?:[{|])(?:[!|*]*)(\d)(?:[}*\d*]*)/";
    //$patternCaptureAll = "/(\w+\{[!\w|]+\})/";

    //Array of scenarios actually unlocked
    $arrUnlocks = [];

    //First check - are there any unlocks
    if ($scenario["unlocks"] == ""){
      //If not, return []
      return $arrUnlocks;
    }

    //Second check - are there multiple unlocks (commas)
    if ( strpos($scenario["unlocks"], ",") !== false){
      $unlocks = explode(",", $scenario["unlocks"] );
    }else{
      $unlocks = [$scenario["unlocks"]];
    }

    // Process each one
    foreach ($unlocks as $unlock){

      echo "Unlock: " . $unlock . "\n";

      //Third check - are there any conditions?
      if (strpos($unlock, "{") !== false){

          //Conditional rule
          $unlockedScenario = substr($unlock, 0, strpos($unlock, "{") );
          echo "Unlocked scenario: " . $unlockedScenario . "\n";
          $conditionsMet = true;
          $leftBracketPos = strpos($unlock, "{") + 1;
          $innerBrackets = substr($unlock, $leftBracketPos, strlen($unlock) - $leftBracketPos - 1);
          //var_dump($innerBrackets);

          if (strpos($innerBrackets, "|") !== false){

            echo "Detected multiple conditions: " . $innerBrackets;
            $conditions = explode("|", $innerBrackets);

            foreach ($conditions as $condition){

              //PROCESS CONDITION
              if (strpos($condition, "!") !== false){

                //SCENARIO MUST *NOT* BE COMPLETED
                $conflictingScenario = (int)substr($condition, 1);
                echo "Conflict Scenario: " . $conflictingScenario . "\n";
                if (in_array($conflictingScenario, $completed)){
                  // CONDITIONS NOT MET
                  $conditionsMet = false;
                }

              }else{
                //SCENARIO MUST BE COMPLETED
                echo "Dependent Scenario: " . $condition . "\n";
                if (!in_array($condition, $completed)){
                  // CONDITIONS NOT MET
                  $conditionsMet = false;
                }
              }
            }

            echo "Conditions Met: " . (string)$conditionsMet . "\n";

            if ($conditionsMet){
              // Unlock
              $unlockedScenario = str_ireplace("*", "", $unlockedScenario);
              array_push($arrUnlocks, $unlockedScenario);
            }
          }

      //if strpos("{")
      }else{
        //Straight unlock
        $unlock = str_ireplace("*", "", $unlock);
        array_push($arrUnlocks, $unlock);
      }

    }

    //Finally, return the unlocked scenarios
    return $arrUnlocks;
  }

  //Return true/false for if all conditions are met
  //@param $completed     The array of completed scenarios [1,2,3]
  //@param $conditions    An array of conditions, e.g. ["!23","22"]
  function processConditions($completed,$conditions){
    
  }


  function processLocks($completed, $scenario){

    //Array of scenarios actually locked
    $arrLocks = [];

    //First check - are there any unlocks
    if ($scenario["locks"] == ""){
      //If not, return []
      return $arrLocks;
    }

    //Second check - are there multiple unlocks (commas)
    if ( strpos($scenario["locks"], ",") !== false){
      $locks = explode(",", $scenario["locks"] );
    }else{
      $locks = [$scenario["locks"]];
    }
    

    // Process each one
    foreach ($locks as $lock){

      echo "Lock: " . $lock . "\n";

      //Third check - are there any conditions?
      if (strpos($lock, "{") !== false){

          //Conditional rule
          $lockedScenario = substr($lock, 0, strpos($lock, "{") );
          echo "Locked scenario: " . $lockedScenario . "\n";
          $conditionsMet = true;
          $leftBracketPos = strpos($lock, "{") + 1;
          $innerBrackets = substr($lock, $leftBracketPos, strlen($lock) - $leftBracketPos - 1);

          if (strpos($innerBrackets, "|") !== false){

            echo "Detected multiple conditions: " . $innerBrackets;
            $conditions = explode("|", $innerBrackets);

            foreach ($conditions as $condition){

              //PROCESS CONDITION
              if (strpos($condition, "!") !== false){

                //SCENARIO MUST *NOT* BE COMPLETED
                $conflictingScenario = (int)substr($condition, 1);
                echo "Conflict Scenario: " . $conflictingScenario . "\n";
                if (in_array($conflictingScenario, $completed)){
                  // CONDITIONS NOT MET
                  $conditionsMet = false;
                }

              }else{
                //SCENARIO MUST BE COMPLETED
                echo "Dependent Scenario: " . $condition . "\n";
                if (!in_array($condition, $completed)){
                  // CONDITIONS NOT MET
                  $conditionsMet = false;
                }
              }
            }

            echo "Conditions Met: " . (string)$conditionsMet . "\n";

            if ($conditionsMet){
              // Unlock
              $lockedScenario = str_ireplace("*", "", $lockedScenario);
              array_push($arrLocks, $lockedScenario);
            }
          }

      //if strpos("{")
      }else{
        //Straight lock
        $lock = str_ireplace("*", "", $lock);
        array_push($arrLocks, $lock);
      }

    }

    //Finally, return the locked scenarios
    return $arrLocks;
  }

  // GENERIC GET REQUEST, RETURNS STRING
  function curlGet($url){

  	//echo "Starting curl get...<br>";

  	$headers = [
  		'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:28.0) Gecko/20100101 Firefox/28.0'
  	];
  	$ch = curl_init();
  	curl_setopt($ch, CURLOPT_URL, $url);
  	curl_setopt($ch, CURLOPT_HTTPGET, true);
  	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  	try {
  	  $server_output = curl_exec($ch);
  	} catch (Exception $e){
  	  echo "Error in Curl";
  	}
  	//$server_output = curl_exec ($ch);
  	curl_close ($ch);

  	//echo "Curl closing now...<br>";

  	//return json_decode($server_output, true);
  	return $server_output;
  }


  // TAKES A NEW OBJECT AND APPENDS THIS TO EXISTING JSON
  function appendToJSON($newData, $filename, $sectionName, $replaceFlag = false){
    //Get the original file
    $original = file_get_contents($filename);
    //Decode the contents (as an associative array)
    $origDecode = json_decode($original, TRUE);
    //If replacing the data
    if ($replaceFlag){
      if ($sectionName === ''){
        $origDecode = $newData;  
      }else{
        $origDecode[$sectionName] = $newData;  
      }
    }else{
      if ($sectionName === ''){
        $origDecode[] = $newData;  
      }else{
        $origDecode[$sectionName][] = $newData;
      }
    }
    //Now encode the new JSON object
    $newEncode = json_encode($origDecode, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_LINE_TERMINATORS | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    //And put those contents into the JSON file
    $preventEcho = file_put_contents($filename, $newEncode);
    echo "New value appended to the JSON data.\n";
    echo "Check this has worked at <a href='generateTimeline.php'>generateTimeline</a>\n\n";
  }

  // OPENS A FILE AND JSON DECODES, RETURNS STRING
  function loadData($filename){
    $rawData = file_get_contents($filename, 'r');
    $data = json_decode($rawData);
    return $data;
  }

  // TAKES A NEW MANUAL ENTRY FROM THE FORM AND ADDS TO THE JSON ARRAY
  function processNewManualEntry(){
    $data = $_POST;
    echo "New manual entry received...";
    //Amend the date format
    $data["date"] = date("j F Y", strtotime($data["date"]));
    // Explode the characters into an array
    $chars = explode(",", $data["characters"]);
    //Force these back into the object as an array
    $data["characters"] = [];
    foreach($chars as $char){
      array_push($data["characters"], $char);
    }
    appendToJSON($data, 'ghData.json', 'data', false);
  }

  // SHOWS THE FORM WHERE YOU CAN SUBMIT NEW PLAYS
  function outputForm(){

    echo '<form name="newEntry" action="" method="POST">

      <label for="type">Timeline Entry Type: </label>
        <select name="type" id="type">
          <option value="scenario">Scenario</option>
          <option value="achievement">Achievement</option>
          <option value="event">Event</option>
        </select>
      <br>
      <label for="date">Session Date: </label><input name="date" type="date" value="' . strtotime('today') . '"></input>
      <br>
      <label for="tags">Tags (scenario/achievement): </label><input name="tags" type="text" value="scenario"></input>
      <br>
      <label for="scenario">Scenario Name: </label><input name="scenario" type="text" value="Sc. 1 - The Black Barrow"></input>
      <br>
      <label for="description">Description: </label><input name="description" type="text" value="Description - we did well."></input>
      <br>
      <label for="link">BGG Logged Play link: </label><input name="link" type="text" value="https://boardgamegeek.com/play/details/44255498"></input>
      <br>
      <label for="character">Characters: </label><input name="characters" type="text" value="Amber - Spellweaver, Matt - Tinkerer, Naomi - Cragheart, Oliver - Brute"></input>
      <br>
      <input type="submit">Submit</input>

    </form>';

}
