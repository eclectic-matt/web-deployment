const cards = [
	{
		resources: {
			K: {
				name: 'Knowledge',
				icon: '💡',
				value: 0
			},
			M: {
				name: 'Metal',
				icon: '🔩',
				value: 0
			},
			R: {
				name: 'Robotics',
				icon: '🤖',
				value: 0
			}
		},
		
		workers: {
			rows: [
				{
					action: "Gain",
					type: "M"
				},
				{
					action: "Develop",
					type: null
				},
				{
					action: "Rotate",
					type: null
				},
				{
					action: "Gain",
					type: "K"
				}
			],
			cols: [
				{
					action: "Rotate",
					type: null
				},
				{
					action: "Gain",
					type: "M"
				},
				{
					action: "Gain",
					type: "R"
				},
				{
					action: "Develop",
					type: null
				}
			],
			placed: [
				[false, false, false, false],
				[false, false, false, false],
				[false, false, false, false],
				[false, false, false, false]
			]
		},
		
		development: {
			
			
			north: {
				name: 'Supercomputer',
				isWonder: true,
				points: 50,
				stages: [
					{
						id: 0,
						complete: false,
						requires: [
							{
								type: "K",
								amount: 2
							},
							{
								type: "M",
								amount: 4
							}
						]
					},
					{
						id: 1,
						complete: false,
						requires: [
								{
									type: "K",
									amount: 4
								},
								{
									type: "M",
									amount: 6
								}
						]
					},
					{ 
						id: 2,
						complete: false,
						requires: [

								{
									type: "K",
									amount: 8
								},
								{
									type: "R",
									amount: 7
								}
						]
					}
				]
			},
			
			
			east: {
				name: 'Microchip',
				isWonder: false,
				points: 45,
				stages: [
					{
						id: 0,
						complete: false,
						requires: [
								{
									type: "K",
									amount: 4
								},
								{
									type: "M",
									amount: 6
								}
						]
					},
					{ 
						id: 1,
						complete: false,
						requires: [
								{
									type: "K",
									amount: 5
								},
								{
									type: "R",
									amount: 6
								}
						]
					}
				]
			},
			
			
			south: {
				name: 'Solid State Drive',
				isWonder: false,
				points: 60,
				stages: [
					{
						id: 0,
						complete: false,
						requires: [
								{
									type: "K",
									amount: 5
								},
								{
									type: "M",
									amount: 7
								}
						]
					},
					{
						id: 1,
						complete: false,
						requires: [
								{
									type: "R",
									amount: 5
								},
								{
									type: "M",
									amount: 8
								}
						]
					},
					{ 
						id: 2,
						complete: false,
						requires: [
								{
									type: "K",
									amount: 9
								},
								{
									type: "R",
									amount: 8
								}
						]
					}
				]
			},
			
			west: {
				name: 'Transistor',
				isWonder: false,
				points: 55,
				stages: [
					{
						id: 0,
						complete: false,
						requires: [
								{
									type: "M",
									amount: 6
								},
								{
									type: "R",
									amount: 7
								}
						]
					},
					{
						id: 1,
						complete: false,
						requires: [
								{
									type: "K",
									amount: 8
								},
								{
									type: "R",
									amount: 9
								}
						]
					}
				]
			}
			
		}
	}
];

let currentDevelopment = "north";
let orientations = ["north", "east", "south", "west"];
const currentCard = cards[0];

const rotateCard = (clockwise=false) => {
	if(clockwise){
		//Remove from end, append to front
		let currentOrient = orientations.pop();
		orientations.unshift(currentOrient);
	}else{
		//Remove from front, append to end
		let currentOrient = orientations.shift();
		orientations.push(currentOrient);
	}
	currentDevelopment = orientations[0];
	//console.log(currentDevelopment, orientations);
	generateCards(currentCard);
}

