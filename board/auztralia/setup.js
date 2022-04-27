var grid = boards.eastern.grid;
var setupTilesToDraw = 13;
var arrSetupTiles = [];
var iteration = 0;
var options = [];
options['showAlert'] = false;

function drawSetupTile(hex,setupTile){

	var setupTile = setupTiles.pop();

	//OUPUT A TABLE SHOWING THE CURRENT SETUP TILE
	var strOut = '<b>Setup Hex ' + hex.id + '</b><br>';
	document.getElementById('setupTileInfo').innerHTML = strOut;

	let neighbours = getNeighbours(hex.row, hex.col, 7, 10);

	//CREATE A TABLE ROW
	let thisRow = document.createElement('tr');

	//CREATE THE FIRST TD
	let td = document.createElement('td');
	//THIS TD CONTAINS THE SETUP TILE NUMBER
	td.innerHTML = setupTilesToDraw - arrSetupTiles.length;
	//APPEND TO ROW
	thisRow.appendChild(td);

	//LOOP THROUGH THE ELEMENTS ON THIS SETUP TILE
	for(let i = 0; i < Object.keys(setupTile).length; i++){
		
		//IF THE NEIGHBOUR IN THIS DIRECTION IS NOT NULL
		if(neighbours[i] !== null){

			//GET THE HEX FOR THIS NEIGHBOUR
			let neighbourHex = getHexByCoords(neighbours[i][0], neighbours[i][1]);

			td = document.createElement('td');
			td.innerHTML = neighbourHex.id;// + ' &#128269';
			td.classList = 'neighbourHexId';
			td.setAttribute('hex',neighbourHex.id);
			td.setAttribute('row', neighbours[i][0]);
			td.setAttribute('col', neighbours[i][1]);
			td.onclick = function(){
				let hexId = this.getAttribute('hex');
				let coords = '';
				if(isNaN(hexId)){
					coords = getGridCoordsFromHexId(hexId);
				}else{
					coords = getGridCoordsFromHexId(parseInt(hexId));
				}
				drawOntoCanvas(coords[0],coords[1]);
				//ADD HIGHLIGHT TO MATCHING TABLE CELLS (WITH THIS ID)
				highlightTableCells(hexId);
			}
		}else{
			//NO HEX
			td = document.createElement('td');
			td.classList = 'noHexFound';
			td.innerHTML = 'No Hex';
		}

		thisRow.appendChild(td);

		//IF THERE IS NOTHING TO GIVE ON THIS PART OF THE TILE, PRINT ____
		td = document.createElement('td');
		if(setupTile[i] === null){
			td.innerHTML = '____';	
		}else{
			td.innerHTML = '<b>' + setupTile[i] + '</b>';
		}

		thisRow.appendChild(td);
	}

	document.getElementById('setupStepsTable').appendChild(thisRow);

	//FOR EACH NEIGHBOUR
	for(let i = 0; i < Object.keys(setupTile).length; i++){

		neighbours = getNeighbours(hex.row, hex.col, 7, 10);

		if (neighbours[i] === null){

			continue;
		}
		let neighbour = null;

		switch(setupTile[i]){
			case null:
				//NOTHING TO GIVE!
				break;
			case 'coal':
				neighbour = getHexByCoords(neighbours[i][0], neighbours[i][1]);
				neighbour = giveCoal(neighbour);
				break;
			case 'gold':
				neighbour = getHexByCoords(neighbours[i][0], neighbours[i][1]);
				neighbour = giveGold(neighbour);
				break;
			case 'iron':
				neighbour = getHexByCoords(neighbours[i][0], neighbours[i][1]);
				neighbour = giveIron(neighbour);
				break;
			case 'phos':
				neighbour = getHexByCoords(neighbours[i][0], neighbours[i][1]);
				neighbour = givePhos(neighbour);
				break;
			case 'oldOne':
				neighbour = getHexByCoords(neighbours[i][0], neighbours[i][1]);
				neighbour = giveOldOne(neighbour);
				break;
		}
	}
}

