// Instantiate the application scope
const ringUi = new RingMapUi();
const itemScoring = new ItemScoring();
const layoutMgr = new LayoutManager();

//Utility methods
const showScreen = (name) => 
{
	layoutMgr.setCurrentScreen(name);
}

const passDataToLayout = (data) => 
{
	layoutMgr.setItemData(data);
}

const addItemEvents = () => {
	ringUi.init();
}

// Clean utility helper to delay execution in loop frames
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));