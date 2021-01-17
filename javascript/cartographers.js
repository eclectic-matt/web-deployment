const MAP_COLS = 11;
const MAP_ROWS = 11;

const MAP_TYPE_WILDERNESS = 101;
const MAP_TYPE_WASTELANDS = 110;

const MAP_COLOUR_VILLAGE = '#f00';
const MAP_COLOUR_FOREST = '#0f0';
const MAP_COLOUR_FARM = '#d1bf2c';
const MAP_COLOUR_WATER = '#03d';
const MAP_COLOUR_MONSTER = '#58387d';
const MAP_COLOUR_BG = 'rgb(214, 203, 171)';//'rgb(71, 19, 19)';  // MAKE SURE THIS MATCHES * BG-COLOR
const MAP_COLOUR_ERASER = '#000';

const TERRAIN_TYPE_VILLAGE = 201;
const TERRAIN_TYPE_FOREST = 202;
const TERRAIN_TYPE_FARM = 203;
const TERRAIN_TYPE_WATER = 204;
const TERRAIN_TYPE_MONSTER = 205;

const TERRAIN_ICON_MOUNTAIN = '&#8710;';
const TERRAIN_ICON_RUINS = '&#9619;&#8719;';

const TERRAIN_ICON_FOREST = '&#127794;';
const TERRAIN_ICON_WATER = '&#128167;';// '&#68184;';
const TERRAIN_ICON_FARM = '&#119067;';
const TERRAIN_ICON_VILLAGE = '&#127968;';//'&#8962;';
const TERRAIN_ICON_MONSTER = '&#128126;';
const TERRAIN_ICON_ERASER = '&#10060;';

var scoringDetails = {
  'Greenbough' : 'Earn ONE reputation star for each ROW and COLUMN with AT LEAST ONE FOREST SPACE. The same forest space may be scored in a row AND a column.',
  'Treetower': 'Earn ONE reputation star for each FOREST SPACE SURROUNDED ON ALL FOUR SIDES by filled spaces or the edge of the map.',
  'Canal Lake': 'Earn ONE reputation star for each WATER SPACE adjacent to AT LEAST ONE FARM SPACE. Earn ONE reputation star for each FARM SPACE adjacent to AT LEAST ONE WATER SPACE.',
  'The Golden Granary': 'Earn ONE reputation star for EACH WATER SPACE adjacent to a RUINS SPACE. Earn THREE reputation stars for EACH FARM SPACE ON A RUINS SPACE.',
  'Shieldgate': 'Earn TWO reputation stars for EACH VILLAGE SPACE in the SECOND-LARGEST CLUSTER OF VILLAGE SPACES.',
  'Wildholds': 'Earn EIGHT reputation stars for EACH CLUSTER OF SIX OR MORE VILLAGE SPACES.',
  'The Cauldrons': 'Earn ONE reputation star for EACH EMPTY SPACE SURROUNDED ON ALL FOUR SIDES by filled spaces or the edge of the map.',
  'The Broken Road': 'Earn THREE reputation stars for EACH COMPLETE DIAGONAL LINE OF FILLED SPACES that touches the LEFT AND BOTTOM edges of the map.',
  'Lost Barony': 'Earn THREE reputation stars for EACH SPACE ALONG ONE EDGE OF THE LARGEST SQUARE OF FILLED SPACES.',
  'Stoneside Forest': 'Earn THREE reputation stars for EACH MOUNTAIN SPACE CONNECTED TO ANOTHER MOUNTAIN SPACE by a cluster of forest spaces.',
  'Shoreside Expanse': 'Earn THREE reputation stars for EACH CLUSTER OF FARM SPACES NOT ADJACENT TO A WATER SPACE OR THE EDGE OF THE MAP. Earn THREE reputation stars for EACH CLUSTER OF WATER SPACES NOT ADJACENT TO A FARM SPACE OR THE EDGE OF THE MAP.',
  'Greengold Plains': 'Earn THREE reputation stars for EACH CLUSTER OF VILLAGE SPACES that is ADJACENT TO THREE OR MORE DIFFERENT TERRAIN TYPES.',
  'Borderlands': 'Earn SIX reputation stars for EACH COMPLETE ROW OR COMPLETE COLUMN OF FILLED SPACES.',
  'Great City': 'Earn ONE reputation star for EACH VILLAGE SPACE IN THE LARGEST CLUSTER OF VILLAGE SPACES that is NOT ADJACENT TO A MOUNTAIN SPACE.',
  'Mages Valley': 'Earn TWO reputation stars for EACH WATER SPACE ADJACENT TO A MOUNTAIN SPACE. Earn ONE reputation star for EACH FARM SPACE ADJACENT TO A MOUNTAIN SPACE.',
  'Sentinel Wood': 'Earn ONE reputation star for EACH FOREST SPACE ADJACENT TO THE EDGE OF THE MAP.'
}

