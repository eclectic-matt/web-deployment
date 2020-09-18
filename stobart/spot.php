<?php

include('templates/head.php');

echo '<title>Stobart Spotted!</title>
<script>

/* Show the results of a partial truck name search based on returned DB data */
function showResult(str) {
  if (str.length==0) {
    document.getElementById("livesearch").innerHTML="";
    document.getElementById("livesearch").style.border="0px";
    return;
  }
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      document.getElementById("livesearch").innerHTML=this.responseText;
      document.getElementById("livesearch").style.border="1px solid #A5ACB2";
    }
  }
  xmlhttp.open("GET","trucklist.php?q="+str,true);
  xmlhttp.send();
}

/* Get the user location for spot logging */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

/* Show this position on a preview map for checking */
function showPosition(position) {
  var latlon = position.coords.latitude + "," + position.coords.longitude;

  var img_url = "https://maps.googleapis.com/maps/api/staticmap?center=
  "+latlon+"&zoom=14&size=400x300&sensor=false&key=AIzaSyCsvaeMboDvQD_0OJ0aiJj-nRdFhC2vAh8";

  document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
}
</script>

</head>
<body>

<form class="w3-container">
<label for="iptTruckName">Truck Name: </label><input id="iptTruckName" class="w3-input" type="text" size="30" onkeyup="showResult(this.value)">
<div id="livesearch"></div>
<br>
<label for="iptLocationLat">Latitude: </label><input id="iptLocationLat" class="w3-input" type="number">
<label for="iptLocationLng">Longitude: </label><input id="iptLocationLng" class="w3-input" type="number">
<br>
<div id="mapholder"></div>

</form>

</body>
</html>';

?>
