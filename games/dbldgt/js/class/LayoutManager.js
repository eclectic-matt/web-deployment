class LayoutManager
{
	#screenNames = [
		'mainMenu',
		'about',
		'pauseMenu',
		'test',
		'newGame',
		'map',
		'inventory',
		'battle',
		'battleResult',
		'chest',
		'event',
		'merchant'
	];
	#currentScreen = null;
	#mainElId = 'main';
	#mainEl = null;
	#itemData = null;
	#inventoryTypes = [
		'ring', 
		'bracelet', 
		'held', 
		'tattoo'
	];
	
	constructor()
	{
		this.initLayout();
	}
	
	setItemData(data)
	{
		this.#itemData = data;
		this.loadScreen();
	}

	initLayout()
	{
		this.#currentScreen = this.#screenNames[0];
		this.#mainEl = document.getElementById(this.#mainElId);
	}
	
	setCurrentScreen(name)
	{
		if(!this.#screenNames.includes(name))
		{
			console.log('Screen',name,'not found!');
			return;
		}
		this.#currentScreen = name;
		this.loadScreen();
	}

	loadScreen()
	{
		//TO DO
		//return;
		this.#mainEl.innerHTML = null;
		switch(this.#currentScreen)
		{
			case 'test':
				let testTopMenu = this.generateTopMenu();
				this.#mainEl.appendChild(testTopMenu);
				let testSidePanel = this.generateSidePanel();
				this.#mainEl.appendChild(testSidePanel);
				let gameScaler = document.createElement('section');
				gameScaler.id = 'game-scaler';
				gameScaler.className = 'game-scaler';
				let testHands = this.generateHandsSection();
				//this.#mainEl.appendChild(testHands);
				gameScaler.appendChild(testHands);
				this.#mainEl.appendChild(gameScaler);
				let testItems = this.generateItemsSection();
				this.#mainEl.appendChild(testItems);
				//gameScaler.appendChild(testItems);
				//this.#mainEl.appendChild(gameScaler);
				let testButtons = this.generateButtonsRow();
				this.#mainEl.appendChild(testButtons);
				//Now init drag-drop events
				addItemEvents();
			break;
			case 'mainMenu':
				let mainMenu = this.generateMainMenu();
				this.#mainEl.appendChild(mainMenu);
			break;
			case 'newGame':
				let newGameTopMenu = this.generateTopMenu();
				this.#mainEl.appendChild(newGameTopMenu);
				let newGameMap = this.generateMapSection();
				this.#mainEl.appendChild(newGameMap);
				this.generateMap(newGameMap);
			break;
			case 'about':
				let aboutSection = this.generateAbout();
				this.#mainEl.appendChild(aboutSection);
				break;
			case 'chest':
				let chestSection = this.generateChestScreen();
				this.#mainEl.appendChild(chestSection);
				break;
		}
	}
	
	//===============
	// SECTIONS
	//===============
	generateMainMenu()
	{
		let section = document.createElement('section');
		section.id = 'mainMenu';
		//Logo
		let logoImg = document.createElement('img');
		logoImg.src = './assets/img/dbl_dgt_logo.png';
		section.appendChild(logoImg);
		//Button list
		let buttonsSection = document.createElement('section');
		buttonsSection.className = 'buttons';
		//Test button
		let testButton = document.createElement('button');
		testButton.innerHTML = 'Show Test Screen';
		testButton.className = 'main-menu-button';
		testButton.addEventListener('click', (e) => {
			showScreen('test');
		});
		buttonsSection.appendChild(testButton);
		//New Game
		let newGameButton = document.createElement('button');
		newGameButton.innerHTML = 'New Game';
		newGameButton.className = 'main-menu-button';
		newGameButton.addEventListener('click', (e) => {
			showScreen('newGame');
		});
		buttonsSection.appendChild(newGameButton);
		//About section
		let aboutButton = document.createElement('button');
		aboutButton.innerHTML = 'About';
		aboutButton.className = 'main-menu-button';
		aboutButton.addEventListener('click', (e) => {
			showScreen('about');
		});
		buttonsSection.appendChild(aboutButton);
		//Add buttons list to section
		section.appendChild(buttonsSection);
		return section;
	}

	generateTopMenu()
	{
		let section = document.createElement('section');
		section.id = 'topMenu';
		let backToMenuBtn = document.createElement('button');
		backToMenuBtn.id = 'mainMenuBtn';
		backToMenuBtn.innerHTML = 'Main Menu &#8617;';
		backToMenuBtn.addEventListener('click', (e) => {
			showScreen('mainMenu');
		});
		section.appendChild(backToMenuBtn);
		return section;
	}
	
	generateSidePanel()
	{
		//Main side panel section
		let section = document.createElement('section');
		section.id = 'sidePanel';
		//Score section
		let score = document.createElement('section');
		score.id = 'scoringArea';
		score.className = 'scoring-area';
		//Score table
		let scoreTable = document.createElement('table');
		scoreTable.className = 'score-table';
		let tr = document.createElement('tr');
		//Base Score
		let base = document.createElement('td');
		base.id = 'baseScore';
		base.className = 'score-part';
		base.innerHTML = '0';
		tr.appendChild(base);
		// multiply
		let times = document.createElement('td');
		times.className = 'equation-part';
		times.innerHTML = 'x';
		tr.appendChild(times);
		//Power Score
		let power = document.createElement('td');
		power.id = 'powerScore';
		power.className = 'score-part';
		power.innerHTML = '1';
		tr.appendChild(power);
		// equals
		let equals = document.createElement('td');
		equals.className = 'equation-part';
		equals.innerHTML = '=';
		tr.appendChild(equals);
		//Total Score
		let total = document.createElement('td');
		total.id = 'totalScore';
		total.className = 'score-part';
		total.innerHTML = '0';
		tr.appendChild(total);
		//Join back together
		scoreTable.appendChild(tr);
		score.appendChild(scoreTable);
		section.appendChild(score);
		return section;
	}
	
	generateHandsSection()
	{
		//let gameScaler = document.createElement('section');
		//gameScaler.className = 'game-scaler';

		let section = document.createElement('section');
		section.id = 'hands-section';
		section.className = 'hands-section';

		//Generate hands and hand maps
		for(let i = 0; i < this.#itemData.hands.length; i++)
		{
			//Get hand data
			let hand = this.#itemData.hands[i];
			
			//Output hand wrapper div
			let handWrapperDiv = document.createElement('div');
			handWrapperDiv.className = 'hand-wrapper';
			handWrapperDiv.id = hand.name + '-hand-container';
				
			//Output img
			let handImg = document.createElement('img');
			handImg.src = hand.src;
			handImg.alt = hand.alt;
			handImg.useMap = '#' + hand.usemap;
			handImg.className = hand.class;
			handWrapperDiv.appendChild(handImg);
			
			//Output map
			let handMap = document.createElement('map');
			handMap.name = hand.usemap;
			
			//Output areas
			for(let a = 0; a < hand.areas.length; a++)
			{
				let areaData = hand.areas[a];
				let area = document.createElement('area');
				area.shape = areaData.shape;
				area.coords = areaData.coords;
				area.alt = areaData.alt;
				area.dataset.finger = areaData.finger;
				area.dataset.itemType = areaData.itemType;
				handMap.appendChild(area);
			}
			
			handWrapperDiv.appendChild(handMap);
			section.appendChild(handWrapperDiv);
		}
		//gameScaler.appendChild(section);
		//return gameScaler;
		return section;
	}
	
	generateItemsSection()
	{
		let section = document.createElement('section');
		section.id = 'ring-options';
		section.className = 'ring-options';

		//SPLIT INTO TYPES BASED ON THE itemData.json AND GENERATE EACH SECTION IN TURN?
		for(let typeId = 0; typeId < Object.keys(this.#itemData.items).length; typeId++)
		{
			let typeName = Object.keys(this.#itemData.items)[typeId];
			let typeData = this.#itemData.items[typeName];
			//console.log(typeName, typeData);
			if(typeData.filter(item => { return item.type === typeName; }).length < 1) continue;
			let inventorySection = document.createElement('section');
			inventorySection.id = 'inventory-' + typeName;
			let inventorySectionHeading = document.createElement('h4');
			inventorySectionHeading.innerHTML = typeName.toUpperCase();
			inventorySection.appendChild(inventorySectionHeading);
			let itemWrapContainer = document.createElement('div');
			itemWrapContainer.className = 'item-wrapper-container';
			itemWrapContainer.id = 'inventory-wrapper-' + typeName;
			
			typeData.forEach(item => 
			{
				let itemWrapper = document.createElement("div");
				itemWrapper.classList.add("item-wrapper");

				let itemImg = document.createElement('img');
				itemImg.src = item.icon;
				//Add class '.item'
				itemImg.classList.add('item');
				//Add class '.ring'/'.bracelet' etc
				itemImg.classList.add(item.type);
				itemImg.dataset.itemType = item.type;
				itemImg.draggable = true;
				itemImg.id = item.id;
				itemImg.alt = item.name;
				itemImg.title = item.name;
				itemImg.dataset.rarityName = item.rarity.name;
				itemImg.dataset.rarityMultiplier = item.rarity.multiplier;
				itemImg.dataset.effectValue = item.effect.value;
				itemImg.dataset.effectName = item.effect.name;
				itemImg.dataset.effectOperation = item.effect.operation;
				itemImg.dataset.description = item.name + "<br><br>" + item.effect.description;
				let scoreEl = document.createElement("div");
				scoreEl.classList.add("popup-score");
				itemWrapper.appendChild(scoreEl);
				itemWrapper.appendChild(itemImg);
				itemWrapContainer.appendChild(itemWrapper);
			});

			inventorySection.appendChild(itemWrapContainer);
			section.appendChild(inventorySection);
		}
		return section;
	}
	
	generateButtonsRow()
	{
		let section = document.createElement('section');
		section.id = 'buttonRow';
		let atkBtn = document.createElement('button');
		atkBtn.id = 'btnTestPhysicalAttack';
		atkBtn.innerHTML = 'Physical Attack';
		atkBtn.addEventListener('click', (e) => {
			itemScoring.triggerPhysicalAttack();
		});
		section.appendChild(atkBtn);
		//Magical attack button? Not used
		let magBtn = document.createElement('button');
		magBtn.id = 'btnTestMagicalAttack';
		magBtn.innerHTML = 'Magical Attack';
		section.appendChild(magBtn);
		//Clear hands button 
		let clrBtn = document.createElement('button');
		clrBtn.id = 'btnClearHands';
		clrBtn.innerHTML = 'Clear Hands';
		clrBtn.addEventListener('click', (e) => {
			itemScoring.clearHands();
		});
		section.appendChild(clrBtn);
		return section;
	}
	
	generateMapSection()
	{
		let section = document.createElement('section');
		section.id = 'map';
		section.style.width = '300px';
		section.style.height = '200px'
		return section;
	}
	generateMap(section)
	{
		createMapForTarget(section)
	}
	
	generateAbout()
	{
		let section = document.createElement('section');
		let backToMenuBtn = document.createElement('button');
		backToMenuBtn.id = 'mainMenuBtn';
		backToMenuBtn.innerHTML = 'Main Menu &#8617;';
		backToMenuBtn.addEventListener('click', (e) => {
			showScreen('mainMenu');
		});
		section.appendChild(backToMenuBtn);
		let infoSection = document.createElement('section');
		infoSection.className = 'about';
		infoSection.innerHTML = 'Developed by EclecticMatt ©2026';
		section.appendChild(infoSection);
		return section;
	}
	
	generateChestScreen()
	{
		let section = document.createElement('section');
		section.classList.add('chest');
		let backToMenuBtn = document.createElement('button');
		backToMenuBtn.id = 'mainMenuBtn';
		backToMenuBtn.innerHTML = 'Main Menu &#8617;';
		backToMenuBtn.addEventListener('click', (e) => {
			showScreen('mainMenu');
		});
		section.appendChild(backToMenuBtn);
		//section.innerHTML = '&#1fa8e;';
		let chestLidImg = document.createElement('img');
		chestLidImg.src = './assets/img/chest_lid.png';
		chestLidImg.id = 'chestLid';
		section.appendChild(chestLidImg);
		let chestBaseImg = document.createElement('img');
		chestBaseImg.src = './assets/img/chest_base.png';
		chestBaseImg.id = 'chestBase';
		section.appendChild(chestBaseImg);
		//Get two items to offer
		let items = getItems(0.5,2);
		let optionsSection = document.createElement('section');
		optionsSection.classList.add('chest-options');
		let optionsHead = document.createElement('h4');
    optionsHead.innerHTML = 'Choose 1:';
    optionsSection.appendChild(optionsHead);
    let optionsBoxes = document.createElement('section');
    optionsBoxes.classList.add('chest-options-boxes');
		items.forEach((item) => 
		{
		  let itemBox = document.createElement('section');
		  itemBox.classList.add('item-box');
		  let itemImg = document.createElement('img');
      itemImg.src = item.icon;
      itemBox.appendChild(itemImg);
      //Add line break between img/name?
      itemBox.appendChild(document.createElement('br'));
      let itemName = document.createElement('p');
      itemName.innerHTML = item.name;
      itemBox.appendChild(itemName);
      optionsBoxes.appendChild(itemBox);
		});
		optionsSection.appendChild(optionsBoxes);
		section.appendChild(optionsSection);
		section.addEventListener('click', (e) => {
		  chestBaseImg.classList.add('animate');
		  chestLidImg.classList.add('animate');
		  optionsSection.classList.add('animate');
		});
		return section;
	}

}