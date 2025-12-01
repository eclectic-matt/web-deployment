//update 2025-11-27 19:40:00
//debug("Notes initialized");

//GLOBAL VARIABLES (urgh)
//Default to 10p, set in menu
var playerCount = 10;
var script = "tb";
//Store names separately to reuse
var playerNames = [];
//Names of roles on the current script
var scriptRoles = [];
var playersObj = {
	settings: {},
	players: []
}
var showPlayerRoles = true;

//Defined constants
const addRoleBtnText = "Edit"; //"+";
const pencilIconUnicode = "&#9998;";

/*
const playersExample = [
	{
		name: 'Matt',
		seat: 1,
		roles: ['Virgin', 'Slayer'],
		living: true,
		deadVote: true,
		alignment: 'good', //'evil'
		notes: ''
	}
];
*/


var roleCounts = [
    null, //0
    null, //1
    null, //2
    null, //3
    null, //4
    '3t / 0o / 1m / 1d', //5
    '3t / 1o / 1m / 1d', //6
    '5t / 0o / 1m / 1d', //7
    '5t / 1o / 1m / 1d', //8
    '5t / 2o / 1m / 1d', //9
    '7t / 0o / 2m / 1d', //10
    '7t / 1o / 2m / 1d', //11
    '7t / 2o / 2m / 1d', //12
    '9t / 0o / 3m / 1d', //13
    '9t / 1o / 3m / 1d', //14
    '9t / 2o / 3m / 1d', //15
    '9t / 2o / 3m / 1d (1trv)', //16
    '9t / 2o / 3m / 1d (2trv)', //17
    '9t / 2o / 3m / 1d (3trv)', //18
    '9t / 2o / 3m / 1d (4trv)', //19
    '9t / 2o / 3m / 1d (5trv)' //20
];









//start
init();

async function init()
{
	scriptRoles = await getScriptRoles(script)
	if(hasSavedData())
	{
		document.getElementById('loadSavedBtn').disabled = false;
	}
	if(!playersObj.players || playersObj.players.length == 0)
	{
		createPlayersObject();
	}
	setup();
}

async function getScriptRoles(selectedScriptShortName)
{
	scriptRoles = await fetch('./roles.json');
	scriptRoles = await scriptRoles.json();
	//scriptRoles = [{team:'townsfolk',name:'chef'}];
	
	//Return all roles
	if(selectedScriptShortName != "all")
	{
		//Filter to edition
		scriptRoles = scriptRoles.filter((r) => { return r.edition == selectedScriptShortName});
	}
	
	return scriptRoles;
}

function createPlayersObject()
{
	//Only init playersObj if empty
	if(playersObj.players.length == 0){
		playersObj = {
			settings: {
				script: script
			},
			players: []
		}
	}
	setupPlayersArray(playerCount);
}

function setupPlayersArray(pCount){
	//Add players to array
	if(playersObj.players.length < pCount)
	{
		//Add players to array
		for(let i=playersObj.players.length; i<pCount; i++)
		{
			playersObj.players.push({
				name: "p" + i,
				seat: i,
				roles: [],
				living: true,
				deadVote: true,
				alignment: 'good',
				notes: ''
			});
		}
	}
	else
	{
		//Remove players from array from pCount -> end
		let pCopy = playersObj.players;
		//debug('Before decrease: ' + pCopy.map((p) => { return p.name;}).join(', '));
		pCopy.splice(pCount);
		//debug('After: ' + pCopy.map((p) => { return p.name;}).join(', '));
		playersObj.players = pCopy;
		/*for(let i = playersObj.players.length; i<pCount; i--){
			//Remove element from end of array
			playersObj.players.pop();
		}*/
	}
	//debug('Players new length: ' + pCount);
	//debug('Names: ' + playersObj.players.map((p) => { return p.name;}).join(', '));
}

function setup()
{
	
	//Calculate screen dimensions 
	//let [w, h, r] = calcScreenDimensions();
	//console.log("Window Width: " + w + ", Window Height: " + h)
	createPlayerTokens();
	createRolesWindow();
}



