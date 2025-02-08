function accordion(id){

	//APPEND CONTENT TO THE CLICKED BUTTON ID
	id = id + '_Content';

	// GET THE ELEMENT
	var x = document.getElementById(id);

	//IF w3-show CLASS IS NOT FOUND
	if (x.className.indexOf("w3-show") == -1) {

		//SHOW CONTENT
		x.className += " w3-show";
	} else {

		//HIDE CONTENT
		x.className = x.className.replace(" w3-show", "");
	}
}

function tab(id) {

	//APPEND _Content TO THE id
	let targetId = id.replaceAll(" ","_") + '_Content';

	//GET ALL THE TAB CONTENT
	var x = document.getElementsByClassName("tabContent");

	//ITERATE THROUGH THE TAB CONTENT
	for (let i = 0; i < x.length; i++) {

		//HIDE ALL ELEMENTS
		x[i].style.display = "none";
		//x[i].style.height = "0px !important";
		//x[i].style.lineHeight = '0';
		//x[i].style.overflow = 'hidden';
	}
	//THEN MAKE THE SELECTED ITEM DISPLAY
	document.getElementById(targetId).style.display = "block";
	document.getElementById(targetId).style.lineHeight = "2em";

	let tablinks = document.getElementsByClassName('w3-bar-item');
	for (let i = 0; i < tablinks.length; i++){
		tablinks[i].className = tablinks[i].className.replace(" w3-green", "");
	}
	//event.target.className += " w3-red";
	//console.log(id);
	document.getElementById(id).className += " w3-green";
}

