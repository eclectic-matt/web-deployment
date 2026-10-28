var killers = [];
var survivors = [];
var maps = [];
var expansions = [];

//Called on body.onload
function init()
{
	getData();
	//populateData(result);
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
		//Then populate options
		populateData(result);
		//Then apply URL filters
		applyQueryParams();
	}
	catch (error)
	{
		console.error(error.message);
	}
}

function applyQueryParams()
{
	const urlParams = new URLSearchParams(window.location.search);
	// FIX: Use .size instead of .length
	if (urlParams.size === 0) return;

	console.log('Query Param Parsing on', window.location.path + window.location.search);
	// Cache DOM elements to avoid querying the document repeatedly
	const mapSelect = document.getElementById("map-options");
	const killerSelect = document.getElementById("killer-options");
	const survivorSelect = document.getElementById("survivor-options");

	// Set selected map
	const mapParam = urlParams.get('map');
	console.log('queryParamsLoaded - map', mapParam);
	if (mapParam && mapSelect)
	{
		let selectedMapIndex = Array.from(mapSelect.options).findIndex(option => option.value === mapParam);
		if (selectedMapIndex !== -1) mapSelect.selectedIndex = selectedMapIndex;
	}

	// Set selected killer
	const killerParam = urlParams.get('killer');
	console.log('queryParamsLoaded - killer', killerParam);
	if (killerParam && killerSelect)
	{
		let selectedKillerIndex = Array.from(killerSelect.options).findIndex(option => option.value === killerParam);
		if (selectedKillerIndex !== -1) killerSelect.selectedIndex = selectedKillerIndex;
	}

	// Set selected survivors
	const survivorsParam = urlParams.get('survivors');
	console.log('queryParamsLoaded - survivors', survivorsParam);
	if (survivorsParam && survivorSelect)
	{
		let selectedSurvivorIds = survivorsParam.split(',');
		let selectedSurvivorIndices = selectedSurvivorIds
			.map(id => Array.from(survivorSelect.options).findIndex(option => option.value === id))
			.filter(index => index !== -1); // FIX: Filter out missing/invalid options

		selectedSurvivorIndices.forEach(index =>
		{
			survivorSelect.options[index].selected = true;
		});
	}

	// Ensure the summary function exists before calling
	if (typeof generateSummary === "function")
	{
		generateSummary();
	}
}

//Fill the JS global vars with data from the JSON file and populate the select elements
function populateData(data)
{
	//Store into global vars for other functions to use
	killers = data.killers;
	survivors = data.survivors;
	maps = data.maps;
	expansions = data.expansions;

	//Populate choices for the user to select from
	populateSelect(maps, "map");
	populateSelect(killers, "killer");
	populateSelect(survivors, "survivor");
}

function getExpansionName(id)
{
	return expansions.find(i => i.id === id).name;
}

//Populate the select elements with options from the data
function populateSelect(data, type)
{
	let select = document.getElementById(`${type}-options`);
	let options = "";

	data.forEach(item =>
	{
		options += `<option value="${item.id}">${item.name} (${getExpansionName(item.expansion)})</option>`;
	});

	select.innerHTML = options;
}

//Update the selected survivors and log their names and expansions to the console
function updateSurvivors()
{
	let selectedSurvivorsContainer = document.getElementById("survivors-summary");

	let selectedSurvivors = Array.from(document.getElementById("survivor-options").selectedOptions).map(option => option.value);

	selectedSurvivorsContainer.innerHTML = "<h2>Selected Survivors</h2><ul>" + selectedSurvivors.map(survivorId =>
	{
		let survivor = survivors.find(s => s.id === survivorId);
		return survivor ? `<li>${survivor.name} (${survivor.expansion})</li>` : '';
	}).join('') + "</ul>";
}

function updateKiller()
{
	let selectedKillerContainer = document.getElementById("killer-summary");
	let selectedKillerId = document.getElementById("killer-options").value;
	let selectedKiller = killers.find(k => k.id === selectedKillerId);

	if (selectedKiller != undefined)
	{
		selectedKillerContainer.innerHTML = "<h2>Selected Killer</h2>";
		//killer details
		selectedKillerContainer.innerHTML += `<p>${selectedKiller.name} (${selectedKiller.expansion})</p>`;
		selectedKillerContainer.innerHTML += `<em>${selectedKiller.description}</em>`;
		selectedKillerContainer.innerHTML += `<p><b>Starting Strength: ${selectedKiller.starting_strength}</b></p>`;
		//levels
		let rows = "";
		for (let i = 0; i < selectedKiller.level_abilities.length; i++)
		{
			let level = selectedKiller.level_abilities[i];
			rows += `<tr><td>${level.level}</td><td>${level.ability}</td></tr>`;
		}
		selectedKillerContainer.innerHTML += `<table><tr><th>Level</th><th>Ability</th></tr>${rows}</table>`;
	}
	//selectedKillerContainer.innerHTML = "<h2>Selected Killer</h2>" + (selectedKiller ? `<p>${selectedKiller.name} (${selectedKiller.expansion})</p>` : '');
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
	let linkUrl = `${window.location.origin}${window.location.pathname}?map=${selectedMapId}&killer=${selectedKillerId}&survivors=${selectedSurvivorIds.join(',')}`;
	let generatedLinkContainer = document.getElementById("generated-link");
	generatedLinkContainer.innerHTML = `<p>Generated link: <a href="${linkUrl}">${linkUrl}</a></p>`;
}