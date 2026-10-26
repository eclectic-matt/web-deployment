var killers = [];
var survivors = [];
var maps = [];

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
	const url = "../data/terrorscape.json";
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