const editions = [
	{
		id: 1,
		name: "Trouble Brewing",
		code: "tb",
		color: "red",
		handler: "accordion('Trouble_Brewing_Edition')",
		description: "Trouble Brewing has a little bit of everything. Some characters passively receive information, some need to take action to learn who is who, while some simply want to bait the Demon into attacking them. Both good and evil can gain the upper hand by making well-timed sacrifices. Trouble Brewing is a relatively straightforward Demon-hunt, but evil has a number of dastardly misinformation tricks up their sleeves, so the good players best question what they think they know if they hope to survive.",
		difficulty: "Beginner. Recommended for players and Storytellers new to Blood on the Clocktower or to social deception games.",
		evilDescription: "Evil players will need to pretend to be good characters and do so well, giving false information to confuse the good team if necessary. With only true information, the good team will usually find out who is evil with enough time to spare. But with even a little believable falsehood in the air, evil has a chance. The Poisoner and Spy, if they pay attention, can cause huge confusion in the good team&apos;s ranks by using their abilities sneakily. Evil will also need to decide when to make sacrifices. Will the Scarlet Woman kill the Imp to save their team? Will the Imp kill themself to turn a more trustworthy player into the Demon? Will the evil team vote to execute a suspicious Minion in order to look like honorable members of the town? Or will the Baron give obviously false information to make it look like a Poisoner is in the game? Causing confusion about which Minions are in play can be the difference between victory and defeat.",
		goodDescription: "Good players will need to figure out who is good and who is evil by using logic and intuition. Some players may want to reveal which character they are and share their information immediately (such as the Chef or Investigator), while others may want to lie about their identity so that the Imp avoids attacking them (such as the Undertaker or Fortune Teller). Some may lie about who they are so that the Imp does attack them (such as the Ravenkeeper or Soldier)! Other good characters gain information by doing something and noticing the effect. Sacrificing one&apos;s life by nominating a Virgin, attempting to kill the Imp as a Slayer and noticing what happens, or deliberately killing good players so that the Undertaker can confirm which character they were—these are all ways to sacrifice life and power to gain information and achieve victory.",
		roles: {
			townsfolk: [],
			outsider: [],
			minion: [],
			demon: [],
			fabled: [],
			decoy: [],
			traveler: []
		}
	},
	{
		id: 2,
		name: "Bad Moon Rising",
		code: "bmr",
		color: "yellow",
		description: "The sun is swallowed by a jagged horizon as another winter&apos;s day surrenders to the night. Flecks of orange and red decay into deeper browns, the forest transforming in silent anticipation of the coming snow.  Ravenous wolves howl from the bowels of a rocky crevasse beyond the town borders, sending birds scattering from their cozy rooks. Travellers hurry into the inn, seeking shelter from the gathering chill. They warm themselves with hot tea, sweet strains of music and hearty ale, unaware that strange and nefarious eyes stalk them from the ruins of this once great city.  Tonight, even the livestock know there is a... Bad Moon Rising.  Bad Moon Rising is a death extravaganza. Demons kill multiple times per night, and Minions get in on the action too. Good players can take great risks to gain reliable information, but may accidentally kill their friends in the process. Luckily, there are many options to keep players alive long past their use-by date. If the good team cannot determine which specific Minions and Demons are in play, however, their doom is all but certain.",
		difficulty: "Intermediate. Recommended for players who are proactive, dedicated to working as a team, and don&apos;t fear dying.",
		evilDescription: "Evil players may feel invincible at first, but they will need to use their abilities with precision and prudence in order to win. The Demon may need to convince the good team that a different Demon is in play to avoid the crippling effects of some good characters (such as the Exorcist or the Courtier), and may need to deliberately not kill to do so. But if the Demon can figure out who to attack and who to avoid attacking (such as the Tea Lady&apos;s neighbours, or the Fool), then the good team is in serious trouble.  The Minions will need to time their abilities well. A well-timed Assassin&apos;s kill, a patient Devil&apos;s Advocate, or a Mastermind that can read a room can pull victory from the jaws of defeat.",
		goodDescription: "Good players will receive little information by being passive. Some Townsfolk abilities require the good team to execute players in order to gain information (such as the Tea Lady or the Pacifist), whilst others encourage good players to take risks that may end in death in order to find out who is who (such as the Gambler or the Gossip). When good players do something, they learn something.  The good team will also need to pay close attention to who died at night, and how. If they ignore this, they risk losing unexpectedly at the end of a day with four, five, or even six players still left alive. However, if they can figure out how each player died at night, they can figure out which evil characters are in play—letting them avoid losing the game to the dreaded Mastermind or the intimidating Po—and get helpful clues on which good characters accidentally killed which players (such as the Moonchild or the Tinker).",
		roles: {
			townsfolk: [],
			outsider: [],
			minion: [],
			demon: [],
			fabled: [],
			decoy: [],
			traveler: []
		}
	},
	{
		id: 3,
		name: "Sects & Violets",
		code: "snv",
		color: "purple",
		description: "Vibrant spring gives way to a warm and inviting summer. Flowers of every description blossom as far as the eye can see, tenderly nurtured in public gardens and window boxes overlooking the lavish promenade. Birds sing, artists paint and philosophers ponder life&apos;s greatest mysteries inside a bustling tavern as a circus pitches its endearingly ragged tent on the edge of town. As the townsfolk bask in frivolity and mischief, indulging themselves in fine entertainment and even finer wine, dark and clandestine forces are assembling. Witches and cults lurk in majestic ruins on the fringes of the community, hosting secret meetings in underground caves and malevolently plotting the downfall of Ravenswood Bluff and its revelers. The time is ripe for... Sects & Violets. <p>Sects & Violets is the craziest of the three editions included in the base set. Good characters get amazing information each and every night. However, the evil team is extremely varied and threatening and can throw massive confusion into the mix. Characters change alignment. Players change characters. Even the evil team can lose track of who is who. This is also the first appearance of madness, which throws all manner of spanners into the works.",
		difficulty: "Intermediate. Recommended for players who want to do wild and unexpected things, pushing the limits of what can be achieved in a bluffing game.",
		evilDescription: "Evil players will want to kill or otherwise remove the threat of the most dangerous Townsfolk as soon as possible. Demons can only kill once per night, but Minions such as the Pit-Hag, Witch, and Cerenovus can really help thin out the good team&apos;s ranks if the Minion is clever. Evil players should also consider whether they give true or false information to the group, since the group may reverse-engineer that information depending on which Demon they believe is in play.",
		goodDescription: "Good players will almost always have more information than they know what to do with. Unlike in Trouble Brewing, wherethe good team can trust most of their information most of the time, the good team in Sects & Violets will need to figureout which Demon is in play to even begin to make sense of what&apos;s going on. With a Fang Gu in play, all information istrue, except for any that pertains to the Demon, who may swap players. With a No Dashii in play, two Townsfolk arepoisoned, but if the good team can deduce which players these are, they&apos;ll have found the Demon. With a Vigormortis inplay, Townsfolk get poisoned when Minions die at night. With a Vortox in play, all information is false. Once the goodteam notices what information is right and what is wrong, they can backtrack and reverse what they thought they knew andbegin to learn something valuable.To confuse things even further, Outsiders will usually want to lie about who they are for most of the game, and maybe even some Townsfolk will want to do the same. An Outsider that dies can cause terrible disadvantages for the goodteam, so wise Demons will usually want to kill them as soon as possible.",
		roles: {
			townsfolk: [],
			outsider: [],
			minion: [],
			demon: [],
			fabled: [],
			decoy: [],
			traveler: []
		}
	},
	{
		id: 4,
		name: "Experimental",
		code: "exp",
		color: "deep-orange",
		description: "A.K.A. The Carousel - Experimental characters are characters which do not yet have a home script. At some point in the future, these may be released as part of official expansion scripts. For now, you are encouraged to experiment with them in your own scripts.",
		difficulty: "Advanced. Recommended for players and Storytellers who have experienced many games of Blood on the Clocktower.",
		evilDescription: "Evil players will find a new or unique minion and demon pairing to play!",
		goodDescription: "Good players will get a few new tricks up their sleeves too!",
		roles: {
			townsfolk: [],
			outsider: [],
			minion: [],
			demon: [],
			fabled: [],
			decoy: [],
			traveler: []
		}
	},
	{
		id: 5,
		name: "Travellers",
		code: "traveler",
		color: "grey",
		description: "Travelers do have a 'home script' but are gathered here for ease.",
		difficulty: "Varies depending on Traveler but most are suitable for beginners.",
		evilDescription: "All Travelers can be evil and learn who the Demon is, which usually spices up games significantly!",
		goodDescription: "Good Travelers can also be essential in solving games or supporting good victories!",
		roles: {
			traveler: []
		}
	},
	{
		id: 6,
		name: "Fabled",
		code: "fabled",
		color: "white",
		description: "Fabled characters are for the Storyteller. They each alter the conditions of the game somewhat and are usually included at the beginning of the game.The purpose of a Fabled character is to allow players to join in a game of Clocktower when they would otherwise not be able to, or to allow a game to run smoothly when there would otherwise be a real-world issue. Fabled characters fix problems that are outside the usual game parameters. For example, if a player has a mental disability that would normally mean that they are unable to understand the game rules or communicate with the group, a Fabled character can allow them to join in. If a player is new to the game, and fearful that they will die early, a Fabled character can protect them. If there are too many players wanting to play all at once, a Fabled character can make the game run more quickly. If one of the group is shy or softly spoken, and has trouble getting the groups attention, a Fabled character can give them the powers to do so. If the game needs to end unexpectedly early, a Fabled character can decide a winner. If you have made your own character list using the Script character list generator, a Fabled character can help it be more fun.",
		difficulty: "N/A",
		evilDescription: "N/A",
		goodDescription: "N/A",
		roles: {
			fabled: []
		}
	}
];

