//update 2025-11-16 19:46:00
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
	//Return all roles
	if(selectedScriptShortName == "all")
	{
		scriptRoles = scriptRoles.map((r) => {return r.name});
		scriptRoles.sort();
		return scriptRoles;
	}
	//Filter to edition
	scriptRoles = scriptRoles.filter((r) => {return r.edition == selectedScriptShortName}).map((r) => {return r.name});
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
				name: "player" + i,
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
	localStorage.setItem("players", JSON.stringify(playersObj));
}

function loadFromLocalStorage()
{
	playersObj = JSON.parse(localStorage.getItem("players"));
}

function hasSavedData()
{
	//Bool test
	return localStorage.getItem("players");
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
	let orientation = 1;
	let radius = h/3;
	let longestSide = h;
	let shortestSide = h;
	if(w > h)
	{
		//Landscape mode
		orientation = 1;
		radius = w / 4;
		longestSide = w;
		shortestSide = h;
	}
	else
	{
		//Portrait mode
		orientation = 2;
		radius = h / 4;
		longestSide = h;
		shortestSide = w;
	}
	//Radius is the distance from centre
	radius = shortestSide / 3 + (playerCount);
	
	//Calculate fixed values
	let cx = 0.5 * w;
	let cy = 0.6 * h;
	let eclipseWidth = w / 2;
	let eclipseHeight = h / 2;
	
	//Create player elements
	for (let i = 0; i < playerCount; i++)
	{
		let el = document.createElement('div');
		el.style.position = "absolute";
		el.style.width = Math.floor((1.5*shortestSide)/playerCount) + 'px';
		el.style.height = Math.floor((1.5*shortestSide)/playerCount) + 'px';
		//Calculate position for each token
		//- angle is 2PI split into playerCount sections, rotated along by PI/2 (due east is 0deg, want due south)
		let angle = i * (2 * Math.PI / playerCount) + (Math.PI / 2);
		//- radius needs to adjust for the screen size (between min + max)
		//let radius = h/3;
		//- x position (relative to centre in top left of screen)
		//let x = Math.round(radius * (Math.cos(angle)));
		/*let x, y, top, left;
		if(longestSide == h)
		{
			debug('portrait');
			//Portrait
			x = Math.round(shortestSide * Math.cos(angle));
			y = Math.round(longestSide * Math.sin(angle));
			left = Math.round(x + (w/2)) + 'px';
			top = Math.round(y + (h/2)) + 'px';
		}
		else
		{
			debug('landscape');
			//Landscape
			x = Math.round(longestSide * Math.cos(angle));
			y = Math.round(shortestSide * Math.sin(angle));
			left = Math.round(x + (w/2)) + 'px';
			top = Math.round(y + (h/2)) + 'px';
		}
		
		//left = x + 'px';
		//top = y + 'px';
		*/
		let point = getPointInEclipse(cx, cy, eclipseWidth, eclipseHeight, angle);
		let x = point.x;
		let y = point.y;
		let left = x + 'px';
		let top = y + 'px';
		
		debug(i + ' => ' + x + ', ' + y + ' => ' + left + ', ' + top);
		//- left position (adjust to be in centre of screen)
		//let left = (x + (w/3) + (20 - playerCount)) + 'px';
		// - y position (relative to centre in top left of screen)
		//let y = Math.round(radius * (Math.sin(angle)));
		//let top = (y + (h/2)) + 'px';
		//el.style.top = (10 * i) + (0.1 * h);
		//el.style.left = 10 * i;
		el.style.top = top;
		el.style.left = left;
		//console.log(i, angle, x, y);
		el.className = "player";
		el.id = "player" + (i + 1);
		el.dataset.player = i;
		//Death shroud?
		let deathShroud = document.createElement('div');
		deathShroud.id = "player" + i + "Shroud";
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
		if(playersObj.players[i] && !playersObj.players[i].living)
		{
			deathShroud.style.display = 'block';
		}else{
			deathShroud.style.display = 'none';
		}
		if(playersObj.players[i] && playersObj.players[i].voteUsed)
		{
			deathShroud.innerHTML += ' (no vote)';
		}
		deathShroud.style.zIndex = 100;
		el.appendChild(deathShroud);
		let addBtn = document.createElement('button');
		if(playersObj.players[i] && playersObj.players[i].roles.length > 0){
			addBtn.innerHTML = playersObj.players[i].roles.join(', ');
		}else{
			addBtn.innerHTML = addRoleBtnText;
		}
		if(playersObj.players[i] && playersObj.players[i].notes.length > 0){
			addBtn.innerHTML += pencilIconUnicode;
		}
		addBtn.style.marginTop = '5%';
		addBtn.style.fontSize = Math.floor(longestSide / 100) + 'px';
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
			nameInput.value = "player" + (i + 1);
		}
		nameInput.className = "nameInput";
		el.appendChild(nameInput);
		main.appendChild(el);
	}
	
	//Add role counts element
	let central = document.createElement('div');
	central.id = 'central';
	central.style.position = 'absolute';
	central.style.top = ((h/2) + 30) + 'px';
	central.style.left = ((w/4) + 30) + 'px';
	central.style.width = ((w/4) + 50) + 'px';
	central.style.height = 'auto';
	central.style.fontSize = '0.75rem';
	central.style.border = '1px solid black';
	central.innerHTML = roleCounts[playerCount] + '<br>Alive: <span id="livingPlayersSpan">' + playerCount + '</span> - Votes: <span id="votesSpan">' + playerCount + '</span>';
	main.appendChild(central);
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
	rolesHeader.innerHTML = "Change Info for <span id='playerName'></span> <span id='playerId' class='hidden'></span>";
	//-closeBtn (in header)
	let closeAddRoleBtn = document.createElement('button');
	closeAddRoleBtn.innerHTML = "X";
	closeAddRoleBtn.onclick = () => closePlayerEditWindow();
	rolesHeader.appendChild(closeAddRoleBtn);
	addRoleWindowEl.appendChild(rolesHeader);
	
	//-list status variables
	let statusHeader = document.createElement('h4');
	statusHeader.innerHTML = "Player Status";
	addRoleWindowEl.appendChild(statusHeader);
	let playerStatusList = document.createElement('ul');
	playerStatusList.className = 'statusList';
	// - dead?
	let deadStatusLi = document.createElement('li');
	let deadStatusCheck = document.createElement('input');
	deadStatusCheck.id = "deadStatusCheck";
	deadStatusCheck.type = 'checkbox';
	deadStatusCheck.dataset.type = 'dead';
	deadStatusCheck.onchange = () => updateDeathShroud(deadStatusCheck);
	deadStatusLi.appendChild(deadStatusCheck);
	let deadStatusLabel = document.createElement('label');
	deadStatusLabel.innerHTML = 'Dead?';
	deadStatusLi.appendChild(deadStatusLabel);
	playerStatusList.appendChild(deadStatusLi);
	// - vote used?
	let voteStatusLi = document.createElement('li');
	let voteStatusCheck = document.createElement('input');
	voteStatusCheck.id = "voteStatusCheck";
	voteStatusCheck.type = 'checkbox';
	voteStatusCheck.dataset.type = 'vote';
	voteStatusCheck.onchange = () => updateVoteStatus(voteStatusCheck);
	voteStatusLi.appendChild(voteStatusCheck);
	let voteStatusLabel = document.createElement('label');
	voteStatusLabel.innerHTML = 'Vote Used?';
	voteStatusLi.appendChild(voteStatusLabel);
	playerStatusList.appendChild(voteStatusLi);
	// - mark as good/evil
	let alignmentLi = document.createElement('li');
	let alignmentLabel = document.createElement('label');
	alignmentLabel.innerHTML = 'Alignment: ';
	alignmentLi.appendChild(alignmentLabel);
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
	alignmentLi.appendChild(alignmentSelect);
	playerStatusList.appendChild(alignmentLi);

	//-finish player status list
	addRoleWindowEl.appendChild(playerStatusList);

	//-list roles as checkboxes
	let rolesListHeader = document.createElement('h4');
	rolesListHeader.innerHTML = "Player Role(s)";
	addRoleWindowEl.appendChild(rolesListHeader);

	let addRoleList = document.createElement('ul');
	for (let i = 0; i < scriptRoles.length; i++)
	{
		let roleLi = document.createElement('li');
		//checkbox
		let roleCheck = document.createElement('input');
		roleCheck.className = "roleCheck";
		roleCheck.type = "checkbox";
		//roleCheck.setAttribute('data', "playerId: '" + i + "', role: '" + scriptRoles[i] + "'");
		//roleCheck.dataset.player = i;
		roleCheck.dataset.role = scriptRoles[i];
		roleCheck.onchange = () => addRole(roleCheck);
		
		roleLi.appendChild(roleCheck);
		let roleName = document.createElement('span');
		roleName.innerHTML = scriptRoles[i];
		roleLi.appendChild(roleName);
		addRoleList.appendChild(roleLi);
		//console.log('add role ' + scriptRoles[i]);
	}
	addRoleWindowEl.appendChild(addRoleList);
	// - status (dead/vote used/evil?)
	
	// - notes
	let noteElHead = document.createElement('h4');
	noteElHead.innerHTML = "Player Notes";
	addRoleWindowEl.appendChild(noteElHead);
	let noteEl = document.createElement('textarea');
	noteEl.id = 'playerNotes';
	noteEl.style.width = '80%';
	noteEl.style.height = '10%';
	addRoleWindowEl.appendChild(noteEl);
	
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
	//debug('Current player notes: "' + document.getElementById('playerNotes').value + '"');
	//Show icon if notes available
	if(playersObj.players[playerId].notes.length > 0){
		//Append a pencil icon to the player
		let roleBtn = document.getElementById("player" + playerId + "Roles");
		roleBtn.innerHTML = playersObj.players[playerId].roles.join(', ') + pencilIconUnicode;
	}
	saveToLocalStorage();
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
		playerEl.style.borderColor = "red";
		deathShroudEl.style.display = "block";
	}else
	{
		playerEl.style.borderColor = "black";
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
	});
}

//Hide player roles from view (prevent other players from peeking)
function hidePlayerRoles()
{
	let roleBtns = document.getElementsByClassName('addBtn');
	Array.prototype.forEach.call(roleBtns, function(btn) 
	{
		btn.innerHTML = "<em>HIDDEN</em>";
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
		//Set the script to the loaded script name (shortname)
		document.getElementById('scriptInput').value = playersObj.settings.script;
		//Create the player info window
		//createRolesWindow();
		//setup();
		updateCentralInfo();
	}
}

class NoteManager
{
	constructor()
	{
		//Settings
		this.playerCount = 5;
		this.script = "tb";
		this.scriptRoles = [];
		this.playersObj = {
			settings: {},
			players: []
		}
		this.addRoleBtnText = "Edit";
		this.pencilIconUnicode = "&#9998;";
		this.roleCounts = [
		    null, //0
		    null, //1
		    null, //2
		    null, //3
		    null, //4
		    {
		    	t: 3,
		    	o: 0,
		    	m: 1,
		    	d: 1,
		    	tr: 0
		    }, //5
		    {
		    	t: 3,
		    	o: 1,
		    	m: 1,
		    	d: 1,
		    	tr: 0
		    }, //6
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
	}
	//First time initialization
	init()
	{
		
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
}