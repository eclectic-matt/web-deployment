// Clean utility helper to delay execution in loop frames
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Instantiate the application scope
let ringUi = new RingMapUi();
let itemScoring = new ItemScoring();