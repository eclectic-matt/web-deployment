// Instantiate the application scope
const ringUi = new RingMapUi();
const itemScoring = new ItemScoring();
const layoutMgr = new LayoutManager();
const mapGenerator = new MapGenerator();

//Utility methods
const showScreen = (name) => 
{
	layoutMgr.setCurrentScreen(name);
}

const passDataToLayout = (data) => 
{
	layoutMgr.setItemData(data);
}

const addItemEvents = () => 
{
	ringUi.init();
	ringUi.resizeGameViewport();
}

const createMapForTarget = (target) => 
{
	const map = mapGenerator.generateMap();
	mapGenerator.outputMap(target, map);
}

const moveToMapNode = (node) => 
{
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
			layoutMgr.setCurrentScreen('merchant');
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

// Clean utility helper to delay execution in loop frames
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));