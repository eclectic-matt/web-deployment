console.log("Notes initialized");

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
	//Create player elements
	for (let i = 0; i < playerCount; i++)
	{
		let el = document.createElement('div');
		el.style.position = "absolute";
		el.style.top = (10 * i) + (0.1 * h);
		el.style.left = 10 * i;
		el.className = "player";
		el.id = "player" + (i + 1);
		el.dataset.playerId = i;
		let addBtn = document.createElement('button');
		addBtn.innerHTML = addRoleBtnText;
		addBtn.className = "addBtn";
		addBtn.onclick = () => changeRole(addBtn);
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
}

function createRolesWindow()
{
	//Fill addRoleWindow
	let addRoleWindowEl = document.getElementById('addRoleWindow');
	addRoleWindowEl.innerHTML = null;
	//-head
	let rolesHeader = document.createElement('h3');
	rolesHeader.innerHTML = "Add role(s) for <span id='playerName'></span> <span id='playerId' class='hidden'></span>";
	addRoleWindowEl.appendChild(rolesHeader);
	//-list
	let addRoleList = document.createElement('ul');
	for (let i = 0; i < scriptRoles.length; i++)
	{
		let roleLi = document.createElement('li');
		//checkbox
		let roleCheck = document.createElement('input');
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
	//-closeBtn
	let closeAddRoleBtn = document.createElement('button');
	closeAddRoleBtn.innerHTML = "X";
	closeAddRoleBtn.onclick = () => hideChangeRole();
	addRoleWindowEl.appendChild(closeAddRoleBtn);
}

function addRole(el)
{
	let playerId = document.getElementById('playerId').innerHTML;
	//let playerId = el.dataset.playerId;
	let roleName = el.dataset.role;
	console.log(playerId, roleName);
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

function changeRole(el)
{
	console.log(el.parentElement.id);
	let addRoleWindowEl2 = document.getElementById('addRoleWindow');
	addRoleWindowEl2.style.display = 'block';
	document.getElementById('playerName').innerHTML = el.parentElement.id;
	document.getElementById('playerId').innerHTML = el.parentElement.dataset.playerId;
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