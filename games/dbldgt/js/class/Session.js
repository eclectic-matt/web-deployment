class Session 
{
	InProgress = true;
	#currentFloor = 0;
	#currentFloorMap = {};
	#currentNode = -1;
	#inventory = {
		items: [],
		gold: 0,
	};
	#hands = {
		left: {},
		right: {}
	};

	constructor()
	{
		this.#currentFloor = 0;
		this.#currentFloorMap = {};
		this.#currentNode = -1;
		this.#inventory = { items: [], gold: 0 };
		this.#hands = { left: {}, right: {} };
		this.InProgress = true;
	}
}