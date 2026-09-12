class Session 
{
	inProgress = true;
	currentFloor = 0;
	currentFloorMap = [];
	currentNode = -1;
	inventory = {
		items: [],
		gold: 0,
	};
	hands = {
		left: {},
		right: {}
	};

	constructor()
	{
		this.currentFloor = 0;
		this.currentFloorMap = [];
		this.currentNode = false;
		this.inventory = { items: [], gold: 0 };
		this.hands = { left: {}, right: {} };
		this.inProgress = true;
	}
	
	get currentFloorMap()
	{
	  return this.currentFloorMap;
	}
	set currentFloorMap(map)
	{
	  this.currentFloorMap = map;
	}
	
	get currentFloor()
	{
	  return this.currentFloor;
	}
	set currentFloor(floor)
	{
	  this.currentFloor = floor;
	}
	
	get currentNode()
	{
	  return this.currentNode;
	}
	set currentNode(node)
	{
	  this.currentFloor = node;
	}
}