function resetMap(){
	window.location.reload();
}

/**
 * 
 * @param {string | integer} hexId 
 */
function highlightTableCells(hexId){
	//RESET
	var allTds = document.getElementsByTagName('td');
	for(let i = 0; i < allTds.length; i++){
		allTds[i].style.backgroundColor = '';///'white';
	}
	var cells = document.querySelectorAll("td[hex='" + hexId + "']");
	for(let j = 0; j < cells.length; j++){
		cells[j].style.backgroundColor = 'yellow';
		cells[j].nextSibling.style.backgroundColor = 'yellow';
	}
}

function giveCoal(hex){

	if(hex === false){
		return false;
	}
	//RESOURCES ARE NEVER PLACED IN COASTAL OR EMPTY HEXES
	if(
		(hex.type === 'coastal') ||
		(hex.type === 'empty')
	){
		return false;
	}
	hex.resources.coal += resources.coal.count;
	return hex;
}

function giveIron(hex){

	if(hex === false){
		return false;
	}
	//RESOURCES ARE NEVER PLACED IN COASTAL OR EMPTY HEXES
	if(
		(hex.type === 'coastal') ||
		(hex.type === 'empty')
	){
		return false;
	}
	hex.resources.iron += resources.iron.count;
	return hex;
}

function givePhos(hex){

	if(hex === false){
		return false;
	}
	//RESOURCES ARE NEVER PLACED IN COASTAL OR EMPTY HEXES
	if(
		(hex.type === 'coastal') ||
		(hex.type === 'empty')
	){
		return false;
	}
	hex.resources.phos += resources.phos.count;
	return hex;
}

function giveGold(hex){

	if(hex === false){
		return false;
	}
	//RESOURCES ARE NEVER PLACED IN COASTAL OR EMPTY HEXES
	if(
		(hex.type === 'coastal') ||
		(hex.type === 'empty')
	){
		return false;
	}
	hex.resources.gold += resources.gold.count;
	return hex;
}

function giveOldOne(hex){

	if(hex === false){
		return false;
	}
	//OLD ONES ARE NEVER PLACED IN HILL, COASTAL OR EMPTY HEXES
	if(
		(hex.type === 'hill') ||
		(hex.type === 'coastal') ||
		(hex.type === 'empty')
	){
		return false;
	}
	hex.resources.olds += resources.olds.count;
	return hex;
}

function getHexIdFromGridCoords(row, col){

    return getHexByCoords(board, row, col).id;
}
function getHexByCoords(row, col){

	if(
		(row >= grid.length) ||
		(row < 0)
	){
		return false;
	}

	if(
		(col >= grid[row].length) ||
		(col < 0)
	){
		return false;
	}

	hex = grid[row][col];
	return hex;
}


function getGridCoordsFromHexId(id){

	for(let row = 0; row < grid.length; row++){

		//ITERATE COLUMNS
		for(let col = 0; col < grid[row].length; col++){

			let hex = grid[row][col];

			if(hex.id === id){

				let coords = [];
				coords[0] = row;
				coords[1] = col;
				return coords;
			}
		}
	}
}
function getHexById(id){

	for(let row = 0; row < grid.length; row++){

		//ITERATE COLUMNS
		for(let col = 0; col < grid[row].length; col++){

			let hex = grid[row][col];

			if(hex.id === id){

				return hex;
			}
		}
	}
}

function init(){
	
	limit = 3;
	setups = 0;
	setupTiles = shuffle(setupTiles);

	//ITERATE ROWS
	for(let row = 0; row < grid.length; row++){
		
		//ITERATE COLUMNS
		for(let col = 0; col < grid[row].length; col++){

			var hex = grid[row][col];
			hex.resources = JSON.parse(JSON.stringify(emptyResources));

			if(hex.setupTile === true){

				arrSetupTiles.push([row, col]);
			}
		}
	}
	highlightRow = arrSetupTiles[0][0];
	highlightCol = arrSetupTiles[0][1];
	drawOntoCanvas(highlightRow, highlightCol);
}

