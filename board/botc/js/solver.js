const setupModification = [
	{
		title: "Atheist",
		character: "Atheist",
		outsiderModification: null,
		minionModification: null,
		demonModification: null,
		effect: "No evil characters"
	},
	{
		title: "Baron",
		character: "Baron",
		outsiderModification: 2,
		minionModification: null,
		demonModification: null,
		effect: "Added 2 outsiders"
	},
	{
		title: "Ballonist+0",
		character: "Balloonist",
		outsiderModification: null,
		minionModification: null,
		demonModification: null,
		effect: "Did not add an outsider"
	},
	{
		title: "Balloonist+1",
		character: "Balloonist",
		outsiderModification: 1,
		minionModification: null,
		demonModification: null,
		effect: "Added an outsider"
	},
	{
		title: "BountyHunter",
		character: "Bounty Hunter",
		outsiderModification: null,
		minionModification: null,
		demonModification: null,
		effect: "1 townsfolk is evil"
	},
	{
		title: "ChoirBoy",
		character: "Choir Boy",
		outsiderModification: null,
		minionModification: null,
		demonModification: null,
		effect: "Added the King"
	},
	{
		title: "FangGu",
		character: "Fang Gu",
		outsiderModification: 1,
		minionModification: null,
		demonModification: null,
		effect: "Added 1 outsider"
	},
	{
		title: "Godfather-1",
		character: "Godfather",
		outsiderModification: -1,
		minionModification: null,
		demonModification: null,
		effect: "Removed 1 outsider"
	},
	{
		title: "Godfather+1",
		character: "Godfather",
		outsiderModification: 1,
		minionModification: null,
		demonModification: null,
		effect: "Added 1 outsider"
	},
	{
		title: "Hermit-0",
		character: "Hermit",
		outsiderModification: 0,
		minionModification: null,
		demonModification: null,
		effect: "Removed 0 outsiders"
	},
	{
		title: "Hermit-1",
		character: "Hermit",
		outsiderModification: -1,
		minionModification: null,
		demonModification: null,
		effect: "Removed 1 outsider"
	},
	{
		title: "HuntsmanNoDamsel",
		character: "Huntsman",
		outsiderModification: 1,
		minionModification: null,
		demonModification: null,
		effect: "Added the Damsel"
	},
	{
		title: "HuntsmanWithDamsel",
		character: "Huntsman",
		outsiderModification: 0,
		minionModification: null,
		demonModification: null,
		effect: "Damsel already present"
	},
	{
		title: "Kazali-2",
		character: "Kazali",
		outsiderModification: -2,
		minionModification: null,
		demonModification: null,
		effect: "Removed 2 outsiders"
	},
	{
		title: "Kazali-1",
		character: "Kazali",
		outsiderModification: -1,
		minionModification: null,
		demonModification: null,
		effect: "Removed 1 outsider"
	},
	{
		title: "Kazali-0",
		character: "Kazali",
		outsiderModification: null,
		minionModification: null,
		demonModification: null,
		effect: "Removed 0 outsiders"
	},
	{
		title: "Kazali+1",
		character: "Kazali",
		outsiderModification: 1,
		minionModification: null,
		demonModification: null,
		effect: "Added 1 outsider"
	},
	{
		title: "Kazali+2",
		character: "Kazali",
		outsiderModification: 2,
		minionModification: null,
		demonModification: null,
		effect: "Added 2 outsiders"
	},
	{
		title: "Legion",
		character: "Legion",
		outsiderModification: null,
		minionModification: 2,
		demonModification: null,
		effect: "Most players are Legion"
	},
	{
		title: "LordOfTyphon-2",
		character: "Lord of Typhon",
		outsiderModification: -2,
		minionModification: 1,
		demonModification: null,
		effect: "Removed 2 outsiders"
	},
	{
		title: "LordOfTyphon-1",
		character: "Lord of Typhon",
		outsiderModification: -1,
		minionModification: 1,
		demonModification: null,
		effect: "Removed 1 outsider"
	},
	{
		title: "LordOfTyphon-0",
		character: "Lord of Typhon",
		outsiderModification: null,
		minionModification: 1,
		demonModification: null,
		effect: "Removed 0 outsiders"
	},
	{
		title: "LordOfTyphon+1",
		character: "Lord of Typhon",
		outsiderModification: 1,
		minionModification: 1,
		demonModification: null,
		effect: "Added 1 outsider"
	},
	{
		title: "LordOfTyphon+2",
		character: "Lord of Typhon",
		outsiderModification: 2,
		minionModification: 1,
		demonModification: null,
		effect: "Added 2 outsiders"
	},
	{
		title: "Marionette",
		character: "Marionette",
		outsiderModification: null,
		minionModification: null,
		demonModification: null,
		effect: "Neighbours the Demon"
	},
	{
		title: "Summoner",
		character: "Summoner",
		outsiderModification: null,
		minionModification: null,
		demonModification: -1,
		effect: "No Demon"
	},
	{
		title: "Vigormortis",
		character: "Vigormortis",
		outsiderModification: -1,
		minionModification: null,
		demonModification: null,
		effect: "Removed 1 outsider"
	},
	{
		title: "VillageIdiot",
		character: "VillageIdiot",
		outsiderModification: null,
		minionModification: null,
		demonModification: null,
		effect: "+0 to +2 Village Idiots. 1 of the extras is drunk"
	},
	{
		title: "Xaan-3",
		character: "Xaan",
		outsiderModification: -3,
		minionModification: null,
		demonModification: null,
		effect: "Removed 3 outsiders"
	},
	{
		title: "Xaan-2",
		character: "Xaan",
		outsiderModification: -2,
		minionModification: null,
		demonModification: null,
		effect: "Removed 2 outsiders"
	},
	{
		title: "Xaan-1",
		character: "Xaan",
		outsiderModification: -1,
		minionModification: null,
		demonModification: null,
		effect: "Removed 1 outsider"
	},
	{
		title: "Xaan-0",
		character: "Xaan",
		outsiderModification: null,
		minionModification: null,
		demonModification: null,
		effect: "Removed 0 outsiders"
	},
	{
		title: "Xaan+1",
		character: "Xaan",
		outsiderModification: 1,
		minionModification: null,
		demonModification: null,
		effect: "Added 1 outsider"
	},
	{
		title: "Xaan+2",
		character: "Xaan",
		outsiderModification: 2,
		minionModification: null,
		demonModification: null,
		effect: "Added 2 outsiders"
	},
	{
		title: "Xaan+3",
		character: "Xaan",
		outsiderModification: 3,
		minionModification: null,
		demonModification: null,
		effect: "Added 3 outsiders"
	}
];

