/**
 * The Game class holds saved data, stats, achievements between games.
 * Use the Session class for one instance of a game (one run).
 */
class Game 
{
	#saveName = "HandsCrawlerData";
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
	}

	constructor()
	{
		// Load saved data
		this.#saveData = loadFromSavedData();
		if(this.#saveData == {})
		{
			this.#saveData = this.#defaultData;
		}
		else
		{
			if(this.#saveData.currentSession?.InProgress === true)
			{
				//Load session in progress
			}
		}
	}

	saveData(data)
	{
		saveLocalStorageItem(this.#saveName, JSON.stringify(data));
	}

	loadData()
	{
		let savedData = loadLocalStorageItem(this.#saveName);
		if(savedData)
		{
			return savedData;
		}
		return {};
	}
}