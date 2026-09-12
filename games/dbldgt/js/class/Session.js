class Session 
{
	currentFloor = 0;
	currentFloorMap = [];
	currentNode = false;
	inventory = {
		items: [],
		gold: 0,
	};
	hands = {
		left: {},
		right: {}
	};
	inProgress = true;

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