const generateDevelopment = (id, card, dev) => 
{
	const el = document.getElementById(id);
	el.innerHTML = null;
	//const dev = card.development[id];
	//console.log(id, dev);
	const head = document.createElement('h2');
	head.innerHTML = dev.name;
	if (dev.isWonder){
		head.innerHTML += " 🌟";
	}
	el.appendChild(head);
	const stagesTable = document.createElement('table');
	const stagesRow = document.createElement('tr');
	for(let i = 0; i < dev.stages.length; i++){
		const stage = dev.stages[i];
		//console.log(stage);
		const stageTd = document.createElement('td');
		let output = [];
		for(let r = 0; r < stage.requires.length; r++){
			const require = dev.stages[i].requires[r];
			//console.log(id, 'requires', require.type, 'resources', card.resources);
			const resource = card.resources[require.type];
			const icon = resource.icon;
			//console.log(resource.name, 'icon', icon, 'resource', resource);
			output.push(require.amount.toString() + ' ' + icon);
		}
		const requireSpan = document.createElement('span');
		requireSpan.innerHTML = output.join(', ');
		stageTd.appendChild(requireSpan);
		//Add checkbox
		const requireBox = document.createElement('input');
		requireBox.type = "checkbox";
		requireBox.id = id + '-' + i;
		requireBox.onclick = (ev) => {
			//console.log('click', ev);
			const [devId, devStage] = ev.target.id.split('-');
			//console.log(devId, devStage, currentCard);
			currentCard.development[devId].stages[devStage].complete = true;
			//console.log('updated', currentCard);
		}
		if(id === 'north'){
			requireBox.disabled = false;
		}else{
			requireBox.disabled = true;
		}
		if(dev.stages[i].complete){
			requireBox.checked = true;
		}
		stageTd.appendChild(requireBox);
		stagesRow.appendChild(stageTd);
	}
	stagesTable.appendChild(stagesRow);
	el.appendChild(stagesTable);
}

/**
 * Generates the first of the cards showing developments to be completed - split into 4 quarters, dubbed north/east/south/west for ease. The element with id=north will always be at the top, but have the current orientations[0] development drawn onto the north element and rotateCard() rotates the current orientation of this card.
 */
const generateDevelopmentCard = (card) => 
{
	generateDevelopment('north', card, card.development[orientations[0]]);
	generateDevelopment('east', card, card.development[orientations[1]]);
	generateDevelopment('south', card, card.development[orientations[2]]);
	generateDevelopment('west', card, card.development[orientations[3]]);
}

/**
 * Generates the second card, showing the current resource values and the table of places to add workers which gains you the benefits corresponding to the row and column, multiplied by the numbers of workers in that row or column.
 */
