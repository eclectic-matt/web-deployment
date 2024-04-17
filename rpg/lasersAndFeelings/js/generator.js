var json;

const loadData = () => {
	getJSON('./data/lasersAndFeelings.json', storeData);
}

const storeData = (status, data) => {
	json = data;
	//console.log(json);
	updateOptions(data);
}

const updateOptions = (data) => {

	let select = document.getElementById('style');
	data.player.style.forEach( (name) => {
		let option = document.createElement('option');
		option.value = name;
		option.innerHTML = name;
		select.appendChild(option);
	});

	select = document.getElementById('role');
	data.player.role.forEach( (role) => {
		let option = document.createElement('option');
		option.value = role;
		option.innerHTML = role;
		select.appendChild(option);
	});

	select = document.getElementById('number');
	data.player.number.forEach( (num) => {
		let option = document.createElement('option');
		option.value = num;
		option.innerHTML = num;
		select.appendChild(option);
	});

	select = document.getElementById('goal');
	data.player.goal.forEach( (name) => {
		let option = document.createElement('option');
		option.value = name;
		option.innerHTML = name;
		select.appendChild(option);
	});

	select = document.getElementById('strength1');
	data.ship.strengths.forEach( (name) => {
		let option = document.createElement('option');
		option.value = name;
		option.innerHTML = name;
		select.appendChild(option);
	});

	select = document.getElementById('strength2');
	data.ship.strengths.forEach( (name) => {
		let option = document.createElement('option');
		option.value = name;
		option.innerHTML = name;
		select.appendChild(option);
	});

	select = document.getElementById('problem');
	data.ship.problem.forEach( (name) => {
		let option = document.createElement('option');
		option.value = name;
		option.innerHTML = name;
		select.appendChild(option);
	});

}

const updateProblemDetail = (event) => {

   let index = event.target.selectedIndex;
   let detail = '';
   if(index > 0){
     detail = json.adventure.problemDetails[index - 1];
   }
   document.getElementById('problemDetail').innerHTML = detail;

}

const randomCharacter = () => {
	//console.log('data loaded', data);
	openPanel('character');
		
	//SECTIONS TO GENERATE
	//style
	let sIndex = Math.floor(Math.random() * json.player.style.length);
	document.getElementById('style').selectedIndex = (sIndex + 1);

	//role
	let rIndex = Math.floor(Math.random() * json.player.role.length);
	document.getElementById('role').selectedIndex = (rIndex + 1);

	//number
	let nIndex = Math.floor(Math.random() * json.player.number.length);
	document.getElementById('number').selectedIndex = (nIndex + 1);

	//goal
	let gIndex = Math.floor(Math.random() * json.player.goal.length);
	document.getElementById('goal').selectedIndex = (gIndex + 1);
}

const randomShip = () => {
	//console.log('data loaded', data);
	openPanel('ship');
		
	//SECTIONS TO GENERATE
	//strengths (x2)
	let s1Index = Math.floor(Math.random() * json.ship.strengths.length);
	let strength1 = json.ship.strengths[s1Index];
	document.getElementById('strength1').value = strength1;

	let otherStrengths = json.ship.strengths.filter( (s) => { return s !== strength1; });
	let s2Index = Math.floor(Math.random() * otherStrengths.length);
	let strength2 = otherStrengths[s2Index];
	document.getElementById('strength2').value = strength2;

	//problem
	let pIndex = Math.floor(Math.random() * json.ship.problem.length);
	document.getElementById('problem').selectedIndex = (pIndex + 1);
}


const randomAdventure = () => {

	openPanel('adventure');

	//threat
	let threatIndex = Math.floor(Math.random() * json.adventure.threat.length);
	let threat = json.adventure.threat[threatIndex];
 let want = ' wants to ';
 if(threat.slice(-1) === 's'){
   want = ' want to ';
 }
	
	//aim
	let aimIndex = Math.floor(Math.random() * json.adventure.aim.length);
	let aim = json.adventure.aim[aimIndex];

	//target
	let targetIndex = Math.floor(Math.random() * json.adventure.target.length);
	let target = json.adventure.target[targetIndex];
	
	//result
	let resultIndex = Math.floor(Math.random() * json.adventure.result.length);
	let result = json.adventure.result[resultIndex];
	

	//OUTPUT
	let advEl = document.getElementById('generatedAdventure');
	advEl.innerHTML = '<p>' + threat + want + aim + ' the ' + target + ' which will ' + result;
}