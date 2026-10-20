<?php

  //const JSON_FILE_NAME = 'ghNewData.json';
  const JSON_FILE_NAME = 'ghData-v3.json';

  //Generate timeline will run the whole process and return the full html
  $timeline = generateTimeline();
  //Use the line below as part of a larger html file at the bottom
  //outputTimeline($timeline);

  function outputTimeline($timeline){
    echo $timeline;
  }

  function generateTimeline(){
    $ghData = loadData(JSON_FILE_NAME);
    //var_dump($ghData);
    $output = '';
    //$loggedPlayData = $ghData->data[0]->plays;
    $loggedPlayData = $ghData->plays;
    $playCount = count($loggedPlayData);
    //echo "Play Count: " . $playCount;
    for ($i = ($playCount - 1); $i >= 0; $i--){
      if ($loggedPlayData[$i]->type !== "scenario"){
        $output .= generateTimelineHighlight($loggedPlayData[$i]);
      }else{
        $output .= generateTimelineItem($loggedPlayData[$i]);
      }
    }
    /*foreach($loggedPlayData as $loggedPlay){
      if ($loggedPlay->type !== "scenario"){
        $output .= generateTimelineHighlight($loggedPlay);
      }else{
        $output .= generateTimelineItem($loggedPlay);
      }
    }*/
    return $output;
  }

  function loadData($filename){
    $rawData = file_get_contents($filename, 'r');
    $data = json_decode($rawData);
    return $data;
  }

  // USING A STANDARD HTML TEMPLATE, GENERATE A SINGLE TIMELINE ITEM (LOGGED PLAY)
  function generateTimelineItem($loggedPlayData){
    $date = $loggedPlayData->date;
    $tags = $loggedPlayData->tags;
    $scenario = $loggedPlayData->scenario;
    $title = $loggedPlayData->title;
    $description = $loggedPlayData->comments;
    $link = "https://boardgamegeek.com/play/details/" . $loggedPlayData->id;
    $characters = $loggedPlayData->players;
    $output = '<!-- Timeline Item -->';
    $output .= '<li class="timeline-item">';
    $output .= '  <div class="timeline-panel">';
    $output .= '    <div class="timeline-point"></div>';
    $output .= '      <span class="timeline-time">' . $date . '</span>&nbsp;';
    $output .= '      <span class="timeline-tags">' . ucfirst($tags) . '</span><br>';
    $output .= '      <span class="timeline-title">Scenario ' . $scenario . ' - ' . $title . '</span>';
    $output .= '      <div class="timeline-desc"><p>';
    $output .= '        ' . $description . '</p>';
    if (count($characters) > 0){
      $output .= '      <ul>';
      foreach ($characters as $char){
        $output .= '        <li>' . $char->name . ' - ' . $char->role . '</li>';
      }
      $output .= '      </ul>';
    }
    $output .= '    <p><a target="_blank" href="' . $link . '">Logged Play Details</a></p>';
    $output .= '   </div>';
    $output .= '  </div>';
    $output .= '</li>';
    return $output;
  }

  function generateTimelineHighlight($data){
    $type = $data->type;
    $date = $data->date;
    $title = $data->title;
    $description = $data->description;
    $output = '<!-- Timeline YEAR -->';
    $output .= '<span class="yearAnchor" id="' . htmlspecialchars($date) . '"></span>';
    $output .= '<li class="timeline-item timeline-year">
      <div class="timeline-panel">
        <div class="timeline-point"></div>
        <div class="w3-right w3-medium">
          <a class="top-link w3-tooltip" alt="Back to Top" href="#top">
            <span class="w3-text">Back to top</span>
          </a>
        </div>';
    $output .= '<div class="timeline-time timeline-title">' . $title . '</div>';
    /*$output .= '<span class="timeline-tags">Achievement</span>';
    if ($description){
      $output .= '<div class="timeline-desc"><p>' . $description . '</p></div>';
    }*/
    $output .= '</div></li>';
    return $output;
  }

  // outputTimeline() called in included file below
  include 'ghTimelineContent.php';

?>

