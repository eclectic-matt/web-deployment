//update 2025-11-11 09:18:00
debug("Notes initialized");

//Default to 5p, set in menu
var playerCount = 5;
var script = "tb";
//Store names separately to reuse
var playerNames = [];
//Names of roles on the current script
var scriptRoles = [];

//Defined constants
const addRoleBtnText = "Add Role"; //"+";
/*
const playersExample = [
	{
		name: 'Matt',
		seat: 1,
		roles: ['Virgin', 'Slayer'],
		living: true,
		deadVote: true,
		notes: ''
	}
];
*/

var playersObj = {
	settings: {},
	players: []
}

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
	setup(playerCount, scriptRoles);
	createPlayersObject();
}

async function getScriptRoles(selectedScriptShortName)
{
	scriptRoles = await fetch('./roles.json');
	scriptRoles = await scriptRoles.json();
	scriptRoles = scriptRoles.filter((r) => {return r.edition == selectedScriptShortName}).map((r) => {return r.name});
	//console.log('Role count: ' + scriptRoles.length);
	//console.log(scriptRoles);
	return scriptRoles;
}

function createPlayersObject()
{
	playersObj = {
		settings: {},
		players: []
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
			playersObj.players[i] = {
				name: "player" + (i+1),
				seat: 1,
				roles: [],
				living: true,
				deadVote: true,
				notes: ''
			};
		}
	}
	else
	{
		//Remove players from array
		playersObj.players = playersObj.players.splice(pCount);
	}
}

function setup(playerCount, scriptRoles)
{
	//Get reference to main
	let main = document.getElementById("main");
	//Clear main
	main.innerHTML = null;
	
	//Calculate screen dimensions 
	let [w, h, r] = calcScreenDimensions();
	//console.log("Window Width: " + w + ", Window Height: " + h)
	createPlayerTokens(main);
	createRolesWindow();
}

function createPlayerTokens(main)
{
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
		//Desktop mode
		orientation = 2;
		radius = h / 4;
		longestSide = h;
		shortestSide = w;
	}
	//Radius is the distance from centre
	radius = shortestSide / 3 + (playerCount);

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
		let x = Math.round(radius * (Math.cos(angle)));
		//- left position (adjust to be in centre of screen)
		let left = (x + (w/3) + 25) + 'px';
		// - y position (relative to centre in top left of screen)
		let y = Math.round(radius * (Math.sin(angle)));
		let top = (y + (h/2)) + 'px';
		//el.style.top = (10 * i) + (0.1 * h);
		//el.style.left = 10 * i;
		el.style.top = top;
		el.style.left = left;
		console.log(i, angle, x, y);
		el.className = "player";
		el.id = "player" + (i + 1);
		el.dataset.playerId = i;
		let addBtn = document.createElement('button');
		addBtn.innerHTML = addRoleBtnText;
		addBtn.style.fontSize = Math.floor(longestSide / 50) + 'px';
		addBtn.className = "addBtn";
		addBtn.onclick = () => editPlayerInfo(addBtn);
		addBtn.id = "player" + i + "Roles";
		el.appendChild(addBtn);
		let nameInput = document.createElement('input');
		nameInput.onchange = () => setPlayerName(nameInput);
		nameInput.type = "text";
		if (playerNames[i]) {
			nameInput.value = playerNames[i];
		} else {
			nameInput.value = "player" + (i + 1);
		}
		nameInput.className = "nameInput";
		el.appendChild(nameInput);
		main.appendChild(el);
	}
	
	//Add role counts element
	let central = document.createElement('div');
	central.style.position = 'absolute';
	central.style.top = ((h/2) + 20) + 'px';
	central.style.left = (w/3) + 'px';
	central.style.width = (w/4) + 'px';
	central.style.height = 'auto';
	central.style.fontSize = '0.5rem';
	central.style.border = '1px solid black';
	central.innerHTML = roleCounts[playerCount] + '<br>Alive: <span id="livingPlayersSpan">' + playerCount + '</span> - Votes: <span id="votesSpan">' + playerCount + '</span>';
	main.appendChild(central);
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
	rolesHeader.innerHTML = "Add role(s) for <span id='playerName'></span> <span id='playerId' class='hidden'></span>";
	//-closeBtn (in header)
	let closeAddRoleBtn = document.createElement('button');
	closeAddRoleBtn.innerHTML = "X";
	closeAddRoleBtn.onclick = () => hideChangeRole();
	rolesHeader.appendChild(closeAddRoleBtn);
	addRoleWindowEl.appendChild(rolesHeader);
	//-list
	let addRoleList = document.createElement('ul');
	for (let i = 0; i < scriptRoles.length; i++)
	{
		let roleLi = document.createElement('li');
		//checkbox
		let roleCheck = document.createElement('input');
		roleCheck.className = "roleCheck";
		roleCheck.type = "checkbox";
		//roleCheck.setAttribute('data', "playerId: '" + i + "', role: '" + scriptRoles[i] + "'");
		//roleCheck.dataset.playerId = i;
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
	//let playerId = el.dataset.playerId;
	let roleName = el.dataset.role;
	console.log(playerId, roleName);
	if(el.checked){
    	playersObj.players[playerId].roles.push(roleName);
	}else{
	   playersObj.players[playerId].roles = playersObj.players[playerId].roles.filter((r) => r !== roleName);

	}
	debug('role added for player ' + playerId + ':' + roleName);
	debug('player roles now: ' + playersObj.players[playerId].roles.join(', '));
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

function editPlayerInfo(el)
{
	//Show the info window
	let addRoleWindowEl2 = document.getElementById('addRoleWindow');
	addRoleWindowEl2.style.display = 'block';
	
	//Set the player name on the window header
	document.getElementById('playerName').innerHTML = el.parentElement.id;
	//Set the (hidden) playerId element
	document.getElementById('playerId').innerHTML = el.parentElement.dataset.playerId;
	
	//Populate notes and checkboxes
	let roleNames = playersObj.players[playerId].roles;
	
	//Get the checkbox elements (HTML collection)
	let checkboxes = document.getElementsByClassName('roleCheck');
	
	//debug('updating ' + checkboxes.length + ' checks');
	debug('selected roles: ' + roleNames.join(', '));
	//Use array proto to foreach this collection
	Array.prototype.forEach.call(checkboxes, function(check) {
	//for(let check of checkboxes)
	//checkboxes.forEach((check) => 
	{
	    debug(check.dataset.role);
	    if(roleNames.includes(check.innerHTML)){
	        debug('checked=true');
	        check.checked = true;
	    }else{
	        debug('checked=false');
	        check.checked = false;
	    }
	});
	
	document.getElementById('playerNotes').innerHTML = playersObj.players[playerId].notes;
}

function hideChangeRole()
{
	let addRoleWindowEl = document.getElementById('addRoleWindow');
	addRoleWindowEl.style.display = 'none';
}

function setPlayerCount(input){
	playerCount = input.value;
	document.getElementById("playerCountSpan").innerHTML = playerCount;
	//init(playerCount);
	setup(playerCount, scriptRoles);
	setupPlayersArray(playerCount);
}

function setPlayerName(input)
{
	let elId = input.parentElement.id;
	let playerId = elId.replace('player', '');
	let newName = input.value;
	console.log(elId + " => " + newName);
	playerNames[playerId - 1] = newName;
}

async function setScript(el)
{
	console.log(el.value);
	await getScriptRoles(el.value);
	createRolesWindow();
}

function debug(txt){
    document.getElementById('debugWindow').innerHTML += txt + '<br/>';
}