function saveToLocalStorage()
{
	try{
		localStorage.setItem("players", JSON.stringify(playersObj));
	}catch(ex){
		console.log(ex);
	}
}

function loadFromLocalStorage()
{
	try{
		playersObj = JSON.parse(localStorage.getItem("players"));
	}catch(ex){
		console.log(ex);
	}
}

function hasSavedData()
{
	let boolData = false;
	try {
		//Bool test
		boolData = localStorage.getItem("players");
	}catch(ex){
		console.log(ex);
	}
	return boolData;
}



function createPlayerTokens()
{
	//Ensure playerCount set correctly
	playerCount = playersObj.players.length;
	//Get reference to main
	let main = document.getElementById("main");
	//Clear main between runs
	main.innerHTML = null;

	let [w, h, r] = calcScreenDimensions();
	//Calculate fixed values
	let centerAdjustX = -50;
	let centerAdjustY = -25;
	let cx = (0.5 * w) + centerAdjustX;
	let cy = (0.6 * h) + centerAdjustY;
	let eclipseWidth = w / 3;
	let eclipseHeight = h / 3;
	let shortestSide = Math.min(w, h);
	let elementRadius = Math.floor((1.5 * shortestSide) / (0.8 * playerCount));
	
	//Create player elements
	for (let i = 0; i < playerCount; i++)
	{
		let el = document.createElement('div');
		el.style.position = "absolute";
		el.style.width = elementRadius + 'px';
		el.style.height = elementRadius + 'px';
		//Calculate position for each token
		//- angle is 2PI split into playerCount sections, rotated along by PI/2 (due east is 0deg, want due south)
		let angle = i * (2 * Math.PI / playerCount) + (Math.PI / 2);

		let point = getPointInEclipse(cx, cy, eclipseWidth, eclipseHeight, angle);
		let x = point.x;
		let y = point.y;
		let left = x + 'px';
		let top = y + 'px';
		
		//debug(i + ' => ' + x + ', ' + y + ' => ' + left + ', ' + top);
		el.style.top = top;
		el.style.left = left;
		
		//console.log(i, angle, x, y);
		el.className = "player";
		el.id = "player" + (i + 1);
		el.dataset.player = i;
		//ALIGNMENT
		if(playersObj.players[i].alignment == 'Evil')
		{
			//el.style.borderColor = 'red';
			el.classList.add('evil');
			el.classList.remove('good');
		}else{
			//el.style.borderColor = 'green';
			el.classList.add('good');
			el.classList.remove('evil');
		}
		
		//Death shroud?
		let deathShroud = document.createElement('div');
		deathShroud.id = "player" + i + "Shroud";
		deathShroud.className = 'shroud';
		deathShroud.style.width = '60%';
		deathShroud.style.marginLeft = '20%';
		deathShroud.style.marginTop = '10%';
		deathShroud.style.marginBottom = 0;
		deathShroud.style.height = '0.75rem';
		deathShroud.style.backgroundColor = 'red';
		deathShroud.style.color = 'white';
		deathShroud.style.fontSize = '0.5rem';
		deathShroud.style.textAlign = 'center';
		deathShroud.innerHTML = 'DEAD';
		//Not "living" => show death shroud
		if(playersObj.players[i] && !playersObj.players[i].living)
		{
			//deathShroud.style.display = 'block';
			//el.style.filter = 'grayscale(100%)';
			el.classList.remove('living');
			el.classList.add('dead');
		}else{
			//deathShroud.style.display = 'none';
			el.classList.remove('dead');
			el.classList.add('living');
		}
		if(playersObj.players[i] && playersObj.players[i].voteUsed)
		{
			deathShroud.innerHTML += ' (no vote)';
		}
		deathShroud.style.zIndex = 100;
		el.appendChild(deathShroud);
		let addBtn = document.createElement('button');
		if(playersObj.players[i] && playersObj.players[i].roles.length > 0)
		{
			addBtn.innerHTML = playersObj.players[i].roles.join(', ');
		}else{
			addBtn.innerHTML = addRoleBtnText;
		}
		if(playersObj.players[i] && playersObj.players[i].notes.length > 0)
		{
			addBtn.innerHTML += pencilIconUnicode;
		}
		addBtn.style.marginTop = '5%';
		addBtn.style.fontSize = Math.floor(shortestSide / 50) + 'px';
		addBtn.className = "addBtn";
		addBtn.onclick = () => openPlayerEditWindow(addBtn);
		addBtn.id = "player" + i + "Roles";
		el.appendChild(addBtn);
		let nameInput = document.createElement('input');
		nameInput.onchange = () => setPlayerName(nameInput);
		nameInput.type = "text";
		//NOTE: these default to player1 - player20 so this should always be true
		if (playersObj.players[i] && playersObj.players[i].name.length > 0) {
			console.log('setting the name of player ' + i + ' to ' + playersObj.players[i].name);
			nameInput.value = playersObj.players[i].name;
			nameInput.innerHTML = playersObj.players[i].name;
		} else {
			nameInput.value = "p" + i;
		}
		nameInput.className = "nameInput";
		el.appendChild(nameInput);
		main.appendChild(el);
	}
	
	let central = document.getElementById('central');
	central.innerHTML = roleCounts[playerCount] + '<br>Alive: <span id="livingPlayersSpan">' + playerCount + '</span> - Votes: <span id="votesSpan">' + playerCount + '</span>';
	//main.appendChild(central);
}

