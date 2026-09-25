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
		this.hands = { 
			left: {
				held: null,
				pinky: null,
				ring: null,
				middle: null,
				index: null,
				thumb: null,
				tattoo: null,
				bracelet: null
			}, 
			right: {
				held: null,
				pinky: null,
				ring: null,
				middle: null,
				index: null,
				thumb: null,
				tattoo: null,
				bracelet: null
			} 
		};
		this.inProgress = true;
	}
	
	//currentFloorMap methods
	get currentFloorMap()
	{
	  return this.currentFloorMap;
	}
	set currentFloorMap(map)
	{
	  this.currentFloorMap = map;
	}
	
	//currentFloor methods
	get currentFloor()
	{
	  return this.currentFloor;
	}
	set currentFloor(floor)
	{
	  this.currentFloor = floor;
	}
	
	//currentNode methods
	get currentNode()
	{
	  return this.currentNode;
	}
	set currentNode(node)
	{
	  this.currentNode = node;
	}
	
	//inventory methods
	get inventory()
	{
	  return this.inventory;
	}
	set inventory(newInventory)
	{
	  this.inventory = newInventory;
	}
	get items()
	{
	  return this.inventory.items;
	}
	set items(newItems)
	{
	  this.inventory.items = newItems;
	}
	get gold()
	{
	  return this.inventory.gold;
	}
	set gold(newAmount)
	{
	  this.inventory.gold = newAmount;
	}
	addItemToInventory(item)
	{
	  this.inventory.items.push(item);
	}
	removeItemFromInventory(item)
	{
	  let invIndex = this.inventory.items.indexOf(item);
	  this.inventory.items.splice(invIndex, 1);
	}
	inventoryHasItem(item)
	{
	  let invIndex = this.inventory.items.indexOf(item);
	  if(invIndex !== false)
	  {
	    return true;
	  }
	  return false;
	}
	addGoldToInventory(amount)
	{
	  this.inventory.gold += amount;
	  return this.inventory.gold;
	}
	removeGoldFromInventory(amount)
	{
	  if(amount > this.inventory.gold)
	  {
	    return false;
	  }
	  else
	  {
	    this.inventory.gold -= amount;
	    return this.inventory.gold;
	  }
	}
	
	//hand slot methods
	get hands()
	{
	  return this.hands;
	}
	set hands(newHands)
	{
	  this.hands = newHands;
	}
	setItemToSlot(item, slot)
	{
	  let slotData = slot.split('-');
	  let handName = slotData[0];
	  let handSlot = slotData[1];
	  this.hands[handName][handSlot] = item;
	}
	clearItemSlot(slot)
	{
	  let slotData = slot.split('-');
	  let handName = slotData[0];
	  let handSlot = slotData[1];
	  this.hands[handName][handSlot] = null;
	}
	
}