const playerCounts = [
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


async function solve()
{
	//Check role counts match

	let selectedRoles = [
		"Baron",
		"Imp",
		"Slayer",
		"Fortune Teller",
		"Vigormortis"
	];

	let randCharIndex = 1;
	for(let i = 0; i < 10; i++){
		
		randCharIndex = 1;
		while(selectedRoles.includes(setupModification[randCharIndex].character))
		{
			randCharIndex = Math.floor(Math.random() * setupModification.length);
		}
		selectedRoles.push(setupModification[randCharIndex].character);
	}

	scriptRoles = await fetch('./roles.json');
	scriptRoles = await scriptRoles.json();

	let scriptName = "tb";
	scriptRoles = scriptRoles.filter((r) => { return r.edition == scriptName});

	//Work back from the default world counts 
	let worlds = solveOutsiderCount(selectedRoles, scriptRoles.map((r) => {return r.name}));
	console.log(worlds);
	for(let worldId in worlds){
		let world = worlds[worldId];
		console.log("We have a world with " + world.outsiderCount + " outsiders due to " + world.title + " which " + world.effect.toLowerCase());
	}
	
}

function solveOutsiderCount(selectedRoles, scriptRoles)
{
	console.log(selectedRoles);
	let outsiderWorlds = [];
	let outsiderCount = playerCounts[selectedRoles.length - 1].outsider;
	outsiderWorlds.push({title:"the default setup",effect:"made no changes",outsiderCount:outsiderCount});
	
	for(let roleId in selectedRoles)
	//for(let roleId in scriptRoles)
	{
		let role = selectedRoles[roleId];
		let setupEffects = getSetupMod(role);
		//console.log("Checking role: " + role + " with effects: " + setupEffects.length);
		for(let effect in setupEffects)
		{
			effect = setupEffects[effect];
			//Create world for each effect
			let worldOutsiderCount = outsiderCount + effect.outsiderModification;
			outsiderWorlds.push({title:effect.title,effect:effect.effect,outsiderCount:worldOutsiderCount});
		}
	}
	return outsiderWorlds;
}

function getSetupMod(charName){
	let effects = [];
	for(let effect in setupModification){
		effect = setupModification[effect];
		if(effect.character == charName){
			effects.push(effect);
		}
	}
	return effects;
}

function getRolesOnCurrentScript()
{

}


//Run
solve();