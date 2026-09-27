// Instantiate the application scope
const itemUi = new ItemMapUi();
const itemScoring = new ItemScoring();
const layoutMgr = new LayoutManager();
const mapGenerator = new MapGenerator();

//Game is for save/load and stats/achievements
const game = new Game();

//Session is the current game session/run
var session;

//If there is a current session in progress
if (game.currentSession !== null)
{
	session = game.currentSession;
}
else
{
  session = new Session();
}

//Utility methods
const showScreen = (name) => 
{
	layoutMgr.setCurrentScreen(name);
}

const passDataToLayout = (data, type) => 
{
	switch(type)
	{
		case 'item':
			layoutMgr.setItemData(data);
			break;
		case 'enemy':
			layoutMgr.setEnemyData(data);
			break;
	}
}

const addItemEvents = () => 
{
	itemUi.init();
	itemUi.resizeGameViewport();
}

const createMapForTarget = (target) => 
{
	//If no current floor map
	if(session.currentFloorMap.length === 0)
	{
		//Generate a new map
		let map = mapGenerator.generateMap();
		//Store map
		session.currentFloorMap = map;
	}
	//Output current floor map
	mapGenerator.outputMap(target, session.currentFloorMap, session.currentNode);
}

const Rooms = Object.freeze
({
	CHEST: 0,
	BATTLE: 1,
	EVENT: 2,
	SHOP: 3,
	BLACKSMITH: 4,
	CAMPFIRE: 5,
	BOSS: 6
});

const moveToMapNode = (node) => 
{
	session.currentNode = parseInt(node.id.replace('node',''));
	//console.log('Clicked to move to',node.id);
	switch(parseInt(node.dataset.type))
	{
		case Rooms.CHEST:
			layoutMgr.setCurrentScreen('chest');
		break;
		case Rooms.BATTLE:
			layoutMgr.setCurrentScreen('battle');
		break;
		case Rooms.EVENT:
			layoutMgr.setCurrentScreen('event');
		break;
		case Rooms.SHOP:
			layoutMgr.setCurrentScreen('shop');
		break;
		case Rooms.BLACKSMITH:
			layoutMgr.setCurrentScreen('blacksmith');
		break;
		case Rooms.CAMPFIRE:
			layoutMgr.setCurrentScreen('campfire');
		break;
		case Rooms.BOSS:
			layoutMgr.setCurrentScreen('boss');
		break;
	}
}

const getItems = (rarity = 0, count = 2) =>
{
	return itemUi.getItems(rarity, count);
}
const addItemToInventory = (item) => 
{
	//console.log(item);
	session.addItemToInventory(item);
}
const getInventoryItems = () => 
{
	return session.items;
}
//Inventory screen - handle item change
const addItemToHandSlot = (item, slot) => 
{
  if (layoutMgr.currentScreen !== 'test')
  {
    //Store in the hand slot data
  	session.setItemToSlot(item, slot);
  	//Remove from inventory
  	session.removeItemFromInventory(item);
  	//Redraw inventory items section
  	layoutMgr.generateItemsSection(false);
  }
}
const loadHandSlots = () => {
  //let hands = session.hands;
  //console.log(hands);
  let hands = Object.keys(session.hands);
  
  hands.forEach((hand) => {
    let slots = Object.keys(session.hands[hand]);
    slots.forEach((slot) => {
      let item = session.hands[hand][slot];
      if(item !== null)
      {
        if(slot === "held")
        {
          slot = "held-item";
        }
        console.log('Placing', item, 'in', hand, slot);
        itemUi.placeItemInHandSlot(item, hand, slot);
      }
    });
  })
}
//Remove all items from hands and put back into inventory
const emptyHands = () => 
{
  let handElements = document.querySelectorAll('.ring-wrapper');
		for(let i = 0; i < handElements.length; i++)
		{
			let handEl = handElements[i];
			addItemToInventory(handEl.dataset);
			handEl.parentElement.removeChild(handEl);
		}
		layoutMgr.generateItemsSection(false);
}
const advanceSession = () => 
{
	layoutMgr.setCurrentScreen('map');
}

// Clean utility helper to delay execution in loop frames
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));