function processNextSetupTile(){

	if(arrSetupTiles.length <= 0){
		alert('No more setup tiles!');
		return;
	}
	var thisTile = arrSetupTiles.shift();
	row = thisTile[0];
	col = thisTile[1];
	var hex = grid[row][col];
	drawSetupTile(hex,thisTile);
	drawOntoCanvas(row, col);
}

function drawAllSetupTiles(delay){

	iteration++;
	if(arrSetupTiles.length <= 0){
		if(options['showAlert'] === true){
			alert('Setup Complete!');
		}
		t = 0;
		return;
	}
	var thisTile = arrSetupTiles.shift();
	row = thisTile[0];
	col = thisTile[1];
	var hex = grid[row][col];
	drawSetupTile(hex,thisTile);
	drawOntoCanvas(row, col);
	t = setTimeout(drawAllSetupTiles, delay);
}

//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

function getNeighbours(row, col, maxRow, maxCol){

	//THE RETURN OBJECT
	neighbours = [];

	//0 - SELF (STORE FOR CONVENIENCE)
	neighbours[0] = [row, col];

	// 0 1 2 3 4 5 6 7
	// X   X   X   X
	//   X   X   X   X

	//1 - UP
	//IF ON ANY ROW AFTER THE FIRST
	if(row > 0){
		//UP ONE ROW
		neighbours[1] = [row - 1, col];
	}else{
		//NO ROW -1
		neighbours[1] = null;
	}

	//2 - UPPER RIGHT
	//IF ON START ROW OR THE END COL
	if( (row === 0) || (col === maxCol) ){
		//NO UPPER RIGHT
		neighbours[2] = null;
	}else{
		//CHECK IF COLUMN IS ODD
		if(col % 2 === 1){
			//SAME ROW
			neighbours[2] = [row, col + 1];
		}else{
			//UP ONE ROW
			neighbours[2] = [row - 1, col + 1];
		}
	}

	//3 - LOWER RIGHT
	//IF ON THE BOTTOM ROW AND COLUMN IS ODD, OR THE LAST COLUMN
	if( ( (row === maxRow) && (col % 2 === 1) ) || (col === maxCol) ){
		//NO LOWER RIGHT
		neighbours[3] = null;
	}else{
		//CHECK IF COLUMN IS ODD
		if(col % 2 === 1){
			//DOWN ONE ROW
			neighbours[3] = [row + 1, col + 1];
		}else{
			//SAME ROW
			neighbours[3] = [row, col + 1];
		}
	}

	//4 - DOWN
	//IF NOT ON THE LAST ROW
	if(row < maxRow){
		//DOWN ONE ROW
		neighbours[4] = [row + 1, col];
	}else{
		//NO ROW N+1
		neighbours[4] = null;
	}

	//5 - LOWER LEFT
	//IF ON THE LAST ROW AND ODD, OR THE FIRST COLUMN
	if( ( (row === maxRow) && (col % 2 === 1) ) || (col === 0) ){
		//NO LOWER LEFT
		neighbours[5] = null;
	}else{
		//IF COLUMN IS ODD
		if(col % 2 === 1){
			//DOWN ONE ROW
			neighbours[5] = [row + 1, col - 1];
		}else{
			//SAME ROW
			neighbours[5] = [row, col - 1];
		}
	}

	//6 - UPPER LEFT
	//IF ON THE FIRST ROW AND THE COLUMN IS EVEN, OR THE FIRST COLUMN
	if( ( (row === 0) && (col % 2 === 0) ) || (col === 0) ){
		//NO UPPER LEFT
		neighbours[6] = null;
	}else{
		//IF COLUMN IS ODD
		if(col % 2 === 1){
			//SAME ROW
			neighbours[6] = [row, col - 1];
		}else{
			//UP ONE ROW
			neighbours[6] = [row - 1, col - 1];
		}
	}

	return neighbours;
}
