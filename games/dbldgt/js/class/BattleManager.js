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
	#player = {
	  id: 'player',
	  health: {
	    current: 100,
	    max: 100
	  }
	};

	//===================
	// INIT
	//===================
	
	//Just setup initial document references
	constructor()
	{
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
		console.log(window.innerWidth, window.innerHeight);
		let targetW = 300;
		let targetH = 600;
		this.resizeViewport(targetW, targetH);
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
		console.log('optimalScale', optimalScale);
		//Scale element
		scaledEl.style.transform = `scale(${optimalScale})`;
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
			for(let i = 0; i < (level + 1); i++)
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
		console.log(enemies);
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
			group.style.display = 'block';
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
			group.style.display = 'block';
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
		
		// Clean up active tracker group frame
		const group = document.getElementById('active-targeting-group');
		if (group)
		{
			group.style.display = 'none';
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
	
	createPermanentLink(source, enemy)
	{
		const activeGroup = document.getElementById('active-targeting-group');
		if (!activeGroup) 
		{
			return;
		}

		// FIXED: Clone the whole multi-layered SVG group instead of a single path line
		const finalGroup = activeGroup.cloneNode(true);
		finalGroup.removeAttribute('id');
		finalGroup.classList.add('permanent-targeting-link');
		
		// Tag references directly on the element group node so you can clean them up later
		finalGroup.dataset.sourceId = source.id;
		finalGroup.dataset.enemyId = enemy.id;
		
		const start = this.getCenterCoords(source);
		const end = this.getCenterCoords(enemy);
		const pathData = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
		
		// Update all subpaths within the cloned group to stay locked onto centers
		finalGroup.querySelectorAll('path').forEach((path) => 
		{
			path.setAttribute('d', pathData);
		});
		
		this.svgCanvas.appendChild(finalGroup);
	}

	clearLinksForEntity(entityId)
	{
		const links = this.svgCanvas.querySelectorAll('.permanent-targeting-link');
		links.forEach((link) => 
		{
			if (link.dataset.sourceId === entityId || link.dataset.enemyId === entityId) 
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

	//====================
	// BATTLE ACTIONS
	//====================
	//Trigger both hand effects (attack their current targets or block/other)
	useHands()
	{
		const attackDamage = 10;
		//Left hand effect
		if(this.leftHandTarget != null)
		{
			//Attack the left hand target
			this.attackEnemy(this.leftHandTarget, attackDamage);
			this.leftHandTarget = null;
		}
		if(this.rightHandTarget != null)
		{
			this.attackEnemy(this.rightHandTarget, attackDamage);
			this.rightHandTarget = null;
		}

		//Clear targets and target lines
		document.querySelectorAll('.permanent-targeting-link').forEach((line) =>
		{
			line.parentElement.removeChild(line);
		});
		
		//Enemies attack back
		this.enemiesTurn();
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
			alert("You win the battle!");
		}
		//Redraw enemy row to apply visual changes
		//this.outputEnemyRow();
		//Now apply damage effects on newly-created enemy boxes
		damagedEnemies.forEach((id) => {
			document.getElementById(id).classList.add('damaged');
		});
		setTimeout(removeDamageClasses, 2000);
	}
	
	enemiesTurn()
	{
	  this.#battleData.enemies.forEach((enemy, i) => {
	    let attack = enemy.abilities[0];
	    let atkValue = attack.value;
	    setTimeout(() => {
	      this.attackPlayer(enemy.id, atkValue);
	    }, i * 1000);
	  });
	  setTimeout(removeActingClasses, 3000);
	}
	
	attackPlayer(enemyId, amount)
	{
	  document.getElementById(enemyId).classList.add('acting');
	  this.#player.health.current -= amount;
	  if(this.#player.health.current <= 0)
	  {
	    alert('You lost the battle!');
	  }
	  else
	  {
	    this.updateHealthBar(this.#player.id, this.#player.health.current);
	  }
	}
	
	resetPlayerHealth()
	{
	  this.#player.health.current = this.#player.health.max;
	  this.updateHealthBar(this.#player.id, this.#player.health.current);
	}
}