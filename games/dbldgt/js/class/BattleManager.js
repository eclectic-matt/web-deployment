class BattleManager
{
	#battleType = 'basic';
	#battleLevel = 0;
	#enemyDataJsonPath = './data/enemyData.json';
	#enemyData = null;
	#battleData = {
		enemies: [],
		round: 0
	};
	#battleTypes = [
		'basic',
		'event',
		'boss'
	];
	#player = {
		id: 'player',
		health: {
			current: 100,
			max: 100
		}
	};
	//These are the loop sequence of states
	#battleStates = [
		'playerDecide',
		'playerAct',
		'enemyDecide',
		'enemyAct',
	];
	#currentBattleStateIndex = 0;

	//===================
	// INIT
	//===================
	
	//Just setup initial document references
	constructor(type = 'basic', level = 0)
	{
		this.#battleType = type;
		this.#battleLevel = level;
		
		this.initSVG();
		
		this.svgCanvas = document.getElementById('drag-line-svg');
		this.dragLine = document.getElementById('active-drag-line');
		
		// Internal state tracking
		this.isDragging = false;
		this.activeSource = null;
		this.leftHandTarget = null;
		this.rightHandTarget = null;

		//Setup drag event handlers
		this.handlePointerDown = this.handlePointerDown.bind(this);
		this.handlePointerMove = this.handlePointerMove.bind(this);
		this.handlePointerUp = this.handlePointerUp.bind(this);

		//Load the json data
		this.loadEnemyData().then(this.init.bind(this));
	}
	
	async loadEnemyData()
	{
		try
		{
			const response = await fetch(this.#enemyDataJsonPath);
			
			if (!response.ok)
			{
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			
			this.#enemyData = await response.json();
			
			this.startBattle();
			
			//generateBattle();
			//passDataToLayout(this.#enemyData, 'enemy');
		}
		catch (error)
		{
			console.error("Failed to load JSON file:", error);
		}
	}
	
	init()
	{
		this.#currentBattleStateIndex = 0;
		this.initEvents();
		//console.log(window.innerWidth, window.innerHeight);
		let targetW = 300;
		let targetH = 600;
		this.resizeViewport(targetW, targetH);
	}

	//===================
	// STATE BASED
	//===================
	processState()
	{
		switch(this.#battleStates[this.#currentBattleStateIndex])
		{
			case 'playerDecide':
				//No action needed - the player will target and then click the button
			break;
			case 'playerAct':
				this.useHands();
			break;
			case 'enemyDecide':
				this.enemiesTurn();
			break;
			case 'enemyAct':
				//to do
			break;
		}
		//Increment and wrap around if complete
		this.#currentBattleStateIndex += 1;
		if(this.#currentBattleStateIndex > this.#battleStates.length)
		{
			this.#currentBattleStateIndex = 0;
		}
	}


	
	
	//===================
	// EVENTS
	//===================

	initEvents()
	{
		// Attach universal listeners bound directly to class scopes
		document.addEventListener('pointerdown', this.handlePointerDown);
		document.addEventListener('pointermove', this.handlePointerMove);
		document.addEventListener('pointerup', this.handlePointerUp);
	}
	
	resizeViewport(targetW, targetH)
	{
	  //Set game scaler elemnent
		let scaledEl = document.querySelector('.battle');
		//Skip if not initialized
		if (!scaledEl) return;
		//Calculate view multipliers
		const scaleX = window.innerWidth / targetW;
		const scaleY = window.innerHeight / targetH;
		//Calculate best scale
		let optimalScale = Math.min(scaleX, scaleY);
		//No scaling if already large enough
		if (optimalScale > 1) optimalScale = 1;
		//console.log('optimalScale', optimalScale);
		//Scale element
		scaledEl.style.transform = `scale(${optimalScale})`;
	}
	
	loadBattle(data)
	{
		this.#battleData = data;
	}
	
	generateBattle()
	{
		this.#battleData = {
			enemies: [],
			round: 0
		};
		
		switch(this.#battleType)
		{
			case 'basic':
			//Same enemy up to (level + 1)
			let enemyTypeArr = this.#enemyData[this.#battleType];
			let rndEnemyIndex = Math.floor(Math.random() * enemyTypeArr.length);
			for(let i = 0; i < (this.#battleLevel + 1); i++)
			{
				//Clone the current enemy type object to generate a new unique enemy
				let enemy = structuredClone(enemyTypeArr[rndEnemyIndex]);
				//Set a unique ID for this enemy
				enemy.id = enemy.name.replace(" ","-") + "-" + i;
				enemy.index = i;
				this.#battleData.enemies.push(enemy);
			}
			//console.log(this.#battleData.enemies);
			break;
		}
		
		//console.log('generated', this.#battleData);
	}
	
	outputBattle()
	{
		let section = document.createElement('section');
		section.classList.add('battle');
		section.id = 'battle';

		//Output enemies row
		let enemyRow = document.createElement('section');
		enemyRow.id = 'enemyRow';
		enemyRow.classList.add('enemy-row');
		section.appendChild(enemyRow);
		
		//Hands row
		let handsRow = document.createElement('section');
		handsRow.classList.add('hands-row');
		//left
		let leftHand = document.createElement('div');
		leftHand.classList.add('hand');
		leftHand.classList.add('left');
		leftHand.id = 'left-hand-container';
		let leftHandImg = document.createElement('img');
		leftHandImg.src = './assets/img/left_hand.png';
		leftHand.appendChild(leftHandImg);
		handsRow.appendChild(leftHand);
		//Player targeting element
		let playerTarget = document.createElement('div');
		playerTarget.id = "playerTarget";
		handsRow.appendChild(playerTarget);
		//right
		let rightHand = document.createElement('div');
		rightHand.classList.add('hand');
		rightHand.classList.add('right');
		rightHand.id = 'right-hand-container';
		let rightHandImg = document.createElement('img');
		rightHandImg.src = './assets/img/right_hand.png';
		rightHand.appendChild(rightHandImg);
		handsRow.appendChild(rightHand);
		section.appendChild(handsRow);
		
		let healthBar = this.createHealthBar(this.#player.id, this.#player.health.current, this.#player.health.max);
		section.appendChild(healthBar);
		
		return section;
	}

	outputEnemyRow()
	{
		//Clear any existing row
		let enemyRow = document.getElementById('enemyRow');
		enemyRow.innerHTML = null;
		let enemies = this.#battleData.enemies;
		//console.log(enemies);
		for(let i = 0; i < enemies.length; i++)
		{
			let enemyBox = this.getEnemyBox(enemies[i], enemies[i].index);
			enemyRow.appendChild(enemyBox);
		}
	}
	
	getEnemyBox(enemy, index)
	{
		let section = document.createElement('section');
		section.classList.add('enemy-box');
		section.id = enemy.id;
		//Health Bar
		let healthBar = this.createHealthBar(enemy.id, enemy.health.current, enemy.health.max);
		section.appendChild(healthBar);
		//Enemy Image
		let enemyImg = document.createElement('img');
		enemyImg.src = enemy.icon;
		section.appendChild(enemyImg);
		//Ability Intention
		let abilityIntent = document.createElement('section');
		abilityIntent.innerHTML = 'attack';
		section.appendChild(abilityIntent);
		return section;
	}
	
	createHealthBar(enemyId, currentHealth, maxHealth)
	{
		// 1. Create the base container element (Red by default via CSS)
		const container = document.createElement('div');
		container.id = 'health' + enemyId;
		container.className = 'health-bar-container';
		
		// 2. Create the interactive inner green fill layer
		const fill = document.createElement('div');
		fill.className = 'health-bar-fill';
		
		// Calculate initial fill state percentage
		const healthPercent = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
		fill.style.width = `${healthPercent}%`;
		container.appendChild(fill);
		
		// 3. Create the text overlay string layer
		const textOverlay = document.createElement('span');
		textOverlay.className = 'health-bar-text';
		textOverlay.textContent = `${currentHealth}/${maxHealth}`;
		container.appendChild(textOverlay);
		
		// Attach references directly to the DOM node object so your update script can easily find them
		container._fillEl = fill;
		container._textEl = textOverlay;
		container._maxHealth = maxHealth;
		
		return container;
	}

	updateHealthBar(enemyId, newHealth)
	{
		let barContainer = document.getElementById('health' + enemyId);

		if (!barContainer || !barContainer._fillEl) return;
		
		const maxHealth = barContainer._maxHealth;
		const healthPercent = Math.max(0, Math.min(100, (newHealth / maxHealth) * 100));
		
		// 1. Update the green bar width. CSS handles the 1-second transition slide smoothly!
		barContainer._fillEl.style.width = `${healthPercent}%`;
		
		// 2. Update the text string layout value instantly
		barContainer._textEl.textContent = `${newHealth}/${maxHealth}`;
	}
	
	
	startBattle() 
	{
		let main = document.getElementById('main');
		
		//Clear any previous battle
		let oldBtlSec = document.getElementById('battle');
		if(oldBtlSec)
		{
			main.removeChild(oldBtlSec);
		}
		let oldBtnRow = document.getElementById('battleButtonRow');
		if(oldBtnRow)
		{
			main.removeChild(oldBtnRow);
		}
		
		//main.innerHTML = null;
		this.resetPlayerHealth();
		//let enemyCountMinusOne = 3;
		//this.generateBattle('basic', enemyCountMinusOne);
		this.generateBattle();
		let btlSec = this.outputBattle();
		main.appendChild(btlSec);
		let enemyRow = this.outputEnemyRow();
		//Generate a button row
		let btnRow = document.createElement('section');
		btnRow.id = 'battleButtonRow';
		btnRow.classList.add('button-row');
		//Output a "clear" button
		let clearLinesBtn = document.createElement('button');
		clearLinesBtn.innerHTML = 'Clear Targets';
		clearLinesBtn.addEventListener('click', (e) => 
		{
			this.clearTargetLines();
		});
		btnRow.appendChild(clearLinesBtn);
		//Output an "Use Hands" button
		let useHandsBtn = document.createElement('button');
		useHandsBtn.id = 'useHandsBtn';
		useHandsBtn.innerHTML = 'Use hands (no attacks)';
		useHandsBtn.addEventListener('click', (e) => 
		{
			this.useHands();
		});
		btnRow.appendChild(useHandsBtn);
		//Output an "Generate" button
		let genBtlBtn = document.createElement('button');
		genBtlBtn.innerHTML = 'Generate Enemies';
		genBtlBtn.addEventListener('click', (e) =>
		{
			this.startBattle();
		});
		btnRow.appendChild(genBtlBtn);
		main.appendChild(btnRow);
	}
	
	
	
	
	
	
	initSVG()
	{
    // Define the required SVG Namespace URI
    const svgNS = "http://www.w3.org/2000/svg";

    // Full screen transparent layer for vector drawing
    let svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id', 'drag-line-svg');
    svg.setAttribute('xmlns', svgNS);
    
    // Marker definitions
    let defs = document.createElementNS(svgNS, 'defs');

    // Reusable white arrowhead border
    let arrowBorderMarker = document.createElementNS(svgNS, 'marker');
    arrowBorderMarker.setAttribute('id', 'arrow-border');
    arrowBorderMarker.setAttribute('viewBox', '0 0 10 10');
    arrowBorderMarker.setAttribute('refX', '5');
    arrowBorderMarker.setAttribute('refY', '5');
    arrowBorderMarker.setAttribute('markerWidth', '2');
    arrowBorderMarker.setAttribute('markerHeight', '2');
    arrowBorderMarker.setAttribute('orient', 'auto-start-reverse');

    // Arrowhead border path
    let arrowBorderPath = document.createElementNS(svgNS, 'path');
    arrowBorderPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    arrowBorderPath.setAttribute('fill', '#ffffff');

    arrowBorderMarker.appendChild(arrowBorderPath);
    defs.appendChild(arrowBorderMarker);

    // Reusable primary color arrowhead tip
    let arrowTipMarker = document.createElementNS(svgNS, 'marker');
    arrowTipMarker.setAttribute('id', 'arrow-tip');
    arrowTipMarker.setAttribute('viewBox', '0 0 10 10');
    arrowTipMarker.setAttribute('refX', '6');
    arrowTipMarker.setAttribute('refY', '5');
    arrowTipMarker.setAttribute('markerWidth', '2');
    arrowTipMarker.setAttribute('markerHeight', '2');
    arrowTipMarker.setAttribute('orient', 'auto-start-reverse');

    // Tip path
    let arrowTipPath = document.createElementNS(svgNS, 'path');
    arrowTipPath.setAttribute('d', 'M 0 1 L 10 5 L 0 9 z');
    arrowTipPath.setAttribute('fill', '#ffff22');

    arrowTipMarker.appendChild(arrowTipPath);
    defs.appendChild(arrowTipMarker);

    svg.appendChild(defs);

    // Grouped path stack
    let activeTargetGroup = document.createElementNS(svgNS, 'g');
    activeTargetGroup.setAttribute('id', 'active-targeting-group');

    let lineBorderPath = document.createElementNS(svgNS, 'path');
    lineBorderPath.setAttribute('class', 'line-border');
    lineBorderPath.setAttribute('d', '');
    activeTargetGroup.appendChild(lineBorderPath);

    let lineDashColor1 = document.createElementNS(svgNS, 'path');
    lineDashColor1.setAttribute('class', 'line-dash-color1');
    lineDashColor1.setAttribute('d', '');
    activeTargetGroup.appendChild(lineDashColor1);

    let lineDashColor2 = document.createElementNS(svgNS, 'path');
    lineDashColor2.setAttribute('class', 'line-dash-color2');
    lineDashColor2.setAttribute('d', '');
    activeTargetGroup.appendChild(lineDashColor2);
    
    svg.appendChild(activeTargetGroup);

    // The dynamic path element
    let activeTargetLine = document.createElementNS(svgNS, 'path');
    activeTargetLine.setAttribute('id', 'active-drag-line');
    activeTargetLine.setAttribute('d', '');
    svg.appendChild(activeTargetLine);

    //document.body.appendChild(svg);
    document.body.prepend(svg);
	}


	//======================
	// Drag target methods
	//======================
	
	// Helper method to pull precise element bounds
	getCenterCoords(element)
	{
		const rect = element.getBoundingClientRect();
		return {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2
		};
	}
	
	handlePointerDown(e)
	{
		const handItem = e.target.closest('.hand');
		if (!handItem) 
		{
			return;
		}
		
		this.isDragging = true;
		this.activeSource = handItem;
		
		const start = this.getCenterCoords(this.activeSource);
		const pathData = `M ${start.x} ${start.y} L ${e.clientX} ${e.clientY}`;
		
		// Target the entire group wrapper to show it
		const group = document.getElementById('active-targeting-group');
		if (group)
		{
			group.setAttribute('style', 'display: block;');
			//group.style.display = 'block';
			group.querySelectorAll('path').forEach((path) => 
			{
				path.setAttribute('d', pathData);
			});
		}
		
		handItem.setPointerCapture(e.pointerId);
	}
	
	handlePointerMove(e)
	{
		if (!this.isDragging || !this.activeSource) 
		{
			return;
		}
		
		const start = this.getCenterCoords(this.activeSource);
		let targetX = e.clientX;
		let targetY = e.clientY;
		
		// Snapping magnetism filter
		const targetEnemy = e.target.closest('.enemy-box');
		if (targetEnemy) 
		{
			const enemyCenter = this.getCenterCoords(targetEnemy);
			targetX = enemyCenter.x;
			targetY = enemyCenter.y;
		}
		
		const pathData = `M ${start.x} ${start.y} L ${targetX} ${targetY}`;

		const group = document.getElementById('active-targeting-group');
		if (group)
		{
			//group.style.display = 'block';
			group.setAttribute('style', 'display: block;');
			group.querySelectorAll('path').forEach((path) => 
			{
				path.setAttribute('d', pathData);
			});
		}
	}
	
	handlePointerUp(e)
	{
		if (!this.isDragging) 
		{
			return;
		}
		this.isDragging = false;
		
		const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
		const validEnemy = dropTarget ? dropTarget.closest('.enemy-box') : null;
		
		// Only allow 1 targeting link per hand (each hand can target a single enemy)
		if (this.activeSource.classList.contains('left'))
		{
			if (this.leftHandTarget !== null)
			{
				this.clearLinksForEntity(this.activeSource.id);
			}
			
			if (validEnemy)
			{
				this.leftHandTarget = validEnemy.id;
			}
			else
			{
				this.leftHandTarget = null;
			}
		}
		else
		{
			if (this.rightHandTarget !== null)
			{
				this.clearLinksForEntity(this.activeSource.id);
			}
			
			if (validEnemy)
			{
				this.rightHandTarget = validEnemy.id;
			}
			else
			{
				this.rightHandTarget = null;
			}
		}
		
		if (validEnemy && this.activeSource)
		{
			this.createPermanentLink(this.activeSource, validEnemy);
		}

		//Also update the button
		if(this.leftHandTarget && this.rightHandTarget)
		{
			this.updateHandsButton(2);
		}
		else if (this.leftHandTarget || this.rightHandTarget){
			this.updateHandsButton(1);
		}
		else
		{
			this.updateHandsButton(0);
		}
		
		// Clean up active tracker group frame
		const group = document.getElementById('active-targeting-group');
		if (group)
		{
			//group.style.display = 'none';
			group.setAttribute('style', 'display: block;');
			group.querySelectorAll('path').forEach((path) => 
			{
				path.setAttribute('d', '');
			});
		}
		
		if (this.activeSource)
		{
			this.activeSource.releasePointerCapture(e.pointerId);
			this.activeSource = null;
		}
	}

	updateHandsButton(targetCount = 0)
	{
		let handsMsg = 'Use Hands';
		if(targetCount === 0)
		{
			handsMsg += ' (no attacks)';
		}
		else if(targetCount === 1)
		{
			if(this.leftHandTarget != null)
			{
				handsMsg += ' (left hand attack)';
			}
			else if(this.rightHandTarget != null)
			{
				handsMsg += ' (right hand attack)';
			}
		}
		else
		{
			handsMsg += ' (both hands attack)';
		}

		document.getElementById('useHandsBtn').innerHTML = handsMsg;
	}
	
	createPermanentLink(source, enemy, amount = null)
	{
		const activeGroup = document.getElementById('active-targeting-group');
		if (!activeGroup) 
		{
			return;
		}

		//Clone the whole multi-layered SVG group instead of a single path line
		const finalGroup = activeGroup.cloneNode(true);
		finalGroup.removeAttribute('id');
		finalGroup.classList.add('permanent-targeting-link');
    finalGroup.setAttribute('style', 'display: block;');
		//Tag references directly on the element group node so you can clean them up later
		//finalGroup.dataset.sourceId = source.id;
		//finalGroup.dataset.enemyId = enemy.id;
		finalGroup.setAttribute('data-source-id', source.id);
		finalGroup.setAttribute('data-enemy-id', enemy.id);
		
		const start = this.getCenterCoords(source);
		const end = this.getCenterCoords(enemy);
		const pathData = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
		
		//Update all subpaths within the cloned group to stay locked onto centers
		finalGroup.querySelectorAll('path').forEach((path) => 
		{
			path.setAttribute('d', pathData);
		});

		//If amount passed in to show damage value
		if (amount !== null)
		{
			const midX = (start.x + end.x) / 2;
			const midY = (start.y + end.y) / 2;

			const svgNS = "http://www.w3.org/2000/svg";

			const badgeGroup = document.createElementNS(svgNS, "g");
			badgeGroup.classList.add("path-amount-badge");
			badgeGroup.setAttribute("transform", `translate(${midX}, ${midY})`);

			//Create text element layout definitions
			const text = document.createElementNS(svgNS, "text");
			text.textContent = amount;
			text.setAttribute("fill", "#ffffff");
			text.setAttribute("font-weight", "bold");
			text.setAttribute("font-size", "24px");
			text.setAttribute("font-family", "Arial, sans-serif");
			text.setAttribute("text-anchor", "middle");
			text.setAttribute("dominant-baseline", "central"); 
			text.setAttribute("style", "user-select: none; pointer-events: none;");

			//Create the background box container layer definition
			const rect = document.createElementNS(svgNS, "rect");
			rect.setAttribute("fill", "#af0000"); 
			rect.setAttribute("stroke", "#ffffff");
			rect.setAttribute("stroke-width", "1");
			rect.setAttribute("rx", "4"); 
			rect.setAttribute("ry", "4");
			rect.setAttribute("style", "pointer-events: none;");

			//Append text first ONLY to allow measurement engine to calculate bounds
			badgeGroup.appendChild(text);
			finalGroup.appendChild(badgeGroup);
			this.svgCanvas.appendChild(finalGroup); 
			
			//Default fallback layout box sizing parameters
			let rectWidth = 40;
			let rectHeight = 20;

			//Read real-time text measurements safely
			if (typeof text.getBBox === 'function')
			{
				const textBounds = text.getBBox();
				const padX = 24; 
				const padY = 18;  
				
				rectWidth = textBounds.width + padX;
				rectHeight = textBounds.height + padY;
			}

			//Apply the dimensions to the rectangle element
			rect.setAttribute("x", (-rectWidth / 2).toString());
			rect.setAttribute("y", (-rectHeight / 2).toString());
			rect.setAttribute("width", rectWidth.toString());
			rect.setAttribute("height", rectHeight.toString());

			//Insert the rectangle *BEFORE* the text in the DOM tree hierarchy layer
			//This moves the background box underneath the text so the font content shows on top
			badgeGroup.insertBefore(rect, text);

			return; 
		}
		
		this.svgCanvas.appendChild(finalGroup);
	}

	clearLinksForEntity(entityId)
	{
		const links = this.svgCanvas.querySelectorAll('.permanent-targeting-link');
		links.forEach((link) => 
		{
			let sourceId = link.getAttribute('data-source-id');
			let enemyId = link.getAttribute('data-enemy-id');
		
		if (sourceId === entityId || enemyId === entityId)
			{
				link.remove();
			}
		});
	}
	
	// Call this if the combat screen unmounts/destroys to prevent memory leaks
	destroy()
	{
		document.removeEventListener('pointerdown', this.handlePointerDown);
		document.removeEventListener('pointermove', this.handlePointerMove);
		document.removeEventListener('pointerup', this.handlePointerUp);
	}

	removeDamageClasses = () => 
	{
		document.querySelectorAll('.enemy-box').forEach((el) => 
		{
			el.classList.remove('damaged');
		});
	}
	
	removeActingClasses = () => 
	{
		this.clearTargetLines();
		document.querySelectorAll('.enemy-box').forEach((el) => 
		{
			el.classList.remove('acting');
		});
	}
	
	clearTargetLines = () => 
	{
		document.querySelectorAll('.permanent-targeting-link').forEach((line) =>
		{
			line.parentElement.removeChild(line);
		});
		this.updateHandsButton(0);
	}

	//====================
	// BATTLE ACTIONS
	//====================
	//Trigger both hand effects (attack their current targets or block/other)
	useHands()
	{
		const attackDamage = 10;
		//Left hand effect
		if (this.leftHandTarget != null)
		{
			//Attack the left hand target
			this.attackEnemy(this.leftHandTarget, attackDamage);
			this.leftHandTarget = null;
		}
		if (this.rightHandTarget != null)
		{
			this.attackEnemy(this.rightHandTarget, attackDamage);
			this.rightHandTarget = null;
		}

		//Clear targets and target lines
		document.querySelectorAll('.permanent-targeting-link').forEach((line) =>
		{
			line.parentElement.removeChild(line);
		});
		
		//Enemy turn after 2s delay
		setTimeout(() => 
		{
			//Enemies attack back
			this.enemiesTurn();
		}, 2000);
	}

	//Attack the enemy with ID by the amount specified,
	attackEnemy(id, amount)
	{
		let enemy = this.#battleData.enemies.find(
			(e) => { return e.id == id; }
		);
		//console.log(enemy);
		let damagedEnemies = [];
		//Apply block/shield effects first
		enemy.health.current -= amount;
		if(enemy.health.current <= 0)
		{
			//Enemy dies - remove from the enemies list
			this.#battleData.enemies = this.#battleData.enemies.filter( 
				(e) => { return e.id != id; }
			);
			let enemyBox = document.getElementById(enemy.id);
			enemyBox.parentElement.removeChild(enemyBox);
		}
		else
		{
			this.updateHealthBar(enemy.id, enemy.health.current);
			damagedEnemies.push(enemy.id);
		}
		if(this.#battleData.enemies.length === 0)
		{
			//alert("You win the battle!");
			setTimeout(advanceSession, 5000);
		}
		//Redraw enemy row to apply visual changes
		//this.outputEnemyRow();
		//Now apply damage effects on newly-created enemy boxes
		damagedEnemies.forEach((id) => {
			document.getElementById(id).classList.add('damaged');
		});
		setTimeout(() => { this.removeDamageClasses}, 2000);
	}
	
	enemiesTurn()
	{
		const attackDelayMs = 1000;
		let playerTargetEl = document.getElementById('playerTarget');
		this.#battleData.enemies.forEach((enemy, i) => 
		{
			let attack = enemy.abilities[0];
			let atkValue = attack.value;
			let enemyEl = document.getElementById(enemy.id);
			setTimeout(() => 
				{
					this.createPermanentLink(enemyEl, playerTargetEl, atkValue);
					this.attackPlayer(enemy.id, atkValue);
				},
				i * attackDelayMs
			);
		});
		setTimeout(() => {this.removeActingClasses()}, (this.#battleData.enemies.length + 1) * attackDelayMs);
	}
	
	attackPlayer(enemyId, amount)
	{
		//If player is already defeated, just clean up
		if(this.#player.health.current <= 0)
		{
			this.clearLinksForEntity(enemyId);
			return;
		}
		document.getElementById(enemyId).classList.add('acting');
		this.#player.health.current -= amount;
		this.updateHealthBar(this.#player.id, this.#player.health.current);
		setTimeout(() => 
			{
				this.clearLinksForEntity(enemyId);
				if(this.#player.health.current <= 0)
				{
					alert('You lost the battle!');
				}
			},
			500
		);
	}
	
	resetPlayerHealth()
	{
		this.#player.health.current = this.#player.health.max;
		this.updateHealthBar(this.#player.id, this.#player.health.current);
	}
}