function getPointInEclipse(cx, cy, w, h, angle)
{
	return {
		x: cx + (w * Math.cos(angle)),
		y: cy + (h * Math.sin(angle))
	};
}

function createRolesWindow()
{
	//Fill addRoleWindow
	let addRoleWindowEl = document.getElementById('addRoleWindow');
	addRoleWindowEl.innerHTML = null;
	//Set scroll overflow
	addRoleWindowEl.style.overflowY = 'scroll';
	//-head
	let rolesHeader = document.createElement('h3');
	rolesHeader.style.textAlign = 'center';
	rolesHeader.style.backgroundColor = 'darkgreen';
	rolesHeader.innerHTML = "Change Info for <span id='playerName'></span> <span id='playerId' class='hidden'></span>";
	//-closeBtn (in header)
	let closeAddRoleBtn = document.createElement('button');
	closeAddRoleBtn.innerHTML = "X";
	closeAddRoleBtn.onclick = () => closePlayerEditWindow();
	rolesHeader.appendChild(closeAddRoleBtn);
	addRoleWindowEl.appendChild(rolesHeader);
	
	//Dead/VoteUsed/Alignment changes
	let statusTable = document.createElement('table');
	statusTable.id = "statusTable";
	let statusHeadRow = document.createElement('tr');
	let deadTh = document.createElement('th');
	deadTh.innerHTML = "Dead?";
	statusHeadRow.appendChild(deadTh);
	let voteTh = document.createElement('th');
	voteTh.innerHTML = "Vote Used?";
	statusHeadRow.appendChild(voteTh);
	let alignTh = document.createElement('th');
	alignTh.innerHTML = "Align";
	statusHeadRow.appendChild(alignTh);
	statusTable.appendChild(statusHeadRow);

	//The actual checks row
	let updateRow = document.createElement('tr');
	//dead?
	let deadStatusTd = document.createElement('td');
	let deadStatusCheck = document.createElement('input');
	deadStatusCheck.id = "deadStatusCheck";
	deadStatusCheck.type = 'checkbox';
	deadStatusCheck.dataset.type = 'dead';
	deadStatusCheck.onchange = () => updateDeathShroud(deadStatusCheck);
	deadStatusTd.appendChild(deadStatusCheck);
	updateRow.appendChild(deadStatusTd);

	//voteUsed?
	let voteStatusTd = document.createElement('td');
	let voteStatusCheck = document.createElement('input');
	voteStatusCheck.id = "voteStatusCheck";
	voteStatusCheck.type = 'checkbox';
	voteStatusCheck.dataset.type = 'vote';
	voteStatusCheck.onchange = () => updateVoteStatus(voteStatusCheck);
	voteStatusTd.appendChild(voteStatusCheck);
	updateRow.appendChild(voteStatusTd);

	//alignment?
	let alignStatusTd = document.createElement('td');
	let alignmentSelect = document.createElement('select');
	alignmentSelect.id = "alignmentSelect";
	let alignmentSelectOptionGood = document.createElement('option');
	alignmentSelectOptionGood.value = 'good';
	alignmentSelectOptionGood.selected = true;
	alignmentSelectOptionGood.innerHTML = 'Good';
	alignmentSelect.appendChild(alignmentSelectOptionGood);
	let alignmentSelectOptionEvil = document.createElement('option');
	alignmentSelectOptionEvil.value = 'evil';
	alignmentSelectOptionEvil.selected = false;
	alignmentSelectOptionEvil.innerHTML = 'Evil';
	alignmentSelect.appendChild(alignmentSelectOptionEvil);
	alignmentSelect.onchange = () => updateAlignment(alignmentSelect);
	alignStatusTd.appendChild(alignmentSelect);
	updateRow.appendChild(alignStatusTd);

	statusTable.appendChild(updateRow);

	addRoleWindowEl.appendChild(statusTable);

	// - notes
	let noteElHead = document.createElement('h4');
	noteElHead.innerHTML = "Player Notes";
	addRoleWindowEl.appendChild(noteElHead);
	let noteEl = document.createElement('textarea');
	noteEl.id = 'playerNotes';
	noteEl.style.width = '90vw';
	noteEl.style.height = '20vh';
	
	addRoleWindowEl.appendChild(noteEl);

	//-list roles as checkboxes
	let rolesListHeader = document.createElement('h4');
	rolesListHeader.innerHTML = "Player Role(s)";
	addRoleWindowEl.appendChild(rolesListHeader);

	//let addRoleList = document.createElement('ul');
	
	//Split into teams (tf, os, )
	let teams = [ "townsfolk", "outsider", "minion", "demon", "traveler" ];//, "fabled", "loric" ];
	
	//Generate array of roles
	let teamRoles = teams.map(
		(t) => { 
			return scriptRoles.filter(
				(r) => { 
					return r.team == t;
				}
			);
		}
	);
	let teamCounts = teamRoles.map(
		(t) => {
			return t.length;
		}
	);
	let maxRoleCount = Math.max(...teamCounts);
	
	let table = document.createElement('table');
	let tr = document.createElement('tr');
	teams.forEach((t) => {
		let th = document.createElement('th');
		th.innerHTML = t.toUpperCase();
		tr.appendChild(th);
	});
	table.appendChild(tr);
	
	for(let r = 0; r < maxRoleCount; r++)
	{
		tr = document.createElement('tr');
		for(let c = 0; c < teams.length; c++)
		{
			let td = document.createElement('td');
			
			if(teamRoles[c].length > r){
			let roleCheck = document.createElement('input');
			roleCheck.className = 'roleCheck';
			roleCheck.type = 'checkbox';
			roleCheck.dataset.role = teamRoles[c][r].name;
			roleCheck.onchange = () => addRole(roleCheck);
			td.appendChild(roleCheck);
			td.appendChild(document.createElement('br'));
			let roleSpan = document.createElement('span');
			roleSpan.innerHTML = teamRoles[c][r].name;
			td.appendChild(roleSpan);
			}
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	
	addRoleWindowEl.appendChild(table);
}

function addRole(el)
{
	let playerId = document.getElementById('playerId').innerHTML;
	//let playerId = el.dataset.player;
	let roleName = el.dataset.role;
	//console.log(playerId, roleName);
	if(el.checked){
		playersObj.players[playerId].roles.push(roleName);
	}else{
		playersObj.players[playerId].roles = playersObj.players[playerId].roles.filter((r) => r !== roleName);
	}
	let roleBtn = document.getElementById("player" + playerId + "Roles");
	roleBtn.innerHTML = playersObj.players[playerId].roles.join(', ');
}

function updateAlignment(el)
{
	let playerId = document.getElementById('playerId').innerHTML;
	//alternatively, show with border? - remember confusingly set playerId+1 for the player elements themselves!
	let playerEl = document.getElementById("player" + (parseInt(playerId) + 1));
	console.log('Alignment updated for player ' + playerId + ' to ' + el.value);
	//Set on players object
	playersObj.players[playerId].alignment = el.value;
	if(el.value == 'good'){
		playerEl.classList.remove('evil');
		playerEl.classList.add('good');
	}else{
		playerEl.classList.remove('good');
		playerEl.classList.add('evil');
	}
}


function calcScreenDimensions()
{
	let w = window.innerWidth;
	//90% to allow for nav
	let h = 0.9 * window.innerHeight;
	//Radius of tokens
	let r = 0.1 * h;
	//let values = [w, h];
	return [w, h, r];
}

function openPlayerEditWindow(el)
{
	//Show the info window
	let addRoleWindowEl2 = document.getElementById('addRoleWindow');
	addRoleWindowEl2.style.display = 'block';
	
	let playerId = el.parentElement.dataset.player;
	//Set the player name on the window header
	if(playersObj.players[playerId].name){
		document.getElementById('playerName').innerHTML = playersObj.players[playerId].name;
		//console.log('PlayerName updated to show: ' + playersObj.players[playerId].name);
	}else{
		document.getElementById('playerName').innerHTML = "player" + (playerId + 1);
	}
	//Set the (hidden) playerId element
	document.getElementById('playerId').innerHTML = playerId;
	//debug('Getting stored roles for player with ID ' + playerId);
	//Populate notes and checkboxes
	let roleNames = playersObj.players[playerId].roles;
	
	//Get the checkbox elements (HTML collection)
	let checkboxes = document.getElementsByClassName('roleCheck');
	
	//debug('updating ' + checkboxes.length + ' checks');
	//debug('selected roles: ' + roleNames.join(', '));
	//Use array proto to foreach this collection
	Array.prototype.forEach.call(checkboxes, function(check) 
	{
	    //debug(check.dataset.role);
		if(roleNames.includes(check.dataset.role)){
	        //debug('checked=true');
			check.checked = true;
		}else{
	        //debug('checked=false');
			check.checked = false;
		}
	});
	
	//Load notes for this player
	document.getElementById('playerNotes').value = playersObj.players[playerId].notes;
	
	//Dead / vote / alignment
	let deadStatusEl = document.getElementById("deadStatusCheck");
	deadStatusEl.checked = !playersObj.players[playerId].living;
	let voteStatusEl = document.getElementById("voteStatusCheck");
	voteStatusEl.checked = !playersObj.players[playerId].deadVote;
	let alignmentEl = document.getElementById("alignmentSelect");
	alignmentEl.value = playersObj.players[playerId].alignment;
}

function closePlayerEditWindow()
{
	let addRoleWindowEl = document.getElementById('addRoleWindow');
	addRoleWindowEl.style.display = 'none';
	//Get current player ID
	let playerId = document.getElementById('playerId').innerHTML;
	//Store notes
	playersObj.players[playerId].notes = document.getElementById('playerNotes').value;
	//Store alignment
	playersObj.players[playerId].alignment = document.getElementById('alignmentSelect').value;
	//Store living status
	playersObj.players[playerId].living = !document.getElementById('deadStatusCheck').checked;
	//Store vote used
	playersObj.players[playerId].deadVote = !document.getElementById('voteStatusCheck').checked;
	//Show icon if notes available
	if(playersObj.players[playerId].notes.length > 0)
	{
		//Append a pencil icon to the player
		let roleBtn = document.getElementById("player" + playerId + "Roles");
		roleBtn.innerHTML = playersObj.players[playerId].roles.join(', ') + pencilIconUnicode;
	}
	saveToLocalStorage();

	//Trigger UI update
	//updateUi();
}

function updateDeathShroud(el)
{
	let playerId = document.getElementById('playerId').innerHTML;
	let deathShroudEl = document.getElementById("player" + playerId + "Shroud");
	//alternatively, show with border? - remember confusingly set playerId+1 for the player elements themselves!
	let playerEl = document.getElementById("player" + (parseInt(playerId) + 1));
	//console.log('PlayerEl:' + playerEl);
	//console.log('Updating death shroud for player ' + playerId + ' to ' + (el.checked ? 'dead' : 'alive'));
	//console.log(el);
	//Set on players object
	playersObj.players[playerId].living = !el.checked;
	if(el.checked)
	{
		playerEl.style.borderColor = "black";
		deathShroudEl.style.display = "block";
	}else
	{
		playerEl.style.borderColor = "white";
		deathShroudEl.style.display = "none";
	}
	updateCentralInfo();
}

function updateVoteStatus(el)
{
	let playerId = document.getElementById('playerId').innerHTML;
	playersObj.players[playerId].deadVote = !el.checked;
	updateCentralInfo();
}

function updateCentralInfo()
{
	//livingPlayersSpan
	let livingEl = document.getElementById('livingPlayersSpan');
	let livingCount = playersObj.players.filter((r) => {return (r.living == true)}).length;
	livingEl.innerHTML = livingCount;
	console.log('Living player count is now ' + livingCount);
	//votesSpan
	let voteEl = document.getElementById('votesSpan');
	let voteCount = playersObj.players.filter((r) => {return (r.living || r.deadVote == true)}).length;
	voteEl.innerHTML = voteCount;
}

function setPlayerCount(input){
	playerCount = input.value;
	document.getElementById("playerCountSpan").innerHTML = playerCount;
	//init(playerCount);
	setupPlayersArray(playerCount);
	setup();
	//createPlayerTokens(document.getElementById('main'));
}

function setPlayerName(input)
{
	let elId = input.parentElement.id;
	let playerId = elId.replace('player', '');
	let newName = input.value;
	//console.log(elId + " => " + newName);
	playersObj.players[playerId - 1].name = newName;
	saveToLocalStorage();
}

async function setScript(el)
{
	//console.log(el.value);
	await getScriptRoles(el.value);
	createRolesWindow();
	playersObj.settings.script = el.value;
}

//Obscure all player roles
function unhidePlayerRoles()
{
	let roleBtns = document.getElementsByClassName('addBtn');
	Array.prototype.forEach.call(roleBtns, function(btn) 
	{
		let playerId = btn.parentElement.dataset.player;
		let playerRoles = playersObj.players[playerId].roles;
		//If no roles set for this player
		if(playersObj.players[playerId].roles.length == 0)
		{
			btn.innerHTML = "Edit";
		}
		else
		{
			btn.innerHTML = playerRoles.join(', ');
		}
		//If there are notes
		if(playersObj.players[playerId].notes.length > 0)
		{
			//Append a pencil icon to the player roles
			btn.innerHTML += pencilIconUnicode;
		}
		if(playersObj.players[playerId].alignment == 'evil'){
			btn.parentElement.classList.add('evil');
			btn.parentElement.classList.remove('good');
			//btn.parentElement.style.borderColor = 'red';
		}else{
			//btn.parentElement.style.borderColor = 'green';
			btn.parentElement.classList.add('good');
			btn.parentElement.classList.remove('evil');
		}
	});
}

//Hide player roles from view (prevent other players from peeking)
function hidePlayerRoles()
{
	let roleBtns = document.getElementsByClassName('addBtn');
	Array.prototype.forEach.call(roleBtns, function(btn) 
	{
		btn.innerHTML = "<em>HIDDEN</em>";
		//btn.parentElement.style.borderColor = 'white';
		btn.parentElement.classList.remove('evil');
		btn.parentElement.classList.remove('good');
	});
}

function showHidePlayerRoles()
{
	//Negate the showPlayerRoles variable (default: true)
	showPlayerRoles = !showPlayerRoles;
	//console.log('Player roles are now ' + (showPlayerRoles ? 'shown' : 'hidden'));
	let showHideBtn = document.getElementById('showHideRolesBtn');
	//Are we NOW showing player roles?
	if(!showPlayerRoles)
	{
		//Yes - hide them
		hidePlayerRoles();
		showHideBtn.innerHTML = "Show Roles";
	}
	else
	{
		//No - unhide them
		unhidePlayerRoles();
		showHideBtn.innerHTML = "Hide Roles";
	}
}



function debug(txt){
    document.getElementById('debugWindow').innerHTML += txt + '<br/>';
}


function clearSavedData()
{
	if(!hasSavedData())
	{
		alert('No saved data to clear!');
		return;
	}
	if(window.confirm('Really clear saved data?')){
		localStorage.clear('players');
	}
}

async function loadSavedData()
{
	if(!hasSavedData())
	{
		alert('No saved data to load!');
		return;
	}
	if(window.confirm('Load stored data? This will clear your current data'))
	{
		//Loads into playersObj
		await loadFromLocalStorage();
		//Set script 
		if(playersObj.settings.script.length > 0){
			script = playersObj.settings.script;
		}else{
			script = 'tb';
		}
		//await getScriptRoles(script);
		//Initialize elements (await as async functions called)
		await init();
		//Enable clearing data (now loaded)
		document.getElementById('clearSavedBtn').disabled = false;
		//Set the player count input to the loaded player count
		document.getElementById('playerCountInput').value = playersObj.players.length;
		document.getElementById("playerCountSpan").innerHTML = playerCount;
		//Set the script to the loaded script name (shortname)
		document.getElementById('scriptInput').value = playersObj.settings.script;
		//Create the player info window
		//createRolesWindow();
		//setup();
		//updateCentralInfo();
		updateUi();
	}
}

function updateUi()
{
	//Update central area 
	updateCentralInfo();
	
	//Update player tokens 
	createPlayerTokens();
	
	//Update player info window 
	createRolesWindow();
	
	//Update interface
	//updateMenus();
	
	//Hide roles if selected
	if(!showPlayerRoles)
	{
		hidePlayerRoles();
	}
}

function solve()
{
	let worlds = [];
	//Check role counts match
	//Work back from the default world counts 
	
}

function showSetupWindow(){
	document.getElementById('setupWindow').style.display = 'block';
	//Fill in custom script roles
	setCustomScriptSelection();
}
function hideSetupWindow(){
	document.getElementById('setupWindow').style.display = 'none';
}

async function setCustomScriptSelection()
{
	let allRoles = await fetch('./roles.json');
	allRoles = await allRoles.json();
	allRoles.sort((a, b) => {return a.name > b.name;});

	let availEl = document.getElementById('availableRolesDiv');
	//Clear between runs
	availEl.innerHTML = '<h2>Available Roles</h2>';

	let selectedEl = document.getElementById('selectedRolesDiv');
	//selectedEl.innerHTML = '<h2>SelectedRoles</h2>';

	allRoles.forEach((r) => {
		//console.log(r.name);
		let roleOption = document.createElement('div');
		roleOption.className = 'customRoleOption';
		let customRoleCheck = document.createElement('input');
		customRoleCheck.type = 'checkbox';
		customRoleCheck.dataset.role = r.name;
		customRoleCheck.className = 'customRoleCheck';
		roleOption.appendChild(customRoleCheck);
		let customRoleSpan = document.createElement('span');
		customRoleSpan.innerHTML = r.name;
		roleOption.appendChild(customRoleSpan);
		availEl.appendChild(roleOption);
	});
}

function addSelectedRoles()
{
	let selectedEl = document.getElementById('selectedRolesDiv');
	let roleNames = document.getElementsByClassName('customRoleCheck');
	//console.log(roleNames);
	//roleNames.forEach((r) => {
	for(let i = 0; i < roleNames.length; i++)
	{
		let r = roleNames[i];
		if(r.checked)
		{
			//Add this role to selected
			let roleOption = document.createElement('div');
			roleOption.className = 'selectedRoleOption';
			let customRoleCheck = document.createElement('input');
			customRoleCheck.type = 'checkbox';
			customRoleCheck.className = 'customRoleCheck';
			roleOption.appendChild(customRoleCheck);
			let customRoleSpan = document.createElement('span');
			customRoleSpan.innerHTML = r.dataset.role;
			roleOption.appendChild(customRoleSpan);
			selectedEl.appendChild(roleOption);
			//Remove role from available
			let availEls = document.getElementsByClassName('customRoleOption');
			for(let j = 0; j < availEls.length; j++)
			{
				let currentAvail = availEls[j];
				//console.log('CURRENT AVAIL:',currentAvail);
				if(currentAvail.children[0].dataset.role == r.dataset.role){
					document.getElementById('availableRolesDiv').removeChild(currentAvail);
					//console.log('Removed:', currentAvail.children[0].dataset.role);
					break;
				}
			}
			//Move index back by one (list has changed due to element removal!)
			i--;
		}
	}
}

async function saveCustomScript()
{
	//Now apply the selected roles to filter the script
	let selectedEls = document.getElementsByClassName('selectedRoleOption');
	let selectedRoleNames = [];
	if(selectedEls.length > 0)
	{
		let allRoles = await fetch('./roles.json');
		allRoles = await allRoles.json();
		for(let i = 0; i < selectedEls.length; i++){
			let selectedEl = selectedEls[i];
			selectedRoleNames.push(selectedEl.children[1].innerHTML);
		}
		console.log('ROLE NAMES:',selectedRoleNames);
		scriptRoles = allRoles.filter((r) => { return selectedRoleNames.includes(r.name)});
		console.log('SELECTED SCRIPT ROLES:', scriptRoles);
		//Recreate the roles window
		createRolesWindow();
	}//else, no selected roles - do not overwrite?
}


class NoteManager
{
	constructor()
	{
		//Check for saved state
		if(this.hasData()){
			this.loadState();
		}else{
			this.setDefaultState();
		}
	}
	
	setDefaultState()
	{
		//Settings
		this.script = "tb";
		this.scriptRoles = [];
		this.playersObj = {
			settings: {},
			players: []
		}
		this.addRoleBtnText = "Edit";
		this.pencilIconUnicode = "&#9998;";
		this.roleCounts = [
			undefined, //1
			undefined, //2
			undefined, //3
			undefined, //4
			{ //5
				townsfolk: 3,
				outsider: 0,
				minion: 1,
				demon: 1
			},
			{ //6
				townsfolk: 3,
				outsider: 1,
				minion: 1,
				demon: 1
			},
			{ //7
				townsfolk: 5,
				outsider: 0,
				minion: 1,
				demon: 1
			},
			{ //8
				townsfolk: 5,
				outsider: 1,
				minion: 1,
				demon: 1
			},
			{ //9
				townsfolk: 5,
				outsider: 2,
				minion: 1,
				demon: 1
			},
			{ //10
				townsfolk: 7,
				outsider: 0,
				minion: 2,
				demon: 1
			},
			{ //11
				townsfolk: 7,
				outsider: 1,
				minion: 2,
				demon: 1
			},
			{ //12
				townsfolk: 7,
				outsider: 2,
				minion: 2,
				demon: 1
			},
			{ //13
				townsfolk: 9,
				outsider: 0,
				minion: 3,
				demon: 1
			},
			{ //14
				townsfolk: 9,
				outsider: 1,
				minion: 3,
				demon: 1
			},
			{ //15
				townsfolk: 9,
				outsider: 2,
				minion: 3,
				demon: 1
			}
		];
	}
	
	//Setup elements (by playerCount)
	setup(pCount)
	{
		
	}
	//Save data 
	save()
	{
		//Save to local storage
		
	}
	//Load data
	load()
	{
		//Load from local storage
		
	}
	hasData(){
		//Bool test
		return localStorage.getItem("players");
	}
}

// Source - https://stackoverflow.com/a
// Posted by Greg Dean, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-23, License - CC BY-SA 4.0
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}