function load(roles){

	var roleCount = roles.length;
	for(var i = 0; i < roleCount; i++){
		var role = roles[i];
		//console.log(role.name);
		switch(role.edition){
			case 'tb':
				store = editions[0].roles;
				assign(store, role);
			break;
			case 'bmr':
				store = editions[1].roles;
				assign(store, role);
			break;
			case 'snv':
				store = editions[2].roles;
				assign(store, role);
			break;
			case '':
				store = editions[3].roles;
				assign(store, role);
			break;
			//ETC
		}
		if(role.team == "traveler"){
			store = editions[4].roles;
			assign(store, role);
		}else if(role.team === "fabled"){
			store = editions[5].roles;
			assign(store, role);
		}
	}

	//==================
	// OUTPUT SCRIPT
	// TAB BUTTONS
	//==================
	let tabBarDiv = document.createElement('div');
	tabBarDiv.className = "w3-black w3-center w3-row w3-container";
	document.getElementById('editionOutput').appendChild(tabBarDiv);

	//ITERATE EDITIONS
	for(edition in editions){
		//CREATE THE ACCORDION OPEN BUTTON
		let button = document.createElement('button');
		//ADD onclick EVENT TO OPEN ACCORDION
		button.onclick = function (event) {
			//console.log(event.target.id + ' clicked');
			tab(event.target.id);
		}
		button.id = editions[edition].name.replaceAll(" ","_") + '_Edition';
		//button.className = "w3-btn w3-block w3-" + editions[edition].color  + " accordion-heading";
		//button.className = "w3-btn w3-col-s2 w3-text-" + editions[edition].color  + " w3-border w3-border-" + editions[edition].color + " w3-bar-item w3-center";
		button.className = "w3-btn w3-bar-item w3-small w3-bold w3-quarter w3-text-" + editions[edition].color  + " w3-border w3-border-" + editions[edition].color + " w3-center";
		//button.innerHTML = editions[edition].code.toUpperCase();
		button.innerHTML = editions[edition].name.toUpperCase();
		tabBarDiv.appendChild(button);
	}

	//TEST - ADDING AN "ALL CHARACTERS" SCRIPT
	let button = document.createElement('button');
	//ADD onclick EVENT TO OPEN ACCORDION
	button.onclick = function (event) {
		//console.log(event.target.id + ' clicked');
		tab(event.target.id);
	}
	button.id = 'All_Characters_Edition';
	//button.className = "w3-btn w3-block w3-" + editions[edition].color  + " accordion-heading";
	button.className = "w3-btn w3-bar-item w3-col s12 w3-text-white w3-border w3-border-white w3-center";
	button.innerHTML = "ALL";
	tabBarDiv.appendChild(button);

	
	//ITERATE EDITIONS
	for(edition in editions){

		/*console.log('-----------------------');
		console.log('PROCESSING ',editions[edition].name);
		console.log('-----------------------');*/
		

		//CREATE THE ACCORDION CONTENT DIV
		let div = document.createElement('div');
		div.id = editions[edition].name.replaceAll(" ","_") + '_Edition_Content';
		//div.className = "w3-hide w3-" + editions[edition].color  + " accordion-content";
		div.className = "w3-" + editions[edition].color  + " w3-container tabContent";
		//console.log(div.id);


		div.appendChild(document.createElement('br'));

		//CREATE THE CONTENT HEADER
		let header2 = document.createElement('h2');
		header2.innerHTML = editions[edition].name;

		div.appendChild(header2);

		div.appendChild(document.createElement('br'));
		div.appendChild(document.createElement('br'));
		
		//DIFFICULTY
		let b = document.createElement('b');
		b.innerHTML = editions[edition].difficulty;
		b.style.textAlign = 'center';
		div.appendChild(b);

		div.appendChild(document.createElement('br'));
		div.appendChild(document.createElement('br'));

		//DESCRIPTION
		let em = document.createElement('em');
		em.style.fontSize = '1.5em';
		em.innerHTML = editions[edition].description;
		div.appendChild(em);

		div.appendChild(document.createElement('br'));
		div.appendChild(document.createElement('br'));

		//GOOD PLAYERS
		let pGood = document.createElement('p');
		pGood.className = 'w3-green';
		pGood.style.padding = '25px';
		pGood.innerHTML = editions[edition].goodDescription;
		div.appendChild(pGood);

		div.appendChild(document.createElement('br'));

		//EVIL PLAYERS
		let pEvil = document.createElement('p');
		pEvil.className = 'w3-pale-red';
		pEvil.style.padding = '25px';
		pEvil.innerHTML = editions[edition].evilDescription;
		div.appendChild(pEvil);

		div.appendChild(document.createElement('br'));

		//LINK
		let a = document.createElement('a');
		a.href = 'https://wiki.bloodontheclocktower.com/' + editions[edition].name.replaceAll(" ","_");
		a.innerHTML = 'View ' + editions[edition].name + ' on the wiki!';
		a.target = '_blank';
		a.className = 'w3-btn w3-lime w3-border';
		div.appendChild(a);

		//SPACER
		div.appendChild(document.createElement('br'));
		div.appendChild(document.createElement('br'));

		//ITERATE THROUGH THE ROLES
		for(role in editions[edition].roles){

			let obj = editions[edition].roles[role];
			//console.log('type', editions[edition].roles[role]);
			teamsToFill = ['townsfolk','outsider','minion','demon','traveler','fabled','decoy'];
			Object.entries(obj).forEach(entry => {

				const [key, value] = entry;

				//CHECK IF THIS ROLE IS YET TO BE OUTPUT
				if(teamsToFill.includes(value.team)){
					//ADD HEADER
					//console.log('HEADER:',value.team);
					let header3 = document.createElement('h3');
					header3.innerHTML = value.team.toUpperCase();
					div.appendChild(header3);

					var ul = document.createElement('ul');
					div.appendChild(ul);

					//REMOVE FROM TEAMS TO FILL
					const index = teamsToFill.indexOf(value.team);
					if (index > -1) { // only splice array when item is found
						teamsToFill.splice(index, 1); // 2nd parameter means remove one item only
					}
				}

				//CREATE A LIST ITEM
				let li = document.createElement('li');
				//AND AN ANCHOR TAG
				let a = document.createElement('a');
				a.href = 'https://wiki.bloodontheclocktower.com/' + value.name.replace(' ','_');
				a.target = '_blank';
				a.innerHTML = '<b>' + value.name + '</b>';
				li.appendChild(a);
				//CREATE AN EMPHASIS TAG FOR THE ABILITY
				let em = document.createElement('em');
				em.innerHTML = ' "' + value.ability + '"';
				//STORE ON LI/DIV
				li.appendChild(em);
				div.appendChild(li);
			});
			//ADD DIVIDER BETWEEN ROLE TYPES
			div.appendChild(document.createElement('hr'));
		}

		div.appendChild(document.createElement('br'));
		//ADD A BACK TO SCRIPTS LINK
		let backToTopLink = document.createElement('a');
		backToTopLink.href = '#editions';
		backToTopLink.innerHTML = '^ Back to Editions ^'
		div.appendChild(backToTopLink);

		div.appendChild(document.createElement('br'));
		div.appendChild(document.createElement('br'));

		//APPEND THIS DIV TO THE OUTPUT
		document.getElementById('editionOutput').appendChild(div);
		//document.getElementById('editionOutput').appendChild(document.createElement('br'));
	} //END iterate editions

	let sortedRoles = roles.sort(function(a,b) {
		var nameA = a.name.toUpperCase();
		var nameB = b.name.toUpperCase();
		return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
	});

	//CREATE THE ACCORDION CONTENT DIV
	let div = document.createElement('div');
	div.id = 'All_Characters_Edition_Content';
	div.className = "w3-white w3-container tabContent";

	let head = document.createElement('h2');
	head.innerHTML = 'All character roles (alphabetical)';
	div.appendChild(head);

	for(role in sortedRoles){
		
		let obj = sortedRoles[role];
		//console.log('Processing',obj.name);

		//CREATE A LIST ITEM
		let li = document.createElement('li');
		switch(obj.team){
			case 'townsfolk':
				li.style.color = 'green';
			break;
			case 'outsider':
				li.style.color = 'blue';
			break;
			case 'minion':
				li.style.color = 'DarkGoldenRod';
			break;
			case 'demon':
				li.style.color = 'Maroon';
			break;
			case 'traveler':
				li.style.color = 'purple';
			break;
			case 'fabled':
				li.style.color = 'grey';
			break;
			default:
				li.style.color = 'purple';
			break;
		}
		//AND AN ANCHOR TAG
		let a = document.createElement('a');
		a.href = 'https://wiki.bloodontheclocktower.com/' + obj.name.replace(' ','_');
		a.target = '_blank';
		a.innerHTML = '<b>' + obj.name + ' (' + obj.team + ')</b>';
		
		li.appendChild(a);
		//CREATE AN EMPHASIS TAG FOR THE ABILITY
		let em = document.createElement('em');
		em.innerHTML = ' "' + obj.ability + '"';
		//STORE ON LI/DIV
		li.appendChild(em);
		div.appendChild(li);
	}

	div.appendChild(document.createElement('br'));
	//ADD A BACK TO SCRIPTS LINK
	let backToTopLink = document.createElement('a');
	backToTopLink.href = '#editions';
	backToTopLink.innerHTML = '^ Back to Editions ^'
	div.appendChild(backToTopLink);

	div.appendChild(document.createElement('br'));
	div.appendChild(document.createElement('br'));

	document.getElementById('editionOutput').appendChild(div);

	tab('Trouble_Brewing_Edition');

	function assign(store, role){
		//console.log(store[`${role.team}`]);
		store[`${role.team}`].push(role);
	}
}
