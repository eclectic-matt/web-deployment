/*
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
*/

/**
 * NOTES: 
 * A card game played using 2 cards. Using this panel to test/record plays during development.
 * Rules:
 * each turn, place 1 worker on the worker card. The space you place this worker relates to a row and column:
 * - you gain the benefits of BOTH the row and column
 * - these benefits are multiplied by the number of workers in that row or column
 * e.g. row="Gain Metal" (2 workers in this row), col="Rotate" (1 worker in this row) => you gain 2 Metal and may rotate 1 time. 
 * You may only develop (complete stages on the development card) for the active (top) development - you must rotate the card to develop other parts of the development card.
 */

//GLOBAL SCOPED
var cards = undefined;
var currentDevelopment = "north";
var orientations = ["north", "east", "south", "west"];
var currentCard = undefined;        //cards[0];

const getJSON = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
                //console.log('jsonLoaded', xhr.response);
                var status = xhr.status;
                if (status === 200) {
                        callback(null, xhr.response);
                } else {
                        callback(status, xhr.response);
                }
        };
        xhr.send();
};

const setCurrentCard = (card) => {
        currentCard = card;
}

//NOW RESOLVED IN A CALLBACK FROM getJson -> (xhr.status, xhr.response)
const init = (status, cardData) => {
        //console.log('init', cardData);
        cards = cardData;
        currentDevelopment = "north";
        orientations = ["north", "east", "south", "west"];
        //currentCard = cards[0];
        setCurrentCard(cards[0]);
        generateCards(currentCard);
}