var mapElements = {
  'wilderness': {
    'mountains': ['B4', 'C9', 'F6', 'I3', 'J8'],
    'mountainCoins': [0, 0, 0, 0, 0],
    'ruins': ['B6', 'C2', 'C10', 'I2', 'J6', 'I10']
  }
};

var terrainTypes = {
  'village': {
    'colour': MAP_COLOUR_VILLAGE,
    'icon': TERRAIN_ICON_VILLAGE
  },
  'forest': {
    'colour': MAP_COLOUR_FOREST,
    'icon': TERRAIN_ICON_FOREST
  },
  'water': {
    'colour': MAP_COLOUR_WATER,
    'icon': TERRAIN_ICON_WATER
  },
  'farm': {
    'colour': MAP_COLOUR_FARM,
    'icon': TERRAIN_ICON_FARM
  },
  'monster': {
    'colour': MAP_COLOUR_MONSTER,
    'icon': TERRAIN_ICON_MONSTER
  },
  'eraser': {
    'colour': MAP_COLOUR_ERASER,
    'icon': TERRAIN_ICON_ERASER
  }
};

var selectedTerrainType = 'village';
var totalMountainCoins = 0;

function init(){
  generateMapTable();
  resetElements();
  addMapElements(MAP_TYPE_WILDERNESS);
}

function resetElements(){
  // RESIZE FLUSHES WHEN REDRAWING MAP
  resizeScreen();
  // RESET SELECTED TERRAIN TYPE
  updateTerrainType('village');
  document.getElementById('terrainSelect').value = 'village';
  // RESET SCORING SCORING INFO
  showScoring('Greenbough', 'A');
  // RESET SCORE TOTAL
  document.getElementById('scoreTotal').innerHTML = 0;
  // RESET ALL SCORE INPUTS
  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++){
    if (inputs[i].checked === true){
      inputs[i].checked = false;
    }else{
      inputs[i].value = null;
    }
  }
}

function generateMapTable(){

  // GET THE MAP WRAPPER DIV
  var mapWrapper = document.getElementById('mapWrapperDiv');
  mapWrapper.innerHTML = '';
  // CREATE A TABLE ELEMENT
  var mapTable = document.createElement('div');
  mapTable.id = 'mapTable';
  //mapTable.style.border = '1px solid black';
  mapTable.style.borderCollapse = 'collapse';
  // THE CHARACTER FOR THE ROW LABELS (65 = A)
  var rowCharIndex = 65;

  // ITERATE THROUGH ROWS
  for (var r = 0; r < MAP_ROWS; r++){

    // CREATE A ROW ELEMENT
    var mapTR = document.createElement('div');
    mapTR.className = 'w3-row-padding';
    var labelTD = document.createElement('div');
    labelTD.className = 'w3-col s1';
    labelTD.style.border = '1px solid black';
    labelTD.style.borderCollapse = 'collapse';
    labelTD.innerHTML = String.fromCharCode(rowCharIndex + r);
    mapTR.appendChild(labelTD);

    // ITERATE THROUGH COLUMNS
    for (var c = 0; c < MAP_COLS; c++){

      // CREATE A TABLE CELL ELEMENT
      var mapTD = document.createElement('div');
      mapTD.className = 'w3-col s1';
      mapTD.style.border = '1px solid black';
      mapTD.style.borderCollapse = 'collapse';
      // SET THE ID TO BE A1-K11
      mapTD.id = String.fromCharCode(rowCharIndex + r) + String(c + 1);
      mapTD.innerHTML = '&nbsp;';
      // APPEND THIS CELL TO THE ROW
      mapTR.appendChild(mapTD);
      // ADD A CLICK LISTENER TO UPDATE THIS CELL
      mapTR.addEventListener("click", updateCell, false);

    }

    // APPEND THIS ROW TO THE TABLE
    mapTable.appendChild(mapTR);

  }

  // APPEND A ROW AT THE BOTTOM WITH LABELS
  var mapTR = document.createElement('div');
  mapTR.className = 'w3-row-padding';
  var labelTD = document.createElement('div');
  labelTD.className = 'w3-col s1';
  labelTD.style.border = '1px solid black';
  labelTD.style.borderCollapse = 'collapse'
  mapTR.appendChild(labelTD);

  for (var c = 0; c < MAP_COLS; c++){
    var labelTD = document.createElement('div');
    labelTD.className = 'w3-col s1';
    labelTD.style.border = '1px solid black';
    labelTD.style.borderCollapse = 'collapse';
    labelTD.innerHTML = (c + 1);
    mapTR.appendChild(labelTD);
  }
  mapTable.appendChild(mapTR);

  // THEN APPEND THE WHOLE TABLE TO THE WRAPPER DIV
  mapWrapper.appendChild(mapTable);

}

