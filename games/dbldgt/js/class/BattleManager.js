class BattleManager
{
  #enemyDataJsonPath = './data/enemyData.json';
  #enemyData = null;
  

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
			
			passDataToLayout(this.#enemyData, 'enemy');
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

}