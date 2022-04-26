var grid = boards.eastern.grid;

function drawSetupTile(hex){

	//var boardName = 'eastern';
	//console.log('Setting up hex', hex.id);
	var randomInt = Math.floor(Math.random() * setupTiles.length);
	var setupTile = setupTiles[randomInt];

	//OUPUT A TABLE SHOWING THE CURRENT SETUP TILE
	var strOut = '<b>Setup Hex ' + hex.id + '</b><br>';
	document.getElementById('setupTileInfo').innerHTML = strOut;

	neighbours = getNeighbours(hex.row, hex.col, 7, 10);

	let thisRow = document.createElement('tr');

	let td = document.createElement('td');
	td.innerHTML = 21 - setupTiles.length;

	thisRow.appendChild(td);

	//LOOP THROUGH THE ELEMENTS ON THIS SETUP TILE
	for(let i = 0; i < Object.keys(setupTile).length; i++){
		
		//IF THE NEIGHBOUR IN THIS DIRECTION IS NOT NULL
		if(neighbours[i] !== null){

			//GET THE HEX FOR THIS NEIGHBOUR
			neighbourHex = getHexByCoords(neighbours[i][0], neighbours[i][1]);

			td = document.createElement('td');

			if(neighbourHex === false){

				//strOut += '<td onclick="drawOntoCanvas(...getGridCoordsFromHexId(' + neighbours[i] + '))">' + neighbour[i] + ' &#128269;</td>';
				
				td.innerHTML = neighbour[i];// + ' &#128269';
				var a = neighbours[i];
				td.attributes['a'] = a;
				td.onclick = function(){
					a = this.attribute('a');
					console.log('drawingFromHexId',this.innerHTML);
					//drawOntoCanvas(...getGridCoordsFromHexId(this.innerHTML));
				}

			}else{

				//strOut += '<td onclick="drawOntoCanvas(' + neighbours[i][0] + ',' + neighbours[i][1] + ')">' + neighbourHex.id + ' &#128269;</td>';
				td.innerHTML = neighbourHex.id;// + ' &#128269';
				var a = neighbours[i][0];
				var b = neighbours[i][1];
				td.attributes['a'] = neighbours[i][0];
				td.attributes['b'] = neighbours[i][1];
				td.onclick = function(){
					if ( (this.innerHTML.indexOf('r') >= 0) && (this.innerHTML.indexOf('r') !== false)){
						row = this.innerHTML.substring(1,this.innerHTML.indexOf('c'));
						col = this.innerHTML.substring(this.innerHTML.indexOf('c') + 1, 6);
						console.log('Drawing with row',row,'col',col);
						drawOntoCanvas(row,col);
					}else{
						drawOntoCanvas(...getGridCoordsFromHexId(this.innerHTML));
					}
					
				}
			}
		}else{
			//strOut += '<td>No Hex</td>';
			td.innerHTML = 'No Hex';
		}

		thisRow.appendChild(td);

		//IF THERE IS NOTHING TO GIVE ON THIS PART OF THE TILE, PRINT ____
		//strOut += '<td>' + ( (setupTile[i] === null) ? '<em>___</em>' : '<b>' + setupTile[i] + '</b>' ) + '</td>';
		td = document.createElement('td');
		td.innerHTML = ( (setupTile[i] === null) ? '<em>___</em>' : '<b>' + setupTile[i] + '</b>' );

		thisRow.appendChild(td);
		//strOut += '</tr>';
	}
	//strOut += '</tr>';

	document.getElementById('setupStepsTable').appendChild(thisRow);

	//CURRENT TILE (setupTile[0])
	/*if(setupTile[0] !== null){
		console.log('Neighbour',0,hex.id,'gets ',setupTile[0]);
	}else{
		console.log('Neighbour',0,hex.id,'gets nothing');
	}*/

	//FOR EACH NEIGHBOUR
	for(let i = 0; i < Object.keys(setupTile).length; i++){

		neighbours = getNeighbours(hex.row, hex.col, 7, 10);

		if (neighbours[i] === null){
		//if(hex.neighbours[i] === null){
			//console.log('Neighbour',i,'No neighbour');
			continue;
		}
		//console.log('Add',setupTile[i],'to',hex.neighbours[i]);
		switch(setupTile[i]){
			case null:
				//console.log('Neighbour',i,neighbours[i],'gets nothing');
				//console.log('Neighbour',i,hex.neighbours[i],'gets nothing');
				break;
			case 'coal':
				//neighbour = getHexByCoords(boardName, hex.neighbours[i][0], hex.neighbours[i][1]);
				neighbour = getHexByCoords(neighbours[i][0], neighbours[i][1]);
				neighbour = giveCoal(neighbour);
				//console.log('Neighbour',i,hex.id,'gets coal');
				break;
			case 'gold':
				//neighbour = getHexByCoords(boardName, hex.neighbours[i][0], hex.neighbours[i][1]);
				neighbour = getHexByCoords(neighbours[i][0], neighbours[i][1]);
				neighbour = giveGold(neighbour);
				//console.log('Neighbour',i,hex.id,'gets gold');
				break;
			case 'iron':
				//neighbour = getHexByCoords(boardName, hex.neighbours[i][0], hex.neighbours[i][1]);
				neighbour = getHexByCoords(neighbours[i][0], neighbours[i][1]);
				neighbour = giveIron(neighbour);
				//console.log('Neighbour',i,hex.getGridCoordsFromHexId,'gets iron');
				break;
			case 'phosphorous':
				//neighbour = getHexByCoords(boardName, hex.neighbours[i][0], hex.neighbours[i][1]);
				neighbour = getHexByCoords(neighbours[i][0], neighbours[i][1]);
				neighbour = givePhos(neighbour);
				//console.log('Neighbour',i,hex.id,'gets phosphorous');
				break;
			case 'oldOne':
				//neighbour = getHexByCoords(boardName, hex.neighbours[i][0], hex.neighbours[i][1]);
				neighbour = getHexByCoords(neighbours[i][0], neighbours[i][1]);
				neighbour = giveOldOne(neighbour);
				//console.log('Neighbour',i,hex.id,'gets an Old One');
				break;
		}
	}
}

function resetMap(){
	window.location.reload();
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
	//console.log('HEX',hex.id,'NOW HAS ',hex.resources.coal,'COAL');
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
	//console.log('HEX',hex.id,'NOW HAS ',hex.resources.iron,'IRON');
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
	//console.log('HEX',hex.id,'NOW HAS ',hex.resources.phos,'PHOS');
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
	//console.log('HEX',hex.id,'NOW HAS ',hex.resources.gold,'GOLD');
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
	//console.log('HEX',hex.id,'NOW HAS ',hex.resources.olds,'OLD ONES');
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

var arrSetupTiles = [];

function init(){
	
	//board = 'eastern';
	limit = 3;
	setups = 0;

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
	drawSetupTile(hex);
	drawOntoCanvas(row, col);
}

function drawAllSetupTiles(delay){
	if(arrSetupTiles.length <= 0){
		alert('Setup Complete!');
		t = 0;
		return;
	}
	var thisTile = arrSetupTiles.shift();
	row = thisTile[0];
	col = thisTile[1];
	var hex = grid[row][col];
	drawSetupTile(hex);
	drawOntoCanvas(row, col);
	t = setTimeout(drawAllSetupTiles, delay);
}

//drawOntoCanvas();

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
