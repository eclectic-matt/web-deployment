class Storyteller 
{
	
	playerCounts = [
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
		//11 - 7 1 2 1
		//12 - 7 2 2 1
		//13 - 9 0 3 1
		//14 - 9 1 3 1
		//15 - 9 2 3 1
	]

	constructor(script, playerCount, names = [])
	{
		switch(script)
		{
			case 'tb': 
				this.script = this.loadTB();
			break;
			default:
				return 'Not yet supported';
			break;
		}
		//ASSIGN CHARACTERS (INCL. MODIFYING SETUP)
		this.assignRoles(playerCount);
		//ASSIGN NAMES (REAL INPUTS PLUS SOME GENERATED RANDOM NAMES)
		this.assignNames(names);
		//DEBUG OUTPUT
		console.log("roles\n",this.roles.map((role) => { return role.name + ' is the ' + role.role }).join("\n"));
	}

	loadScript(name){
		//this.script = 
	}

	loadTB()
	{
	
		this.script = {
		name: 'Trouble Brewing',
		roles: [
		{
			role: 'Imp',
			alignment: 'evil',
			type: 'demon',
			ability: {
				trigger: 'eachnight*',
				target: 'any',
				cause: 'death',
				special: {
					target: 'self',
					ability: 'minionBecomesDemon'
				}
			}
		},
		{
			role: 'Poisoner',
			alignment: 'evil',
			type: 'minion',
			ability: {
				trigger: 'eachnight',
				target: 'any',
				cause: 'droison',
				special: undefined
			}
		},
		{
			role: 'Baron',
			alignment: 'evil',
			type: 'minion',
			ability: {
				trigger: 'setup',
				target: undefined,
				cause: '+2outsiders',
				special: {
					type: 'townsfolk',
					modifiedType: 'outsider',
					count: 2
				}
			}
		},
		{
			role: 'Spy',
			alignment: 'evil',
			type: 'minion',
			ability: {
				trigger: 'registersFalse',
				target: undefined,
				cause: '+2outsiders',
				special: {
					type: 'townsfolk',
					modifiedType: 'outsider',
					count: 2
				}
			}
		},
		{
			role: 'Scarlet Woman',
			alignment: 'evil',
			type: 'minion',
			ability: {
				trigger: 'execute',
				target: undefined,
				cause: '+2outsiders',
				special: {
					type: 'townsfolk',
					modifiedType: 'outsider',
					count: 2
				}
			}
		},
		{
			role: 'Recluse',
			alignment: 'good',
			type: 'outsider',
			ability: {
				trigger: 'detect',
				target: undefined,
				cause: 'registerEvilMinionDemon',
				special: undefined
			}
		},
		{
			role: 'Drunk',
			alignment: 'good',
			type: 'outsider',
			ability: {
				trigger: 'thinks',
				target: undefined,
				cause: 'thinksTownsfolk',
				special: undefined
			}
		},
		{
			role: 'Saint',
			alignment: 'good',
			type: 'outsider',
			ability: {
				trigger: 'executed',
				target: 'self',
				cause: 'teamLoses',
				special: undefined
			}
		},
		{
			role: 'Butler',
			alignment: 'good',
			type: 'outsider',
			ability: {
				trigger: 'vote',
				target: undefined,
				cause: 'voteWithMaster',
				special: undefined
			}
		},
		{
			role: 'Washerwoman',
			alignment: 'good',
			type: 'townsfolk',
			ability: {
				trigger: 'firstnight',
				target: undefined,
				cause: 'learns',
				special: undefined
			}
		},
		{
			role: 'Slayer',
			alignment: 'good',
			type: 'townsfolk',
			ability: {
				trigger: 'public',
				target: 'any',
				cause: 'demonDies',
				special: undefined
			}
		},
		{
			role: 'Mayor',
			alignment: 'good',
			type: 'townsfolk',
			ability: {
				trigger: '3AliveNoExecution',
				target: undefined,
				cause: 'mayorTeamWins',
				special: undefined
			}
		},
		{
			role: 'Monk',
			alignment: 'good',
			type: 'townsfolk',
			ability: {
				trigger: 'eachnight*',
				target: 'anyNotSelf',
				cause: 'safeFromDemon',
				special: undefined
			}
		},
		{
			role: 'Soldier',
			alignment: 'good',
			type: 'townsfolk',
			ability: {
				trigger: 'demonAttack',
				target: undefined,
				cause: 'safeFromDemon',
				special: undefined
			}
		},
		{
			role: 'Librarian',
			alignment: 'good',
			type: 'townsfolk',
			ability: {
				trigger: 'eachnight*',
				target: 'anyNotSelf',
				cause: 'safeFromDemon',
				special: undefined
			}
		},
		{
			role: 'Investigator',
			alignment: 'good',
			type: 'townsfolk',
			ability: {
				trigger: 'eachnight*',
				target: 'anyNotSelf',
				cause: 'safeFromDemon',
				special: undefined
			}
		}
		]
		}
	
		//Shuffle roles 
		this.script.roles = this.shuffle(this.script.roles);
		//console.log('roles',this.script.roles);
		return this.script;
	}

	assignRoles(playerCount)
	{
		this.roles = [];
		let playersArr = this.getPlayersArray(playerCount);
		console.log('playersArr', playersArr);
		for(let i = 0; i < playerCount; i++){
			let thisType = playersArr[i];
			let role = this.getRole(thisType);
			this.roles.push(role);
		}

		console.log('rolesPreModify',playerCount, JSON.parse(JSON.stringify(this.roles)));
		// console.log('roles',this.roles.map((role) => { return role.role }).join(', '));
		//PASS BACK THROUGH TO CHANGE SETUP
		for(let roleId in this.roles){
			let role = this.roles[roleId];
			if(role.ability.trigger && role.ability.trigger === 'setup'){
				console.log('modifiesSetup', role);
				//Store here, e.g. Baron: type=townsfolk, modifiedType=outsider, count=2
				let setup = role.ability.special;
				let setupType = setup.type;
				let modifiedType = setup.modifiedType;
				let setupCount = setup.count;
				for(let i=0; i< setupCount; i++){
					//this.roles.filter( (role) => { return role.type === setupType})[0].type = modifiedType;
					let newRole = this.getRole(modifiedType);
					console.log('setupMod - new role =',newRole);
					//ITERATE ROLES TO FIND MATCHING ROLE
					for(let j = 0; j < this.roles.length; j++){
						//IF TYPE MATCHES 
						if(this.roles[j].type === setupType){
							//REPLACE ROLE
							console.log('SWAPPING',JSON.parse(JSON.stringify(this.roles[j])), JSON.parse(JSON.stringify(newRole)));
							this.roles[j] = JSON.parse(JSON.stringify(newRole));
						}
					}
				}
			}
		}

		console.log('rolesPostModify',playerCount, JSON.parse(JSON.stringify(this.roles)));
	}

	assignNames(names){
		for(let i = 0; i < names.length; i++){
		this.roles[i].name = names[i];
		}
		for(let i = names.length; i < this.roles.length; i++){
		this.roles[i].name = this.getRandomName();
		}
	}

	getRandomName(){
		let names = [
			'Mat',
			'Tom',
			'Sam',
			'Ant',
			'Joe',
			'Fil',
			'Rik',
			'Ged',
			'Liz'
		];
		let possible = names.filter( (r) => { return !this.roles.map( (p) => { return p.name; }).includes(r); });
		return this.shuffle(possible)[0];
	}
	
	getPlayersArray(pCount)
	{
		//scale down here for 0-index
		let pCounts = this.playerCounts[pCount - 1];
		//console.log('pCounts',pCounts);
		//Assign townsfolk
		let arr = Array(pCounts.townsfolk).fill('townsfolk');
		//Assign outsiders
		for(let i = 0; i < pCounts.outsider; i++){
			arr.push('outsider');
		}
		//Assign minions
		for(let i = 0; i < pCounts.minion; i++){
			arr.push('minion');
		}
		//Assign demon - modify for Legion, Lil monsta etc
		arr.push('demon');
		return this.shuffle(arr);
	}

	getRole(type)
	{
		let roles = this.roles.map( (role) => { return role.role});
		//console.log(roles.join(','));
		let possible = this.script.roles.filter( (r) => { return (!roles.includes(r.role) && (r.type === type) ); });
		//console.log('getRole',type, possible);
		return possible[0];
	}
	
	processNight(){
		
	}
	
	processDay(){
		
	}
	
	processNomination(){
		
	}
	
	learn(correctCount, totalCount, infoType, droisoned = false)
	{
		let info;
		switch(infoType){
		case 'townsfolk':
			info = this.learnType('townsfolk',2,this.name);
		break;
		case 'outsider':
			info = this.learnType('outsider',2,this.name);
		break;
		case 'minion':
			info = this.learnType('minion',2,this.name);
		break;
		}
		
		return info;
	}
	
	learnType(type, count, selfName)
	{
		let info = { 
			possible: [],
			info: ''
		}
		
		//Select from the correct type (not yourself, to be kind)
		let options = this.roles.filter( (player) => { return ( (player.type == type) && (player.name != selfName) ) });
		//librarian, no outsiders in play
		if(options.length === 0){
			info.info = 'none';
			return info;
		}
		
		//Choose one at random
		let selected = options[Math.floor(Math.random() * options.length)];
		//Get the role
		info.info = selected.role;
		info.possible.push(selected.name);
		
		//Filter players to NOT the selected player or yourself
		let other = this.roles.filter( (player) => { return ( (player.name != selected.name) && (player.name != selfName) ) });
		let selectedOther = other[Math.floor(Math.random() * other.length)];
		info.possible.push(selectedOther.name);
		
		info.possible = this.shuffle(info.possible);
		
		return info;
	}
	
	learnChefNumber()
	{
		let evilMax = 0;
		let currentChef = 0;
		let lastEvilIndex = false;
		//With recluse?
		for(let i=0; i<grim.players.length; i++){
		if(grim.players[i].alignment == 'evil'){
			if( (lastEvilIndex) && ( (i - lastEvilIndex) == 1) ){
			//increment chef
			currentChef++;
			if(currentChef > evilMax){
				evilMax = currentChef;
			}
			}
		}
		}
	}
	
	shuffle(arr)
	{
		var j, x, i;
		for (i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = arr[i];
		arr[i] = arr[j];
		arr[j] = x;
		}
		return arr;
	}
}