class LayoutManager
{
	#screenNames = [
		"mainmenu",
		"pausemenu",
	  "test",
		"map",
		"inventory",
		"battle",
		"battleResult",
		"chest",
		"event",
		"merchant"
	];
	#currentScreen = null;
	#mainElId = 'main';
	#mainEl = null;
	#itemData = null;
	#inventoryTypes = ['ring', 'bracelet', 'held', 'tattoo'];
	
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
	  if(!this.#screenNames.includes(name)){
	    console.log('Screen',name,'not found!');
	    return;
	  }
	  this.#currentScreen = name;
	  this.loadScreen();
	}

	loadScreen()
	{
	  //TO DO
	  return;
	  this.#mainEl.innerHTML = null;
		switch(this.#currentScreen)
		{
		  case "test":
		    let topMenu = this.generateTopMenu();
		    this.#mainEl.appendChild(topMenu);
		    let sidePanel = this.generateSidePanel();
		    this.#mainEl.appendChild(sidePanel);
		    let hands = this.generateHandsSection();
		    this.#mainEl.appendChild(hands);
		    let items = this.generateItemsSection();
		    this.#mainEl.appendChild(items);
		    let buttons = this.generateButtonsRow();
		    this.#mainEl.appendChild(buttons);
		  break;
			case "menu":

			break;
		}
	}
	
	//===============
	// SECTIONS
	//===============
	generateTopMenu()
	{
	  let section = document.createElement('section');
	  section.id = 'topMenu';
	  let backToMenuBtn = document.createElement('button');
	  backToMenuBtn.id = 'mainMenuBtn';
	  backToMenuBtn.addEventListener('click', (e) => {
	    showScreen('menu');
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
  	let section = document.createElement('section');
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
			//document.getElementById(this.#handsSectionElementId).appendChild(handWrapperDiv);
			section.appendChild(handWrapperDiv);
		}
		return section;
  }
	
	generateItemsSection()
	{
		let section = document.createElement('section');
		
		//Generate example item data
		let itemInfo = this.#itemData.items.rings;
			
		//Create inventory sections
		for(let i = 0; i < this.#inventoryTypes.length; i++)
		{
			let typeName = this.#inventoryTypes[i];
			//Skip type if not found
			if(itemInfo.filter(r => { return r.type === typeName; }).length < 1) continue;
			let inventorySection = document.createElement('section');
			inventorySection.id = 'inventory-' + typeName;
			let inventorySectionHeading = document.createElement('h4');
			inventorySectionHeading.innerHTML = typeName.toUpperCase();
			inventorySection.appendChild(inventorySectionHeading);
			let itemWrapContainer = document.createElement('div');
			itemWrapContainer.className = 'item-wrapper-container';
			itemWrapContainer.id = 'inventory-wrapper-' + typeName;
			inventorySection.appendChild(itemWrapContainer);
			//this.#ringOptionsAreaEl.appendChild(inventorySection);
			section.appendChild(inventorySection);
		}
			
		itemInfo.forEach(r => 
		{
			let itemWrapper = document.createElement("div");
			itemWrapper.classList.add("item-wrapper");
			  
			let itemImg = document.createElement('img');
			itemImg.src = r.icon;
			//ringImg.className = this.#ringItemsClassName;
			//Add class '.item'
			itemImg.classList.add('item');
			//Add class '.ring'/'.bracelet' etc
			itemImg.classList.add(r.type);
			itemImg.dataset.itemType = r.type;
			itemImg.draggable = true;
			itemImg.id = r.id;
			itemImg.alt = r.name;
			itemImg.title = r.name;
			itemImg.dataset.rarityName = r.rarity.name;
			itemImg.dataset.rarityMultiplier = r.rarity.multiplier;
			itemImg.dataset.effectValue = r.effect.value;
			itemImg.dataset.effectName = r.effect.name;
			itemImg.dataset.effectOperation = r.effect.operation;
			itemImg.dataset.description = r.name + "<br><br>" + r.effect.description;
			let scoreEl = document.createElement("div");
		  scoreEl.classList.add("popup-score");
		  itemWrapper.appendChild(scoreEl);
		  itemWrapper.appendChild(itemImg);
		    
			//document.getElementById('inventory-wrapper-' + r.type).appendChild(itemWrapper);
			section.appendChild(itemWrapper);
		});
		return section;
	}
	
	generateButtonsRow()
	{
	  let section = document.createElement('section');
	  section.id = 'buttonRow';
	  let atkBtn = document.createElement('button');
	  atkBtn.id = 'btnTestPhysicalAttack';
	  section.appendChild(atkBtn);
	  //Magical attack button? Not used
	  let magBtn = document.createElement('button');
	  magBtn.id = 'btnTestMagicalAttack';
	  section.appendChild(magBtn);
	  //Clear hands button 
	  let clrBtn = document.createElement('button');
	  clrBtn.id = 'btnClearHands';
	  section.appendChild(clrBtn);
	  return section;
	}
}