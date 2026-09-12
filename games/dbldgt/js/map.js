// Instantiate the application scope
const ringUi = new RingMapUi();
const itemScoring = new ItemScoring();
const layoutMgr = new LayoutManager();
const mapGenerator = new MapGenerator();

//Game is for save/load and stats/
const game = new Game();

//Session is the current game session/run
var session;
if(game.currentSession !== null)
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
	ringUi.init();
	ringUi.resizeGameViewport();
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

const moveToMapNode = (node) => 
{
  session.currentNode = parseInt(node.id.replace('node',''));
	//console.log('Clicked to move to',node.id);
	switch(parseInt(node.dataset.type))
	{
		case 0:
			layoutMgr.setCurrentScreen('chest');
		break;
		case 1:
			layoutMgr.setCurrentScreen('battle');
		break;
		case 2:
			layoutMgr.setCurrentScreen('event');
		break;
		case 3:
			layoutMgr.setCurrentScreen('shop');
		break;
		case 4:
			layoutMgr.setCurrentScreen('boss');
		break;
	}
}

const getItems = (rarity = 0, count = 2) =>
{
	return ringUi.getItems(rarity, count);
}

const addItemToInventory = (item) =>
{
  
}

const advanceSession = () => 
{
  layoutMgr.setCurrentScreen('map');
}

// Clean utility helper to delay execution in loop frames
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));