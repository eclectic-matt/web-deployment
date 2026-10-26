var killers = [];
var survivors = [];
var maps = [];

//Called on body.onload
function init()
{
	getData();
	//populateData(result);
	applyQueryParams();
}

//Called in init() to load JSON data
async function getData() 
{
	//const url = "https://eclectic-matt.github.io/web-deployment/board/terrorscape/data/terrorscape.json";
	const url = "../terrorscape/data/terrorscape.json";
	console.log(`Fetching data from ${url}...`);
	try 
	{
		const response = await fetch(url);
		if (!response.ok)
		{
			throw new Error(`Response status: ${response.status}`);
		}

		const result = await response.json();
		//console.log(result);
		console.log(`Data fetched successfully from ${url}`);
		populateData(result);
	}
	catch (error)
	{
		console.error(error.message);
	}
}

function applyQueryParams()
{
	const urlParams = new URLSearchParams(window.location.search);
	if(urlParams.length === 0) return; //No query params, nothing to do

	//Set selected map
	const mapParam = urlParams.get('map');
	let selectedMapIndex = Array.from(document.getElementById("map-options").options).findIndex(option => option.value === mapParam);
	document.getElementById("map-options").selectedIndex = selectedMapIndex;
	//Set selected killer
	const killerParam = urlParams.get('killer');
	let selectedKillerIndex = Array.from(document.getElementById("killer-options").options).findIndex(option => option.value === killerParam);
	document.getElementById("killer-options").selectedIndex = selectedKillerIndex;
	//Set selected survivors
	const survivorsParam = urlParams.get('survivors');
	if (survivorsParam)
	{
		console.log(`Survivors param: ${survivorsParam}`);
		let selectedSurvivorIds = survivorsParam.split(',');
		console.log(`All survivor IDs: ${Array.from(document.getElementById("survivor-options").options).map(option => option.value)}`);
		let selectedSurvivorIndices = selectedSurvivorIds.map(
			id => Array.from(
				document.getElementById("survivor-options").options
			).findIndex(
				option => option.value === id
			)
		);
		console.log(`Selected survivor indices: ${selectedSurvivorIndices}`);
		selectedSurvivorIndices.forEach(index => {
			document.getElementById("survivor-options").options[index].selected = true;
		});
	}
	generateSummary();
}

//Fill the JS global vars with data from the JSON file and populate the select elements
function populateData(data)
{
	//Store into global vars for other functions to use
	killers = data.killers;
	survivors = data.survivors;
	maps = data.maps;
	//Populate choices for the user to select from
	populateSelect(maps, "map");
	populateSelect(killers, "killer");
	populateSelect(survivors, "survivor");
}

//Populate the select elements with options from the data
function populateSelect(data, type)
{
	let select = document.getElementById(`${type}-options`);
	let options = "";

	data.forEach(item => {
		options += `<option value="${item.id}">${item.name} (${item.expansion})</option>`;
	});

	select.innerHTML = options;
}

//Update the selected survivors and log their names and expansions to the console
function updateSurvivors()
{
	let selectedSurvivorsContainer = document.getElementById("survivors-summary");

	let selectedSurvivors = Array.from(document.getElementById("survivor-options").selectedOptions).map(option => option.value);

	selectedSurvivorsContainer.innerHTML = "<h2>Selected Survivors</h2><ul>" + selectedSurvivors.map(survivorId => {
		let survivor = survivors.find(s => s.id === survivorId);
		return survivor ? `<li>${survivor.name} (${survivor.expansion})</li>` : '';
	}).join('') + "</ul>";
}

function updateKiller()
{
	let selectedKillerContainer = document.getElementById("killer-summary");
	let selectedKillerId = document.getElementById("killer-options").value;
	let selectedKiller = killers.find(k => k.id === selectedKillerId);
	selectedKillerContainer.innerHTML = "<h2>Selected Killer</h2>" + (selectedKiller ? `<p>${selectedKiller.name} (${selectedKiller.expansion})</p>` : '');
}

function updateMap()
{
	let selectedMapContainer = document.getElementById("map-summary");
	let selectedMapId = document.getElementById("map-options").value;
	let selectedMap = maps.find(m => m.id === selectedMapId);
	selectedMapContainer.innerHTML = "<h2>Selected Map</h2>" + (selectedMap ? `<p>${selectedMap.name} (${selectedMap.expansion})</p>` : '');
}

function resetSelections()
{
	document.getElementById("map-options").selectedIndex = 0;
	document.getElementById("killer-options").selectedIndex = 0;
	document.getElementById("survivor-options").selectedIndex = -1; // Deselect all survivors

	document.getElementById("map-summary").innerHTML = "<h2>Map Summary</h2>";
	document.getElementById("killer-summary").innerHTML = "<h2>Killer Summary</h2>";
	document.getElementById("survivors-summary").innerHTML = "<h2>Survivors Summary</h2>";
}

function generateSummary()
{
	let summaryContainer = document.getElementById("summary");
	let selectedMapId = document.getElementById("map-options").value;
	let selectedKillerId = document.getElementById("killer-options").value;
	let selectedSurvivorIds = Array.from(document.getElementById("survivor-options").selectedOptions).map(option => option.value);
}

function generateLink()
{
	let selectedMapId = document.getElementById("map-options").value;
	let selectedKillerId = document.getElementById("killer-options").value;
	let selectedSurvivorIds = Array.from(document.getElementById("survivor-options").selectedOptions).map(option => option.value);
	//alert(`Generated link: ` + window.location.origin + window.location.pathname + `?map=${selectedMapId}&killer=${selectedKillerId}&survivors=${selectedSurvivorIds.join(',')}`);
	let generatedLinkContainer = document.getElementById("generated-link");
	generatedLinkContainer.innerHTML = `<p>Generated link: <a href="${window.location.origin}${window.location.pathname}?map=${selectedMapId}&killer=${selectedKillerId}&survivors=${selectedSurvivorIds.join(',')}">${window.location.origin}${window.location.pathname}?map=${selectedMapId}&killer=${selectedKillerId}&survivors=${selectedSurvivorIds.join(',')}</a></p>`;
}