//LOAD THE JSON DATA CONTAINING THE CARDS FOR THIS, PASS THIS TO init()
getJSON('./js/cards.json', init);

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
        head.style.textAlign = 'center';
        head.innerHTML = dev.name;
        if (dev.isWonder){
                head.innerHTML += " 🌟";
        }
        el.appendChild(head);
        const stagesTable = document.createElement('table');
        stagesTable.style.width = '100%';
        const stagesRow = document.createElement('tr');
        for(let i = 0; i < dev.stages.length; i++){
                const stage = dev.stages[i];
                const stageTd = document.createElement('td');
                let output = [];
                for(let r = 0; r < stage.requires.length; r++){
                        const require = dev.stages[i].requires[r];
                        const resource = card.resources[require.type];
                        const icon = resource.icon;
                        output.push(require.amount.toString() + ' ' + icon);
                }
                const requireSpan = document.createElement('span');
                requireSpan.innerHTML = output.join(', ');
                stageTd.appendChild(requireSpan);
                //Add checkbox
                const requireBox = document.createElement('input');
                requireBox.type = "checkbox";
                requireBox.id = dev.name + '-' + i;
                requireBox.onclick = (ev) => {
                        const [devId, devStage] = ev.target.id.split('-');
                        //GET THE NAMES (KEYS) OF THE CURRENT CARD'S DEVELOPMENT OBJECT
                        let devNames = Object.keys(currentCard.development);
                        //SEARCH THE DEVELOPMENT NAMES TO GET THE MATCHING OBJECT
                        let currentDevName = devNames.filter( (devName) => {
                                return (currentCard.development[devName].name === devId);
                        }, devId)[0];
                        //LOAD THE OBJECT ASSOCIATED WITH THE MATCHED DEVELOPMENT NAME
                        let currentDev = currentCard.development[currentDevName];
                        //PASS TO HANDLER
                        let valid= handleDevelopmentClicked(currentDevName, devStage);
                        let thisEl = document.getElementById(ev.target.id);
                        if(!valid){
                        	thisEl.checked = false;
                        	thisEl.disabled = false;
                        }else{
                        	thisEl.checked = true;
                        	thisEl.disabled = true;
                        }
                        
                }
                //ONLY THE CURRENT "NORTH" DEVELOPMENT 
                if(id === 'north'){
                        requireBox.disabled = false;
                }else{
                        requireBox.disabled = true;
                }
                //MARK AS CHECKED IF ALREADY COMPLETED THIS STAGE (STORED VIA handleDevelopmentClicked())
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
        //console.log('w', workers, 'r', resources);

        const table = document.createElement('table');
        table.className = 'workers';

        //ROW 1
        let topRow = document.createElement('tr');

        const resourceOne = resources[Object.keys(resources)[0]];
        const resourceTwo = resources[Object.keys(resources)[1]];
        const resourceThree = resources[Object.keys(resources)[2]];

        //DISPLAY RESOURCE 1 IN A ROW
        let resourceOneTd = document.createElement('td');
        resourceOneTd.style.width = "50%";
        let resourceOneLabel = document.createElement('label');
        resourceOneLabel.innerHTML = resourceOne.name + ' ' + resourceOne.icon + ':';
        resourceOneLabel.style.width = '50%';
        resourceOneTd.appendChild(resourceOneLabel);
        let resourceOneInput = document.createElement('input');
        resourceOneInput.type = 'number';
        resourceOneInput.min = 0;
        resourceOneInput.max = 12;
        resourceOneInput.value = resourceOne.value;
        resourceOneInput.id = resourceOne.name;
        resourceOneInput.style.width = '50%';
        //resourceOneInput.style.textAlign = 'right';
        resourceOneInput.style.float = 'right';
        resourceOneInput.className = 'resource';
        resourceOneTd.appendChild(resourceOneInput);
        topRow.appendChild(resourceOneTd);

        //DISPLAY THE COL HEADINGS
        for(let i = 0; i < workers.cols.length; i++){
                const action = workers.cols[i].action;
                const actionType = workers.cols[i].type;
                let colTd = document.createElement('td');
                colTd.rowSpan = '3';
                colTd.style.verticalAlign = 'bottom';
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
        resourceTwoLabel.style.width = '50%';
        resourceTwoTd.appendChild(resourceTwoLabel);
        let resourceTwoInput = document.createElement('input');
        resourceTwoInput.type = 'number';
        resourceTwoInput.min = 0;
        resourceTwoInput.max = 12;
        resourceTwoInput.value = resourceTwo.value;
        resourceTwoInput.id = resourceTwo.name;
        resourceTwoInput.style.width = '50%';
        resourceTwoInput.style.float = 'right';
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
        resourceThreeLabel.style.width = '50%';
        resourceThreeTd.appendChild(resourceThreeLabel);
        let resourceThreeInput = document.createElement('input');
        resourceThreeInput.type = 'number';
        resourceThreeInput.min = 0;
        resourceThreeInput.max = 12;
        resourceThreeInput.value = resourceThree.value;
        resourceThreeInput.id = resourceThree.name;
        resourceThreeInput.style.width = '50%';
        resourceThreeInput.style.float = 'right';
        resourceThreeInput.className = 'resource';
        resourceThreeTd.appendChild(resourceThreeInput);
        rowThree.appendChild(resourceThreeTd);
        table.appendChild(rowThree);

        for(let i = 0; i < workers.rows.length; i++){
                const action = workers.rows[i].action;
                const actionType = workers.rows[i].type;
                let row = document.createElement('tr');
                let rowResourceTd = document.createElement('td');
                //rowResourceTd.colSpan = 3;
                rowResourceTd.innerHTML = action;
                rowResourceTd.style.textAlign = 'right';
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
                        rowCheckTd.style.align = 'center';
                        let rowCheckInput = document.createElement('input');
                        rowCheckInput.id = 'r' + i + 'c' + j;
                        //rowCheckInput.style.margin = '0 5%';
                        rowCheckInput.type = 'checkbox';
                        rowCheckInput.checked = (workers.placed[i][j] === false ? false : true);
                        rowCheckInput.disabled = (workers.placed[i][j] === false ? false : true);
                        rowCheckInput.onclick = (event) => {
                                //WORKER SPACE CHECKED - PREVENT UN-CHECKING AND RE-CHECKING THIS WORKER
                                event.target.disabled = true;
                                handleCheckedWorker(event.target.id);
                        }
                        rowCheckInput.style.width = rowCheckTd.style.width;
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

const updateResources = (resources) => {
	let rKeys = Object.keys(resources);
	//console.log('update', rKeys);
	rKeys.forEach( (key) => {
		let res = resources[key];
		//console.log(key, res.name, res.value);
		document.getElementById(res.name).value = res.value;
		//document.getElementById(res.name).innerHTML = res.value;
	});
}

/**
 * Handles a worker location being checked.
 * @param {string} id The ID of the worker (which is in "r0c0" format).
 */
const handleCheckedWorker = (id) => {
        const [row, col] = id.substring(1,2) + id.substring(3,4);
        //console.log(id, row, col );
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
        let gainsText = 'You ' + rowText + ' X ' + rowMult + ' (row) and ' + colText + ' X ' + colMult + ' (col)';
        document.getElementById('currentGains').innerHTML = gainsText;
        //console.log(rowAct,rowMult,colAct, colMult);
        //alert('You ' + rowText + ' X ' + rowMult + ' (row) and ' + colText + ' X ' + colMult + ' (col)');
        //console.log('You ' + rowText + ' X ' + rowMult + ' (row) and ' + colText + ' X ' + colMult + ' (col)');
        
        switch(rowAct.action){
        	case 'Gain':
        		let rName = currentCard.resources[rowAct.type].name;
        		currentCard.resources[rowAct.type].value += rowMult;
        		//console.log(rName,'+=',rowMult);
    		break;
        }
        switch(colAct.action){
        	case 'Gain':
        		let cName = currentCard.resources[colAct.type].name;
        		currentCard.resources[colAct.type].value += colMult;
        		//console.log(cName,'+=',colMult);
    		break;
        }
        updateResources(currentCard.resources);
}


//WHETHER TO REDUCE RESOURCES WHEN DEVELOPING
const spendResourcesFlag = false;


const handleDevelopmentClicked = (id, stage) => {
	//DETERMINE IF VALID
	const req = currentCard.development[id].stages[stage].requires;
	let valid = true;
	req.forEach( (requirement) => {
		const reqType = requirement.type;
		const reqAmount = requirement.amount;
		if(currentCard.resources[reqType].value < reqAmount){
			valid = false;
		}
	});
	if(valid){
        //SET THIS STAGE AS COMPLETE
        currentCard.development[id].stages[stage].complete = true;
        
        //ALERT FOR 
        //alert('Devlopment clicked - ' + currentCard.development[id].name + ', stage: ' + stage);
        
        if(spendResourcesFlag){
	        //SPEND RESOURCES?
	        req.forEach( (requirement) => {
				const reqType = requirement.type;
				const reqAmount = requirement.amount;
				currentCard.resources[reqType].value -= reqAmount;
			});
			updateResources(currentCard.resources);
        }
        
        updateUndo(id, stage);
	}else{
		alert('Not enough resources!');
	}
	return valid;
}

const updateUndo = (id, stage) => {
	const undoBtn = document.getElementById('undo');
	undoBtn.style.display = 'block';
	undoBtn.onclick = function(){
		reverseAction(id, stage);
	}
}

reverseAction = (id, stage) => {
	currentCard.development[id].stages[stage].complete = false;
	if(spendResourcesFlag){
		const req = currentCard.development[id].stages[stage].requires;
	    //SPEND RESOURCES?
	    req.forEach( (requirement) => {
	    	const reqType = requirement.type;
			const reqAmount = requirement.amount;
			currentCard.resources[reqType].value -= reqAmount;
		});
		updateResources(currentCard.resources);
    }
    
    //dev.name + '-' + i;
    const devInput = document.getElementById(currentCard.development[id].name + '-' + stage);
    devInput.checked = false;
    devInput.disabled = false;
    const undoBtn = document.getElementById('undo');
	undoBtn.style.display = 'none';
}