function addMapElements(type){
  var mapTable = document.getElementById('mapTable');
  switch (type){
    case MAP_TYPE_WILDERNESS:
      var arrMtns = mapElements.wilderness.mountains;
      for (var i = 0; i < arrMtns.length; i++){
        var thisId = arrMtns[i];
        var cellMtn = document.getElementById(thisId);
        cellMtn.innerHTML = TERRAIN_ICON_MOUNTAIN + "<span id='" + thisId + "_Coin' style='font-size: 0.6em; margin: 1px; padding: 0; border: 1px solid black; border-radius:50%; background-color: #a8a632'>&#65504;</span>";
        cellMtn.style.backgroundColor = '#471313';
        cellMtn.classList.add('mountain');
      }
      var arrRuins = mapElements.wilderness.ruins;
      for (var i = 0; i < arrRuins.length; i++){
        var thisId = arrRuins[i];
        var cellRuin = document.getElementById(thisId);
        cellRuin.innerHTML = TERRAIN_ICON_RUINS;
        cellRuin.style.color = '#d9823b';//'#a19958';
        cellRuin.classList.add('ruins');
      }
      break;
  }
}

function updateCell(e){
  var thisId = e.srcElement.id;
  if (!thisId) return false;
  // CHECK IF THIS CELL IS A MOUNTAIN
  if (mapElements.wilderness.mountains.includes(thisId)){
    alert('Sorry, you cannot draw onto mountain spaces');
    return false;
  }else{
    var thisCell = document.getElementById(thisId);
    if (selectedTerrainType === 'eraser'){
      thisCell.style.backgroundColor = MAP_COLOUR_BG;
      thisCell.className = 'w3-col s1';
      // LEAVE THE RUINS VISIBLE
      if (!mapElements.wilderness.ruins.includes(thisId)){
        thisCell.innerHTML = '';
      }
    }else{
      // UPDATE THE COLOUR AND ICON IN THIS CELL
      newColour = terrainTypes[selectedTerrainType]['colour'];
      newIcon = terrainTypes[selectedTerrainType]['icon'];
      thisCell.style.backgroundColor = newColour;
      // LEAVE THE RUINS VISIBLE
      if (!mapElements.wilderness.ruins.includes(thisId)){
        thisCell.innerHTML = newIcon;
        thisCell.className = 'w3-col s1 ' + selectedTerrainType;
      }else {
        thisCell.className = 'w3-col s1 ruins ' + selectedTerrainType;
      }
    }
    checkMountainCoins();
  }
}

function checkMountainCoins(){
  var mtns = mapElements.wilderness.mountains;
  for (var i = 0; i < mtns.length; i++){
    var thisMtn = mtns[i];
    var row = thisMtn.split('')[0];
    var col = thisMtn.split('')[1];
    var rowCharIndex = row.charCodeAt();
    var up = isCellFilled(String.fromCharCode(rowCharIndex - 1) + col.toString());
    var down = isCellFilled(String.fromCharCode(rowCharIndex + 1) + col.toString());
    var left = isCellFilled(row + (col - 1));
    var right = isCellFilled(row + (parseInt(col) + 1));
    //console.log('Mtn check',thisMtn,'LRUD:',left,right,up,down);
    if (left && right && up && down){
      //console.log('Adjacent complete mountain at ',row+col);
      mapElements.wilderness.mountainCoins[i] = 1;
      if (document.getElementById(thisMtn + '_Coin').className === ''){
        document.getElementById(thisMtn + '_Coin').className = 'collected';
        document.getElementById(thisMtn + '_Coin').style.color = '#f00';
        document.getElementById(thisMtn + '_Coin').style.textDecoration = 'line-through';
        addCoinToTable();
      }
    }else{
      if (document.getElementById(thisMtn + '_Coin').className !== 'collected'){
        document.getElementById(thisMtn + '_Coin').className = '';
        document.getElementById(thisMtn + '_Coin').style.color = '#000';
        document.getElementById(thisMtn + '_Coin').style.textDecoration = '';
        removeCoinFromTable();
      }
    }
  }
  var newTotalCoins = mapElements.wilderness.mountainCoins.reduce((a, b) => a + b, 0);
  if (newTotalCoins !== totalMountainCoins){
    updateCoinsCheckboxes(newTotalCoins - totalMountainCoins);
  }
  totalMountainCoins = newTotalCoins;
}

