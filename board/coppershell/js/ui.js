//Click location to zoom
showLocation = (locationName) => 
{
	let townBtn = document.getElementById("navBtnTown");
	
	//No location? Show town again
	if(locationName === undefined)
	{
		//Reset location 
		townBtn.innerHTML = "Town";
		townBtn.onclick = () => {
			showLocation();
		}
		//Show all locations
		document.getElementById('town').style.display = 'block';
		document.getElementById('location').style.display = 'none';
		return;
	}
	
	//Show "back to town" button
	townBtn.innerHTML = "Back to town...";
	townBtn.onclick = () => {
		showLocation();
	}
	//Hide all locations
	document.getElementById('town').style.display = 'none';
	//Show current location large
	//let loc = document.getElementById('location');
	//loc.innerHTML = '<h2>' + locationName + '</h2>';
	game.getLocation(locationName, 0, 'location');
}