const generateWorkerCard = (card) => {
	const el = document.getElementById('workerCard');
	el.innerHTML = null;
	
	const workers = card.workers;
	const resources = card.resources;
	console.log('w', workers, 'r', resources);
	
	const table = document.createElement('table');
	table.className = 'workers';
	
	//ROW 1
	let topRow = document.createElement('tr');
	
	const resourceOne = resources[Object.keys(resources)[0]];
	const resourceTwo = resources[Object.keys(resources)[1]];
	const resourceThree = resources[Object.keys(resources)[2]];
	
	//DISPLAY RESOURCE 1 IN A ROW
	let resourceOneTd = document.createElement('td');
	resourceOneTd.style.width = "60%";
	let resourceOneLabel = document.createElement('label');
	resourceOneLabel.innerHTML = resourceOne.name + ' ' + resourceOne.icon + ':';
	resourceOneTd.appendChild(resourceOneLabel);
	let resourceOneInput = document.createElement('input');
	resourceOneInput.type = 'number';
	resourceOneInput.min = 0;
	resourceOneInput.max = 12;
	resourceOneInput.value = resourceOne.value;
	resourceOneInput.id = resourceOne.name;
	resourceOneInput.className = 'resource';
	resourceOneTd.appendChild(resourceOneInput);
	topRow.appendChild(resourceOneTd);
	
	//DISPLAY THE COL HEADINGS
	for(let i = 0; i < workers.cols.length; i++){
		const action = workers.cols[i].action;
		const actionType = workers.cols[i].type;
		let colTd = document.createElement('td');
		colTd.rowspan = 3;
		colTd.innerHTML = action;
		if(actionType){
			switch(action){
				case 'Gain':
					colTd.innerHTML += ' ' + resources[actionType].icon;
				break;
				//rotate L / R?
			}
		}
		topRow.appendChild(colTd);
	}
	table.appendChild(topRow);
	
	//ROW 2
	const rowTwo = document.createElement('tr');
	//DISPLAY RESOURCE 2 IN A ROW
	let resourceTwoTd = document.createElement('td');
	let resourceTwoLabel = document.createElement('label');
	resourceTwoLabel.innerHTML = resourceTwo.name + ' ' + resourceTwo.icon + ':';
	resourceTwoTd.appendChild(resourceTwoLabel);
	let resourceTwoInput = document.createElement('input');
	resourceTwoInput.type = 'number';
	resourceTwoInput.min = 0;
	resourceTwoInput.max = 12;
	resourceTwoInput.value = resourceTwo.value;
	resourceTwoInput.id = resourceTwo.name;
	resourceTwoInput.className = 'resource';
	resourceTwoTd.appendChild(resourceTwoInput);
	rowTwo.appendChild(resourceTwoTd);
	table.appendChild(rowTwo);
	
	//ROW 3 - THE LAST RESOURCE ROW
	const rowThree = document.createElement('tr');
	//DISPLAY RESOURCE 3 IN A ROW
	let resourceThreeTd = document.createElement('td');
	let resourceThreeLabel = document.createElement('label');
	resourceThreeLabel.innerHTML = resourceThree.name + ' ' + resourceThree.icon + ':';
	resourceThreeTd.appendChild(resourceThreeLabel);
	let resourceThreeInput = document.createElement('input');
	resourceThreeInput.type = 'number';
	resourceThreeInput.min = 0;
	resourceThreeInput.max = 12;
	resourceThreeInput.value = resourceThree.value;
	resourceThreeInput.id = resourceThree.name;
	resourceThreeInput.className = 'resource';
	resourceThreeTd.appendChild(resourceThreeInput);
	rowThree.appendChild(resourceThreeTd);
	table.appendChild(rowThree);
	
	for(let i = 0; i < workers.rows.length; i++){
		const action = workers.rows[i].action;
		const actionType = workers.rows[i].type;
		let row = document.createElement('tr');
		let rowResourceTd = document.createElement('td');
		rowResourceTd.innerHTML = action;
		if(actionType){
			switch(action){
				case 'Gain':
					rowResourceTd.innerHTML += ' ' + resources[actionType].icon;
				break;
				//rotate L / R?
			}
		}
		row.appendChild(rowResourceTd);
		for(let j = 0; j < workers.cols.length; j++){
			let rowCheckTd = document.createElement('td');
			let rowCheckInput = document.createElement('input');
			rowCheckInput.id = 'r' + i + 'c' + j;
			rowCheckInput.type = 'checkbox';
			rowCheckInput.checked = (workers.placed[i][j] === false ? false : true);
			rowCheckInput.onclick = (event) => {
				handleCheckedWorker(event.target.id);
			}
			rowCheckTd.appendChild(rowCheckInput);
			row.appendChild(rowCheckTd);
		}
		table.appendChild(row);
	}
	
	el.appendChild(table);
}

const generateCards = (card) => {
	generateDevelopmentCard(card);
	generateWorkerCard(card);
}

const getActionText = (actionData) => {
	const action = actionData.action;
	let output = action;
	const actionType = actionData.type;
	if(actionType){
		switch(action){
			case 'Gain':
				output += ' ' + currentCard.resources[actionType].icon;
			break;
			//rotate L / R?
		}
	}
	return output;
}

init = () => {
	generateCards(currentCard);
}

const handleCheckedWorker = (id) => {
	const [row, col] = id.substring(1,2) + id.substring(3,4);
	console.log(id, row, col );
	currentCard.workers.placed[row][col] = 1;
	let rowAct = currentCard.workers.rows[row];
	//let rowText = rowAct + 
	let rowText = getActionText(rowAct);
	let rowMult = currentCard.workers.placed[row].reduce((partialSum, a) => partialSum + a, 0);
	let colAct = currentCard.workers.cols[col];
	let colText = getActionText(colAct);
	let colVals = currentCard.workers.placed.map( (el) => {
		return el[col];
	});
	let colMult = colVals.reduce((partialSum, a) => partialSum + a, 0);
	console.log(rowAct,rowMult,colAct, colMult);
	alert('You ' + rowText + ' X ' + rowMult + ' (row) and ' + colText + ' X ' + colMult + ' (col)');
}