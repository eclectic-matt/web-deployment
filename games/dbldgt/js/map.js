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
	console.log('Clicked to move to',node.id);
}

// Clean utility helper to delay execution in loop frames
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));