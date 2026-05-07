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

outputLocationDataToElement = (location, elementId) => 
{		
	//Clear output 
	let outputEl = document.getElementById(outputElId);
	outputEl.style.display = 'block';
	outputEl.innerHTML = null;
	
	//Output location details
	/*
	<div class="location">
		<h2><die face="1" ></die>Coppersand<die face="1" ></die></h2>
	</div>
	*/
	let locationDiv = document.createElement('div');
	locationDiv.className = 'location';
	let dieEl = null;
	if(location.die > 0)
	{
		dieEl = document.createElement('die');
		dieEl.setAttribute('face', location.die);
	}

	let locationHead = document.createElement('h2');
	if(dieEl !== null)
	{
		locationHead.appendChild(dieEl);
	}
	locationHead.innerHTML = location.name;
	if(dieEl !== null)
	{
		locationHead.appendChild(dieEl);
	}

	//Output to the output element
	outputEl.appendChild(locationHead);
}