/**
 * The Game class holds saved data, stats, achievements between games.
 * Use the Session class for one instance of a game (one run).
 */
class Game 
{
	#saveName = "DblDgtData";
	#saveData = {};
	#defaultData = {
		stats: {
			runCount: 0,
			highestFloor: 0,
			highestScore: 0,
			lastRunStarted: ""
		},
		runs: [],
		achievements: [],
		currentSession: null
	};
	stats = {
		runCount: 0,
		highestFloor: 0,
		highestScore: 0,
		lastRunStarted: ""
	};
	runs = [];
	achievements = [];
	currentSession = null;

	constructor()
	{
		// Load saved data
		this.#saveData = this.loadData();
		if(this.#saveData == {})
		{
			this.#saveData = this.#defaultData;
		}
		else
		{
			if(this.#saveData.currentSession?.inProgress === true)
			{
				//Load session in progress
			}
		}
	}
	
	get currentSession()
	{
	  return this.currentSession;
	}

	saveData(data)
	{
		this.saveLocalStorageItem(this.#saveName, JSON.stringify(data));
	}

	loadData()
	{
		let savedData = this.loadLocalStorageItem(this.#saveName);
		if(savedData)
		{
			return savedData;
		}
		return {};
	}
	
	loadLocalStorageItem(name)
	{
	  return false;
	}
	
	saveLocalStorageItem(name, data)
	{
	  
	}
}