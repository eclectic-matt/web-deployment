//Click location to zoom
showLocation = (locationName) => 
{
	//No location? Show town again
	if(locationName === undefined)
	{
		//Reset location 
	}
	
	//Show "back to town" button
	let townBtn = document.getElementById("navBtnTown");
	townBtn.innerHTML = "Back to town...";
	townBtn.onclick = () => {
		showLocation();
	}
	//Hide all locations
	document.getElementById('town').style.display = 'none';
	//Show current location large
	let loc = document.getElementById('location');
	loc.innerHTML = '<h2>SELECTED LOCATION</h2>';
}