function isCellFilled(id){
  var cell = document.getElementById(id);
  // RETURN FALSE/EMPTY IF CELL DOESN'T EXIST
  if (!cell) return false;
  //if (cell.style.backgroundColor == MAP_COLOUR_BG){
  if (cell.className == 'w3-col s1'){
    //console.log('cellEmptyCheck',id,false);
    return false;
  }else{
    //console.log('cellEmptyCheck',id,true);
    return true;
  }
}

// NOT IMPLEMENTED
function addCoinToTable(){

}
// NOT IMPLEMENTED
function removeCoinFromTable(){

}
// NOT IMPLEMENTED
function updateCoinsCheckboxes(diff){
  var coinChecks = document.getElementsByClassName('coinCheck');
  if (diff > 0){
    // START AT LEFT, CHECK FIRST UNCHECKED
    for (var i = 0; i > coinChecks.length; i++){
      if ( (coinChecks[i].checked === true) && (diff > 0) ){
        coinChecks[i].checked = false;
        diff--;
      }
    }
  }else if (diff < 0){
    // START AT RIGHT, UNCHECK FIRST CHECKED
    for (var i = coinChecks.length; i > 0; i--){
      if ( (coinChecks[i].checked === true) && (diff < 0) ){
        coinChecks[i].checked = false;
        diff++;
      }
    }
  }
}

function resizeScreen(){
  const SIZE_SWITCH_WIDTH = 993;
  var w = window.innerWidth;
  if (w >= SIZE_SWITCH_WIDTH){
    w = window.innerWidth / 2.2;
  }
  var h = window.innerHeight;
  var l = (w >= h) ? h : w;
  // We want there to be some padding, plus 12 rows / columns to fit in this maximum length (l)
  var padding = 0.15;
  var cellSize = Math.floor( ( (1 - padding) * l) / 12 );
  //console.log('Resize event W',w,'H',h,'L',l,'CellSize',cellSize);
  var cells = document.getElementsByClassName('s1');
  var cellCnt = cells.length;
  for (var i = 0; i < cellCnt; i++){
    cells[i].style.width = cellSize + 'px';
    cells[i].style.height = cellSize + 'px';
    cells[i].style.fontSize = Math.floor(cellSize / 2) + 'px';
  }
}

function updateTerrainType(type){
  selectedTerrainType = type;
  document.getElementById('terrainSpan').innerHTML = 'Terrain type: ' + terrainTypes[selectedTerrainType]['icon'];
  document.getElementById('terrainSpan').style.color = terrainTypes[selectedTerrainType]['colour'];
}

function updateScore(){
  // ENSURE MONSTER INPUTS ARE NEGATIVE!
  var monsterInputs = document.getElementsByClassName('monsterInput');
  var monsterInputCount = monsterInputs.length;
  for (var i = 0; i < monsterInputCount; i++){
    if (monsterInputs[i].value > 0){
      monsterInputs[i].value = -1 * monsterInputs[i].value;
    }
  }
  var scoreInputs = document.getElementsByClassName('scoreInput');
  var scoreInputsCount = scoreInputs.length;
  var total = 0;
  for (var i = 0; i < scoreInputsCount; i++){
    var thisScore = (scoreInputs[i].value == '') ? 0 : scoreInputs[i].value;
    total = parseInt(total) + parseInt(thisScore);
  }
  var spanTotal = document.getElementById('scoreTotal');
  spanTotal.innerHTML = total;
}

function showScoring(scoreCard, card){
  var scoreText = scoringDetails[scoreCard];
  document.getElementById('scoringInfoSpan' + card).innerHTML = scoreText;
}

