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
		achievements: []
	}

	constructor()
	{
		// Load saved data
		this.#saveData = loadFromSavedData();
		if(this.#saveData == {})
		{

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