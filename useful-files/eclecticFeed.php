<?php

// Generate RSS feed block on homepage
$site = "http://eclecticapp.xyz/blog/feed/";

$ch = curl_init(); 
curl_setopt($ch, CURLOPT_URL, $site); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
$xmlstr = curl_exec($ch); 
curl_close($ch);      

$sitexml = new SimpleXMLElement($xmlstr);

$title = $sitexml -> channel -> title;
$link = $sitexml -> channel -> link;
// Generate block output
$output = "<div class='w3-panel w3-theme-d5'>";
$output .= "<h3><a href='" . $link . "'>" . $title . "</a></h3>";
$output .= "<em>Latest posts:</em>";

$output .= "<ul class='w3-ul'>";
$item_no = 0;

foreach ($sitexml->channel->item as $post){
	$item_no++;
	$val = ($item_no % 5) + 1;
	$p_title = $post->title;
		$p_date = $post->pubDate;
	$p_date = strftime("%d/%m/%Y", strtotime($p_date));
	$p_link = $post->link;
	$output .= "<li>
					<ul class='w3-ul w3-panel w3-theme-l" . $val . "'>
						<a href='" . $p_link . "'>
							<li>	
								#" . $item_no . " - " . $post->title . "
							</li>
							<li text-align='right'>
								Posted: <span>" . $p_date . "</span>
							</li>
						</a>
					</ul>
				</li>";
}
$output .= "</ul>";
$output .= "</div>";

echo $output;

?>