function accordion(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

function saveGame(){

  // SAVE NAMES
  var mapName = document.getElementById('mapNameInput').value;
  setCookie('mapName', mapName, 366);
  var yourName = document.getElementById('yourNameInput').value;
  setCookie('yourName', yourName, 366);

  // A STRING THAT WILL BE SAVED AS A COOKIE
  var saveStr = '';

  // GO THROUGH THE MAP CELLS TO SAVE CHANGES
  var cells = document.getElementsByClassName('s1');
  var cellCnt = cells.length;
  for (var i = 0; i < cellCnt; i++){
    var clsName = cells[i].className.replace('w3-col s1','').trim();
    if ( (clsName !== 'mountain') && (clsName !== 'ruins') && (clsName.length > 0) ){
      saveStr += cells[i].id.trim();
      saveStr += clsName + ',';
    }
  }
  setCookie('map', saveStr, 366);

  // SAVE A STRING OF THE COINS CHECKED
  var coins = document.getElementsByClassName('coinCheck');
  var coinsCount = 18;
  var coinsArray = [];
  for (var i = 0; i < coinsCount; i++){
    if (coins[i].checked){
      coinsArray[i] = 1;
    }
  }
  var saveStr = coinsArray.join();
  setCookie('coins', saveStr, 366);

  // SAVE A STRING OF THE SCORES
  var scores = document.getElementsByClassName('scoreInput');
  var scoreCount = scores.length;
  var scoreArray = [];
  for (var i = 0; i < scoreCount; i++){
    if (!scores[i].value){
      scoreArray[i] = 0;
    }else{
      scoreArray[i] = scores[i].value;
    }
  }
  saveStr = scoreArray.join();
  console.log('GAME SAVED');
  setCookie('scores', saveStr, 366);
}

function loadGame(){

  // LOAD THE MAP
  var map = getCookie('map');
  // FAIL IF NO MAP DATA
  if (map == ''){ alert('No Saved Data found!'); return false; }
  //console.log(map);
  var mapArray = map.split(',');
  var mapCount = mapArray.length;
  for (var i = 0; i < mapCount; i++){
    if (mapArray[i].length === 0){ continue; }
    if ( (mapArray[i].substring(2,3) == '0') || (mapArray[i].substring(2,3) == '1') ){
      var cell = mapArray[i].substring(0,3).trim();
      var feature = mapArray[i].substring(3,mapArray[i].length).replace('mountain', '').replace('ruins','').trim();
    }else{
      var cell = mapArray[i].substring(0,2).trim();
      var feature = mapArray[i].substring(2,mapArray[i].length).replace('mountain', '').replace('ruins','').trim();
    }
    //console.log('Loading feature at',cell,feature);
    if ( feature.length > 0 ){
      selectedTerrainType = feature;
      var e = {};
      e.srcElement = {};
      e.srcElement.id = cell;
      updateCell(e);
    }
  }

  // LOAD THE NAMES
  var mapName = getCookie('mapName');
  document.getElementById('mapNameInput').value = mapName;
  var yourName = getCookie('yourName');
  document.getElementById('yourNameInput').value = yourName;
  //console.log('Setting names to',mapName,yourName);

  // LOAD THE COINS
  var coins = getCookie('coins');
  var coinArray = coins.split(',');
  //console.log(coins);
  var coinElements = document.getElementsByClassName('coinCheck');
  var coinsCount = coinArray.length;
  for (var i = 0; i < coinsCount; i++){
    if (coinArray[i] == '1'){
      coinElements[i].checked = true;
    }
  }

  // LOAD THE SCORES TABLE
  var scores = getCookie('scores');
  var scoreArray = scores.split(',');
  var scoreCount = scoreArray.length;
  //console.log(scores);
  var scoreElements = document.getElementsByClassName('scoreInput');
  for (var i = 0; i < scoreCount; i++){
    //console.log('Score',i,'=',scoreArray[i].trim());
    scoreElements[i].value = scoreArray[i].trim();
  }
  updateScore();
  alert('Game Loaded!');
}

// https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkReset(){
  var conf = confirm('Are you sure? This will clear your map, coins and score?');
  if (conf == true){
    init();
  }
}

function checkLoad(){
  var conf = confirm('Are you sure? This will clear your current map, coins and score?');
  if (conf == true){
    init();
    loadGame();
  }
}

function checkSave(){
  var mapName = getCookie('mapName');
  // CHECK FOR OVERWRITE
  if (mapName !== ''){
    var conf = confirm('Saved Data found - ' + mapName + '! Are you sure you want to overwrite this saved data?');
    if (conf !== true){
      return false;
    }
  }
  saveGame();
}
