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
	    let enemyBox = this.getEnemyBox(enemies[i]);
	    enemyRow.appendChild(enemyBox);
	  }
	  section.appendChild(enemyRow);
	  return section;
	}
	
	getEnemyBox(enemy)
	{
	  let section = document.createElement('section');
	  section.classList.add('enemy-box');
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