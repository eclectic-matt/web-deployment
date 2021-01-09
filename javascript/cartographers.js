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

  // GET SCREEN HEIGHT/WIDTH
  var scrWidth = screen.availWidth;
  var scrHeight = screen.availHeight;
  resetElements();
  generateMapTable();
  addMapElements(MAP_TYPE_WILDERNESS);
}

function resetElements(){
  updateTerrainType('village');
  document.getElementById('scoreTotal').innerHTML = 0;
  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++){
    inputs[i].value = null;
  }
}

function generateMapTable(){

  // GET THE MAP WRAPPER DIV
  var mapWrapper = document.getElementById('mapWrapperDiv');
  mapWrapper.innerHTML = '';
  // CREATE A TABLE ELEMENT
  var mapTable = document.createElement('table');
  mapTable.id = 'mapTable';
  mapTable.style.border = '1px solid black';
  mapTable.style.borderCollapse = 'collapse';
  // THE CHARACTER FOR THE ROW LABELS (65 = A)
  var rowCharIndex = 65;

  // ITERATE THROUGH ROWS
  for (var r = 0; r < MAP_ROWS; r++){

    // CREATE A ROW ELEMENT
    var mapTR = document.createElement('tr');
    var labelTD = document.createElement('td');
    labelTD.style.border = '1px solid black';
    labelTD.style.borderCollapse = 'collapse';
    labelTD.innerHTML = String.fromCharCode(rowCharIndex + r);
    mapTR.appendChild(labelTD);

    // ITERATE THROUGH COLUMNS
    for (var c = 0; c < MAP_COLS; c++){

      // CREATE A TABLE CELL ELEMENT
      var mapTD = document.createElement('td');
      mapTD.style.border = '1px solid black';
      mapTD.style.borderCollapse = 'collapse';
      // SET THE ID TO BE A1-K11
      mapTD.id = String.fromCharCode(rowCharIndex + r) + String(c + 1);
      // APPEND THIS CELL TO THE ROW
      mapTR.appendChild(mapTD);
      // ADD A CLICK LISTENER TO UPDATE THIS CELL
      mapTR.addEventListener("click", updateCell, false);

    }

    // APPEND THIS ROW TO THE TABLE
    mapTable.appendChild(mapTR);

  }

  // APPEND A ROW AT THE BOTTOM WITH LABELS
  var mapTR = document.createElement('tr');
  var labelTD = document.createElement('td');
  labelTD.style.border = '1px solid black';
  labelTD.style.borderCollapse = 'collapse'
  mapTR.appendChild(labelTD);

  for (var c = 0; c < MAP_COLS; c++){
    var labelTD = document.createElement('td');
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
        cellMtn.classList.add('ruins');
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
  }else{
    var thisCell = document.getElementById(thisId);
    if (selectedTerrainType === 'eraser'){
      thisCell.style.backgroundColor = MAP_COLOUR_BG;
      thisCell.className = '';
      if (!mapElements.wilderness.ruins.includes(thisId)){
        thisCell.innerHTML = '';
      }
    }else{
      // UPDATE THE COLOUR AND ICON IN THIS CELL
      newColour = terrainTypes[selectedTerrainType]['colour'];
      newIcon = terrainTypes[selectedTerrainType]['icon'];
      thisCell.style.backgroundColor = newColour;
      thisCell.className = selectedTerrainType;
      // LEAVE THE RUINS VISIBLE
      if (!mapElements.wilderness.ruins.includes(thisId)){
        thisCell.innerHTML = newIcon;
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
      if (document.getElementById(thisMtn + '_Coin').className !== ''){
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
  if (cell.className == ''){
    console.log('cellEmptyCheck',id,false);
    return false;
  }else{
    console.log('cellEmptyCheck',id,true);
    return true;
  }
}

function addCoinToTable(){

}

function removeCoinFromTable(){

}

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

function updateTerrainType(type){
  selectedTerrainType = type;
  document.getElementById('terrainSpan').innerHTML = 'Terrain type: ' + terrainTypes[selectedTerrainType]['icon'];
  document.getElementById('terrainSpan').style.color = terrainTypes[selectedTerrainType]['colour'];
}

function updateScore(){
  var spanTotal = document.getElementById('scoreTotal');
  var scoreInputs = document.getElementsByClassName('scoreInput');
  var total = 0;
  for (var i = 0; i < scoreInputs.length; i++){
    var thisScore = (scoreInputs[i].value == '') ? 0 : scoreInputs[i].value;
    total = parseInt(total) + parseInt(thisScore);
  }
  spanTotal.innerHTML = total;

}
