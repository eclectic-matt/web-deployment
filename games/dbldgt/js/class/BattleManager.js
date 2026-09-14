class BattleManager
{
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

	//===================
	// INIT
	//===================
	
	//Just setup initial document references
	constructor()
	{
		//Init references to document
		
		//Explicitly bind the init function context so it preserves 'this' inside promises
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
			
			generateBattle();
			//passDataToLayout(this.#enemyData, 'enemy');
		}
		catch (error)
		{
			console.error("Failed to load JSON file:", error);
		}
	}
	
	init()
	{
    this.initEvents();
	}
	
	
	//===================
	// EVENTS
	//===================

	initEvents()
	{
		
	}
	
	loadBattle(data)
	{
		this.#battleData = data;
	}
	
	generateBattle(type = 'basic', level = 0)
	{
		this.#battleData = {
			enemies: [],
			round: 0
		};
		
		switch(type)
		{
			case 'basic':
			//Same enemy up to (level + 1)
			//let enemyTypeArr = this.#enemyData.enemies.filter((e) => {return e.type == type;});
			let enemyTypeArr = this.#enemyData[type];
			let rndEnemyIndex = Math.floor(Math.random() * enemyTypeArr.length);
			let enemy = enemyTypeArr[rndEnemyIndex];
			for(let i = 0; i < (level + 1); i++)
			{
				this.#battleData.enemies.push(enemy);
			}
			console.log(this.#battleData.enemies);
			break;
		}
	}
	
	outputBattle()
	{
		let section = document.createElement('section');
		section.classList.add('battle');
		//Output enemies row
		let enemyRow = document.createElement('section');
		enemyRow.classList.add('enemy-row');
		let enemies = this.#battleData.enemies;
		for(let i = 0; i < enemies.length; i++)
		{
			let enemyBox = this.getEnemyBox(enemies[i], i);
			enemyRow.appendChild(enemyBox);
		}
		section.appendChild(enemyRow);
		
		//Hands row
		let handsRow = document.createElement('section');
		handsRow.classList.add('hands-row');
		//left
		let leftHand = document.createElement('div');
		leftHand.className = 'hand';
		leftHand.id = 'left-hand-container';
		let leftHandImg = document.createElement('img');
		leftHandImg.src = './assets/img/left_hand.png';
		leftHand.appendChild(leftHandImg);
		handsRow.appendChild(leftHand);
		//right
		let rightHand = document.createElement('div');
		rightHand.className = 'hand';
		rightHand.id = 'left-hand-container';
		let rightHandImg = document.createElement('img');
		rightHandImg.src = './assets/img/right_hand.png';
		rightHand.appendChild(rightHandImg);
		handsRow.appendChild(rightHand);
		section.appendChild(handsRow);
		return section;
	}
	
	getEnemyBox(enemy, index)
	{
		let section = document.createElement('section');
		section.classList.add('enemy-box');
		section.id = 'enemy' + index;
		//Health Bar
		let healthBar = this.createHealthBar(enemy.health.current, enemy.health.max);
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
	
	createHealthBar(currentHealth, maxHealth)
	{
		//Calculate the percentage of remaining health
		const healthPercent = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
		//Create the container element
		const container = document.createElement('div');
		container.className = 'health-bar-container';
		//Set style
		container.style.background = `linear-gradient(to right, #2ecc71 ${healthPercent}%, #e74c3c ${healthPercent}%)`;
		//Create the text overlay (e.g., "20/20")
		const textOverlay = document.createElement('span');
		textOverlay.className = 'health-bar-text';
		textOverlay.textContent = `${currentHealth}/${maxHealth}`;
		container.appendChild(textOverlay);
		return container;
	}
}

class CombatTargetingSystem 
{
	constructor() 
	{
		this.svgCanvas = document.getElementById('drag-line-svg');
		this.dragLine = document.getElementById('active-drag-line');
		
		// Internal state tracking
		this.isDragging = false;
		this.activeSource = null;

		// BIND CONTEXT: Essential for class listeners to access "this" properly
		this.handlePointerDown = this.handlePointerDown.bind(this);
		this.handlePointerMove = this.handlePointerMove.bind(this);
		this.handlePointerUp = this.handlePointerUp.bind(this);

		this.init();
	}

	init() 
	{
		// Attach universal listeners bound directly to class scopes
		document.addEventListener('pointerdown', this.handlePointerDown);
		document.addEventListener('pointermove', this.handlePointerMove);
		document.addEventListener('pointerup', this.handlePointerUp);
	}

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
		if (!handItem) return;

		this.isDragging = true;
		this.activeSource = handItem;
		
		const start = this.getCenterCoords(this.activeSource);
		this.dragLine.setAttribute('d', `M ${start.x} ${start.y} L ${e.clientX} ${e.clientY}`);
		this.dragLine.style.display = 'block';
		
		handItem.setPointerCapture(e.pointerId);
	}

	handlePointerMove(e) 
	{
		if (!this.isDragging || !this.activeSource) return;

		const start = this.getCenterCoords(this.activeSource);
		let targetX = e.clientX;
		let targetY = e.clientY;

		// Snapping magnetism filter
		const targetEnemy = e.target.closest('.enemy-box');
		if (targetEnemy) {
			const enemyCenter = this.getCenterCoords(targetEnemy);
			targetX = enemyCenter.x;
			targetY = enemyCenter.y;
		}

		this.dragLine.setAttribute('d', `M ${start.x} ${start.y} L ${targetX} ${targetY}`);
	}

	handlePointerUp(e) 
	{
		if (!this.isDragging) return;
		this.isDragging = false;

		const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
		const validEnemy = dropTarget ? dropTarget.closest('.enemy-box') : null;

		if (validEnemy && this.activeSource)
		{
			this.createPermanentLink(this.activeSource, validEnemy);
		}

		// Clean up active tracker frame
		this.dragLine.style.display = 'none';
		this.dragLine.setAttribute('d', '');
		
		if (this.activeSource) 
		{
			this.activeSource.releasePointerCapture(e.pointerId);
			this.activeSource = null;
		}
	}

	createPermanentLink(source, enemy)
	{
		//console.log(`Connecting class entities: ${source.id} ➔ ${enemy.id}`);

		const finalLine = this.dragLine.cloneNode(true);
		finalLine.removeAttribute('id');
		finalLine.classList.add('permanent-targeting-link');
		finalLine.id = 'active-drag-line';
		
		// Tag references directly on the element node so you can clean them up later
		finalLine.dataset.sourceId = source.id;
		finalLine.dataset.enemyId = enemy.id;

		const start = this.getCenterCoords(source);
		const end = this.getCenterCoords(enemy);
		finalLine.setAttribute('d', `M ${start.x} ${start.y} L ${end.x} ${end.y}`);
		
		this.svgCanvas.appendChild(finalLine);
		//console.log('Target line created: ',finalLine);

		// OPTIONAL: Call out to outer engine workflow methods if they exist
		if (typeof this.onSuccessfulTarget === 'function') 
		{
			//this.onSuccessfulTarget(source, enemy);
		}
	}

	// Call this if a card or an enemy dies to sweep dead vector paths out of the SVG
	clearLinksForEntity(entityId)
	{
		const links = this.svgCanvas.querySelectorAll(`.permanent-targeting-link`);
		links.forEach(link => {
			if (link.dataset.sourceId === entityId || link.dataset.enemyId === entityId) {
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
}